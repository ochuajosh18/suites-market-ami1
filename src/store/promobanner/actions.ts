import { AppThunk } from "..";
import { 
    SET_PROMO_BANNER_STATE, 
    PromoBannerAction, 
    PromoBannerInput, 
    BannerSelectedCategoryType
} from "./types";
import { SET_SYSTEM_STATE } from '../system/types';

import { toastError, toastSuccess } from '../../modules/Toast';

import axios from 'axios';
import filter from 'lodash/filter';
import map from 'lodash/map';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import moment from 'moment';

const API_URL = process.env.REACT_APP_API_URL;

export const setPromoBannerState = (input: PromoBannerInput) : PromoBannerAction => {
    return {
        type: SET_PROMO_BANNER_STATE,
        payload: input
    }
}

export const getHomePageBanners = () : AppThunk => {
    return async (dispatch, getState) => {
        dispatch({ type: SET_PROMO_BANNER_STATE, payload: { promoBannerLoading: true }})
        try {
            const banners = await axios.get(`${API_URL}/home/banner`);
            console.log(banners);
            if (banners.status === 200) {
                dispatch({
                    type: SET_PROMO_BANNER_STATE,
                    payload: {
                        banners: banners.data.banner
                    }
                })
            }
        } catch (e) {
            console.log(e.response.data);
            toastError(e.toString());
        } finally {
            dispatch({ type: SET_PROMO_BANNER_STATE, payload: { promoBannerLoading: false }})
        }
    }
}

export const getAllVendors = () : AppThunk => {
    return async (dispatch, getState) => {
        try {
            const vendors = await axios.get(`${API_URL}/user/VENDOR?approved=true`);
            if (vendors.status === 200) {
                dispatch({
                    type: SET_PROMO_BANNER_STATE,
                    payload: {
                        vendors: vendors.data
                    }
                })
            }
        } catch (e) {
            console.log(e);
            toastError(e.toString());
        }
    }
}

export const getVendorBanners = (vendorId: string) : AppThunk => {
    return async (dispatch, getState) => {
        dispatch({ type: SET_PROMO_BANNER_STATE, payload: { promoBannerLoading: true }})
        try {
            const banners = await axios.get(`${API_URL}/user/banner?id=${vendorId}`);
            if (banners.status === 200) {
                if (banners.data.banner) {
                    dispatch({
                        type: SET_PROMO_BANNER_STATE,
                        payload: {
                            banners: banners.data.banner
                        }
                    })
                } else {
                    dispatch({
                        type: SET_PROMO_BANNER_STATE,
                        payload: {
                            banners: []
                        }
                    })
                }
            }
        } catch (e) {
            console.log(e);
            toastError(e.toString());
        } finally {
            dispatch({ type: SET_PROMO_BANNER_STATE, payload: { promoBannerLoading: false }})
        }
    }
}

export const getAllCategories = () : AppThunk => {
    return async (dispatch, getState) => {
        try {
            const categories = await axios.get(`${API_URL}/product/category`);
            
            if (categories.status === 200) {
                dispatch({
                    type: SET_PROMO_BANNER_STATE,
                    payload: {
                        bannerTierOneCategories: categories.data
                    }
                })
            }
        } catch (e) {
            console.log(e);
            toastError(e.toString());
        }
    }
}

export const addBanner = () : AppThunk => {
    return async (dispatch, getState) => {
        dispatch({ type: SET_PROMO_BANNER_STATE, payload: { bannerSaveLoading: true }});
        try {
            const { activePromoBanner, promoBannerTabs, selectedVendor } = getState().promobanner;
            const { userType } = getState().login.user;
            // Validate Required fields
            if (activePromoBanner) {
                if (!activePromoBanner.bannerName) {
                    toastError('Missing banner name');
                    return true;
                }
                if (activePromoBanner.bannerSelectedCategory.length <= 0) {
                    toastError('Atleast one category is required');
                    return true;
                }
                if (typeof activePromoBanner.bannerImage.file === 'undefined') {
                    toastError('Missing banner image');
                    return true;
                }

                let banner : { name: string, category: Array<BannerSelectedCategoryType>, startDate: string, endDate: string, isActive: boolean, bannerNumber: number, dateUpdated: string, image?: string }= {
                    name: activePromoBanner.bannerName,
                    category: activePromoBanner.bannerSelectedCategory,
                    startDate: activePromoBanner.bannerStartDate,
                    endDate: activePromoBanner.bannerEndDate,
                    isActive: activePromoBanner.bannerStatus,
                    bannerNumber: getState().promobanner.banners.length + 1,
                    dateUpdated: moment().format()
                };

                // Upload banner thumbnail
                let uploadFail = false;
                if (activePromoBanner) {
                    if (typeof activePromoBanner.bannerImage.file !== 'undefined') {
                        const mediaForm = new FormData();
                        mediaForm.append('media', activePromoBanner.bannerImage.file!);
                        try {
                            const upRes = await axios.post(`${API_URL}/media/upload/thumbnail`, mediaForm);
                            if (upRes.status === 200) {
                                console.log(upRes)
                                banner = {
                                    ...banner,
                                    image: upRes.data.thumbnail.path as string
                                }
                                console.log(banner)
                            }
                        } catch (e) {
                            if(e.response.data.error.message === "Each file cannot exceed 5mb") toastError('File cannot exceed 5mb');
                            uploadFail = true;
                        }
                    }
                }

                if (!uploadFail) {
                    const updateBody = {
                        banner: [
                            ...getState().promobanner.banners,
                            banner
                        ]
                    }
                    const vendorId = userType === 'ADMIN' ? selectedVendor?.id : getState().login.user.id
                    let url = promoBannerTabs === 'Home Page' ? `${API_URL}/home/banner` : `${API_URL}/user/banner/${vendorId}`;
                    console.log(url)
                    const updateRes = await axios.put(url, updateBody);
                    if (updateRes.status === 204) {
                        toastSuccess('Banner successfully created');
                        setTimeout(() => {
                            promoBannerTabs === 'Home Page' ? dispatch(getHomePageBanners()) : selectedVendor && dispatch(getVendorBanners(vendorId));
                            dispatch({
                                type: SET_SYSTEM_STATE,
                                payload: {
                                    shallRedirect: true,
                                    redirectTo: '/market/promobanner'
                                }
                            })
                        }, 1000);
                    }
                }
            }

        } catch (e) {
            console.log(e.response);
            toastError(e.toString());
        } finally {
            dispatch({ type: SET_PROMO_BANNER_STATE, payload: { bannerSaveLoading: false }});
        }
    }
}

export const deleteBanner = (bannerNumber: string) : AppThunk => {
    return async (dispatch, getState) => {
        dispatch({ type: SET_PROMO_BANNER_STATE, payload: { deleteModalIsLoading: true }})
        try {
            let { banners, promoBannerTabs, selectedVendor } = getState().promobanner;
            banners = filter(banners, (b) => b.bannerNumber !== parseInt(bannerNumber));
            banners = map(banners, (b, index) => ({ ...b, bannerNumber: index + 1}))

            let url = promoBannerTabs === 'Home Page' ? `${API_URL}/home/banner` : `${API_URL}/user/banner/${selectedVendor?.id}`;
            const updateBody = { banner: [ ...banners ] }
            const updateRes = await axios.put(url, updateBody);

            if (updateRes.status === 204) {
                toastSuccess('Banner successfully deleted');
                setTimeout(() => {
                    promoBannerTabs === 'Home Page' ? dispatch(getHomePageBanners()) : selectedVendor && dispatch(getVendorBanners(selectedVendor?.id));
                    dispatch({
                        type: SET_SYSTEM_STATE,
                        payload: {
                            shallRedirect: true,
                            redirectTo: '/market/promobanner'
                        }
                    })
                    dispatch({ type: SET_PROMO_BANNER_STATE, payload: { deleteModalIsOpen: false }})
                }, 1000);
            }
        } catch (e) {
            console.log(e);
            toastError(e.toString());
        } finally {
            dispatch({ type: SET_PROMO_BANNER_STATE, payload: { deleteModalIsLoading: false }})
        }
    }
}

export const updateBanner = (bannerNumber: string) : AppThunk => {
    return async (dispatch, getState) => {
        dispatch({ type: SET_PROMO_BANNER_STATE, payload: { deleteModalIsLoading: true }})
        try {
            let { banners, promoBannerTabs, selectedVendor, activePromoBanner } = getState().promobanner;
            let banner = find(banners, { bannerNumber: parseInt(bannerNumber) });
            if (activePromoBanner && banner) {
                if (!activePromoBanner.bannerName) {
                    toastError('Missing banner name');
                    return true;
                }
                if (activePromoBanner.bannerSelectedCategory.length <= 0) {
                    toastError('Atleast one category is required');
                    return true;
                }

                banner = {
                    ...banner,
                    name: activePromoBanner?.bannerName,
                    startDate: activePromoBanner?.bannerStartDate,
                    endDate: activePromoBanner?.bannerEndDate,
                    category: activePromoBanner?.bannerSelectedCategory,
                    isActive: activePromoBanner?.bannerStatus
                }

                // Upload banner thumbnail
                let uploadFail = false;
                if (typeof activePromoBanner.bannerImage.file !== 'undefined') {
                    const mediaForm = new FormData();
                    mediaForm.append('media', activePromoBanner.bannerImage.file!);
                    try {
                        const upRes = await axios.post(`${API_URL}/media/upload/thumbnail`, mediaForm);
                        if (upRes.status === 200) {
                            console.log(upRes)
                            banner = {
                                ...banner,
                                image: upRes.data.thumbnail.path as string
                            }
                            console.log(banner)
                        }
                    } catch (e) {
                        if(e.response.data.error.message === "Each file cannot exceed 5mb") toastError('File cannot exceed 5mb');
                        uploadFail = true;
                    }
                }

                if (!uploadFail) {
                    banners = filter(banners, (b) => b.bannerNumber !== parseInt(bannerNumber));
                    banners = orderBy([ ...banners, banner], ['bannerNumber'],['asc']);
    
                    let url = promoBannerTabs === 'Home Page' ? `${API_URL}/home/banner` : `${API_URL}/user/banner/${selectedVendor?.id}`;
                    const updateBody = { banner: [ ...banners ] }
                    const updateRes = await axios.put(url, updateBody);
        
                    if (updateRes.status === 204) {
                        toastSuccess('Banner successfully updated');
                        setTimeout(() => {
                            promoBannerTabs === 'Home Page' ? dispatch(getHomePageBanners()) : selectedVendor && dispatch(getVendorBanners(selectedVendor?.id));
                            dispatch({
                                type: SET_SYSTEM_STATE,
                                payload: {
                                    shallRedirect: true,
                                    redirectTo: '/market/promobanner'
                                }
                            })
                            dispatch({ type: SET_PROMO_BANNER_STATE, payload: { deleteModalIsOpen: false }})
                        }, 1000);
                    }
                }
            }

        } catch (e) {
            console.log(e);
            toastError(e.toString());
        } finally {
            dispatch({ type: SET_PROMO_BANNER_STATE, payload: { deleteModalIsLoading: false }})
        }
    }
}

