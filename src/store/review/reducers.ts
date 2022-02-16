import {
    ReviewState,
    ReviewAction,
    REVIEW_SET_PRODUCTREVIEW,
    RATING_SET_PRODUCTRATING
} from './types';

const INITIAL_STATE: ReviewState = {
    productReview: [],
    productRating: [],
};

const reviewReducer = ( state = INITIAL_STATE, action: ReviewAction): ReviewState => {
    switch (action.type) {
        case REVIEW_SET_PRODUCTREVIEW: {
            return { ...state, productReview: action.payload }
        }
        case RATING_SET_PRODUCTRATING: {
            return { ...state, productRating: action.payload }
        }
        default:
            return state;
    }
}

export default reviewReducer