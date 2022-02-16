import {
    SET_NEWS_STATE,
    NewsAction,
    BasicNewsStateInput,
    DynamicBasicNewsType,
    News,
    BasicNewsMedia
} from './types';
import { AppThunk } from '../';
import axios from 'axios';
import { toastError, toastSuccess } from '../../modules/Toast';
import map from 'lodash/map';
import filter from 'lodash/filter';
import { v4 } from 'uuid';
const API_URL = process.env.REACT_APP_API_URL;

export const setNewsState = (newState: BasicNewsStateInput): NewsAction => ({
    type: SET_NEWS_STATE,
    payload: newState
});

export const loadNews = (keyword?: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_NEWS_STATE,
            payload: { 
                newsListLoading: true,
                newsSearch: keyword ? keyword : getState().news.newsSearch,
                news: []
            }
        });

        try {
            const newsRes = await axios.get(`${API_URL}/news${keyword ? `?search=${keyword}` : ''}`)
            
            if (newsRes.status === 200) {
                dispatch({
                    type: SET_NEWS_STATE,
                    payload: { 
                        news: map(newsRes.data, (news: News) => ({
                            ...news,
                            media: [
                                ...map(news.brochures!, (brochure) => ({...brochure, id: v4() })), 
                                ...map(news.pdf!, (pdf) => ({...pdf, id: v4() })), 
                                ...map(news.videos!, (video) => ({...video, id: v4() })), 
                            ]
                        })),
                        activeNewsLoading: true
                    }
                });
            }
        }
        catch (e) {
            toastError("Something went wrong. Please contact the administrator");
        }
        finally {
            dispatch({
                type: SET_NEWS_STATE,
                payload: { newsListLoading: false, activeNewsLoading: false }
            });
        }
    }
}


export const uploadNewsMedia = (file: File): AppThunk => {
    return async (dispatch, getState) => {
        // add to local media
        const { activeNews } = getState().news;
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

        const existingMedia = typeof activeNews![`${mediaType}s`] !== 'undefined' ? (activeNews![`${mediaType}s`] as Array<BasicNewsMedia>): [] as Array<BasicNewsMedia>;
        let newsData: { [field: string]: DynamicBasicNewsType } = { 
            ...activeNews,
            [`${mediaType}s`]: [...existingMedia, pseudoMedia]
        };
        
        dispatch({
            type: SET_NEWS_STATE,
            payload: { 
                activeNews: newsData
            }
        });
        // upload media, then reload media list
        try {
            const mediaForm = new FormData();
            mediaForm.append('media', file);
            const res = await axios.post(`${API_URL}/media/basic/upload/news?mediaType=${mediaType}`, mediaForm);
            if (res.status === 200 || res.status === 204) {
                dispatch({
                    type: SET_NEWS_STATE,
                    payload: {
                        activeNews: {
                            ...activeNews,
                            [`${mediaType}s`]: filter([...(activeNews![`${mediaType}s`] as Array<BasicNewsMedia>), ...res.data.media], (media) => media.id !== mediaId)
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

export const saveNews = (): AppThunk => {
    return async (dispatch, getState) => {
        const { activeNews } = getState().news;
        dispatch({
            type: SET_NEWS_STATE,
            payload: { activeNewsLoading: true }
        });
        try {
            if (activeNews!.id.indexOf('NEWS') === -1) {
                const data: { [name: string]: DynamicBasicNewsType } = {
                    ...activeNews,
                    isActive: activeNews!.isActive ? activeNews!.isActive : false,
                    startDate: activeNews!.startDate,
                    endDate: activeNews!.endDate
                }
                delete data.id;
                const res = await axios.post(`${API_URL}/news`, data);
                if (res.status === 200 || res.status === 204) {
                    toastSuccess("News created");
                    dispatch({
                        type: SET_NEWS_STATE,
                        payload: { activeNews: { ...activeNews, id: res.data.id } }
                    });
                    dispatch(loadNews());
                }
            }
            else {
                const res = await axios.put(`${API_URL}/news/${activeNews!.id}`, {
                    ...activeNews,
                    startDate: activeNews!.startDate,
                    endDate: activeNews!.endDate
                });
                if (res.status === 200 || res.status === 204) {
                    toastSuccess("News Updated");
                    dispatch(loadNews());
                }
            }
        }
        catch (e) {

        }
        finally {
            dispatch({
                type: SET_NEWS_STATE,
                payload: { activeNewsLoading: false }
            });
        }
    }
}



export const deleteNews = (id: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_NEWS_STATE,
            payload: { newsListLoading: true }
        });

        try {
            const res = await axios.delete(`${API_URL}/news/${id}`);

            if (res.status === 200 || res.status === 204) {
                toastSuccess("News deleted");
                if (id === getState().news.activeNewsId) {
                    dispatch({
                        type: SET_NEWS_STATE,
                        payload: { activeNews: undefined, activeNewsId: '' }
                    });
                }
                dispatch(loadNews());
            }
        }
        catch (e) {

        }
        finally {
            dispatch({
                type: SET_NEWS_STATE,
                payload: { newsListLoading: false }
            });
        }
    }
}