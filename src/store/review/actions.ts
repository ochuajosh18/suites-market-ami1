import { AppThunk } from '..';
import axios from 'axios';

import { REVIEW_SET_PRODUCTREVIEW } from './types';
import { RATING_SET_PRODUCTRATING } from './types';

export const fetchReview = () : AppThunk => {
    return async(dispatch, getState) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        let { userType, id } = getState().login.user;

        try {
            let url;
            if(userType === 'VENDOR') {
                url = `${apiUrl}/product/review?vendorId=${id}`
            }
            else {
                url = `${apiUrl}/product/review`
            }

            let result = await axios.get(url);

            if(result && result.status === 200) {
                dispatch({
                    type: REVIEW_SET_PRODUCTREVIEW,
                    payload: result.data
                });
            }     
        }
        catch(e) {
            console.log({ m: 'fetchReview | error', d: e });
        }
    }
}

export const onChangeSearchReview = (keyword:string) : AppThunk => {
    return async(dispatch, getState) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        try {
            let result = await axios.get(`${apiUrl}/product/review?keyword=${keyword}`);

            if(result && result.status === 200) {
                dispatch({
                    type: REVIEW_SET_PRODUCTREVIEW,
                    payload: result.data
                });
            }   
        }
        catch(e) {
            console.log({ m: 'onChangeSearchReview | error', d: e });
        }
    }
}

export const fetchRating = () : AppThunk => {
    return async(dispatch, getState) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        let { userType, id } = getState().login.user;

        try {
            let url;
            if(userType === 'VENDOR') {
                url = `${apiUrl}/product/review/rating?vendorId=${id}`
            }
            else {
                url = `${apiUrl}/product/review/rating`
            }

            let result = await axios.get(url);

            if(result && result.status === 200) {
                dispatch({
                    type: RATING_SET_PRODUCTRATING,
                    payload: result.data
                });
            }     
        }
        catch(e) {
            console.log({ m: 'fetchRating | error', d: e });
        }
    }
}

export const onChangeSearchRating = (keyword:string) : AppThunk => {
    return async(dispatch, getState) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        try {
            let result = await axios.get(`${apiUrl}/product/review/rating?keyword=${keyword}`);

            if(result && result.status === 200) {
                dispatch({
                    type: RATING_SET_PRODUCTRATING,
                    payload: result.data
                });
            }
        }
        catch(e) {
            console.log({ m: 'fetchRating | error', d: e });
        }
    }
}