import {
    SET_PROMOTION_STATE,
    Promotion,
    PromotionAction,
    BasicPromotionStateInput,
    DynamicBasicPromotionType,
    BasicPromotionMedia
} from './types';
import { AppThunk } from '../';
import { toastError, toastSuccess } from '../../modules/Toast';
import { v4 } from 'uuid';
import axios from 'axios';
import map from 'lodash/map';
import filter from 'lodash/filter';
const API_URL = process.env.REACT_APP_API_URL;

export const setPromotionState = (newState: BasicPromotionStateInput): PromotionAction => ({
    type: SET_PROMOTION_STATE,
    payload: newState
});


export const loadPromotions = (keyword?: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_PROMOTION_STATE,
            payload: { 
                promotionListLoading: true,
                promotionSearch: keyword ? keyword : getState().promotion.promotionSearch,
                promotion: []
            }
        });

        try {
            const newsRes = await axios.get(`${API_URL}/product/basic/promotion${keyword ? `?search=${keyword}` : ''}`)
            
            if (newsRes.status === 200) {
                dispatch({
                    type: SET_PROMOTION_STATE,
                    payload: { 
                        promotions: map(newsRes.data, (promotion: Promotion) => ({
                            ...promotion,
                            media: [
                                ...map(promotion.brochures!, (brochure) => ({...brochure, id: v4() })), 
                                ...map(promotion.pdf!, (pdf) => ({...pdf, id: v4() })), 
                                ...map(promotion.videos!, (video) => ({...video, id: v4() })), 
                            ]
                        })),
                        activePromotionLoading: true
                    }
                });
            }
        }
        catch (e) {
            toastError("Something went wrong. Please contact the administrator");
        }
        finally {
            dispatch({
                type: SET_PROMOTION_STATE,
                payload: { promotionListLoading: false, activePromotionLoading: false }
            });
        }
    }
}


export const uploadPromotionMedia = (file: File): AppThunk => {
    return async (dispatch, getState) => {
        // add to local media
        const { activePromotion } = getState().promotion;
        const mediaId = v4();
        const pseudoMedia = {
            id: mediaId,
            name: file.name,
            type: file.type,
            path: '',
            size: file.size / 1000000, // convert Bytes to MB
            loading: true
        }
        let mediaType: 'image' | 'video' | 'brochure' = file.type.toLowerCase().indexOf('image') > -1 ? 'image' : 'video';
        mediaType = file.type.toLowerCase().indexOf('application/pdf') > -1 ? 'brochure' : mediaType;

        const existingMedia = typeof activePromotion![`${mediaType}s`] !== 'undefined' ? (activePromotion![`${mediaType}s`] as Array<BasicPromotionMedia>): [] as Array<BasicPromotionMedia>;
        let newsData: { [field: string]: DynamicBasicPromotionType } = { 
            ...activePromotion,
            [`${mediaType}s`]: [...existingMedia, pseudoMedia]
        };
        
        dispatch({
            type: SET_PROMOTION_STATE,
            payload: { 
                activePromotion: newsData
            }
        });
        // upload media, then reload media list
        try {
            const mediaForm = new FormData();
            mediaForm.append('media', file);
            const res = await axios.post(`${API_URL}/media/basic/upload/promotion?mediaType=${mediaType}`, mediaForm);
            if (res.status === 200 || res.status === 204) {
                dispatch({
                    type: SET_PROMOTION_STATE,
                    payload: {
                        activePromotion: {
                            ...activePromotion,
                            [`${mediaType}s`]: filter([...(activePromotion![`${mediaType}s`] as Array<BasicPromotionMedia>), ...res.data.media], (media) => media.id !== mediaId)
                        }
                    }
                })
            }
        }
        catch (e) {
            toastError("Something went wrong. Please contact the system administrator");
        }
    }
}

export const savePromotion = (): AppThunk => {
    return async (dispatch, getState) => {
        const { activePromotion } = getState().promotion;
        dispatch({
            type: SET_PROMOTION_STATE,
            payload: { activePromotionLoading: true }
        });
        try {
            if (activePromotion!.id.indexOf('PROMOTION') === -1) {
                let data: { [name: string]: DynamicBasicPromotionType } = {
                    ...activePromotion,
                    isActive: activePromotion!.isActive ? activePromotion!.isActive : false,
                    startDate: activePromotion!.startDate,
                    endDate: activePromotion!.endDate,
                    subTitle: activePromotion!.subtitle
                }
                delete data.id;
                const res = await axios.post(`${API_URL}/product/basic/promotion`, data);
                if (res.status === 200 || res.status === 204) {
                    toastSuccess("Promotion created");
                    dispatch({
                        type: SET_PROMOTION_STATE,
                        payload: { activePromotion: { ...activePromotion, id: res.data.id } }
                    });
                    dispatch(loadPromotions());
                }
            }
            else {
                const res = await axios.put(`${API_URL}/product/basic/promotion/${activePromotion!.id}`, {
                    ...activePromotion,
                    startDate: activePromotion!.startDate,
                    endDate: activePromotion!.endDate
                });
                if (res.status === 200 || res.status === 204) {
                    toastSuccess("Promotion Updated");
                    dispatch(loadPromotions());
                }
            }
        }
        catch (e) {

        }
        finally {
            dispatch({
                type: SET_PROMOTION_STATE,
                payload: { activePromotionLoading: false }
            });
        }
    }
}



export const deletePromotion = (id: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_PROMOTION_STATE,
            payload: { newsListLoading: true }
        });

        try {
            const res = await axios.delete(`${API_URL}/product/basic/promotion/${id}`);

            if (res.status === 200 || res.status === 204) {
                toastSuccess("Promotion deleted");
                if (id === getState().promotion.activePromotionId) {
                    dispatch({
                        type: SET_PROMOTION_STATE,
                        payload: { activePromotion: undefined, activePromotionId: '' }
                    });
                }
                dispatch(loadPromotions());
            }
        }
        catch (e) {

        }
        finally {
            dispatch({
                type: SET_PROMOTION_STATE,
                payload: { newsListLoading: false }
            });
        }
    }
}


export const fetchTierOneCategories = () : AppThunk => {
    return async (dispatch,) => {
        try {
            const categories = await axios.get(`${API_URL}/product/category/h1`);
            if(categories.status === 200 && categories.data.length > 0) {
                dispatch({ type: SET_PROMOTION_STATE, payload: { 'tierOneCategories' : categories.data } })
            }
        } catch (e) {
            console.log(e);
            alert(e.toString());
        }
    }
}

export const fetchTierTwoCategories = (h1: string) : AppThunk => {
    return async (dispatch) => {
        try {
            const categories = await axios.get(`${API_URL}/product/category/${h1}/h2`);
            if(categories.status === 200 && categories.data.length > 0) {
                dispatch({ type: SET_PROMOTION_STATE, payload: { 'tierTwoCategories' : categories.data } })
            }
        } catch (e) {
            console.log(e);
            alert(e.toString());
        }
    }
}

export const fetchTierThreeCategories = (h1: string, h2: string) : AppThunk => {
    return async (dispatch) => {
        try {
            const categories = await axios.get(`${API_URL}/product/category/${h1}/${h2}/h3`);
            if(categories.status === 200 && categories.data.h3.length > 0) {
                dispatch({ type: SET_PROMOTION_STATE, payload: { 'tierThreeCategories' : categories.data.h3 } })
            }
        } catch (e) {
            console.log(e);
            alert(e.toString());
        }
    }
}