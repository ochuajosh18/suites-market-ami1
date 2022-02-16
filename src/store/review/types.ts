import { AnyAction } from 'redux';

interface ProductReview {
    customerName: string;
    productName: string;
    comment: string;
    orderNumber: string
    date: string
}

interface ProductRating {
    productName: string;
    rating: number; 
}

export interface ReviewState {
    productReview: Array<ProductReview>
    productRating: Array<ProductRating>
};

export const REVIEW_SET_PRODUCTREVIEW = 'review_set_productreview';
export const RATING_SET_PRODUCTRATING = 'rating_set_productrating';

export type ReviewAction = AnyAction;