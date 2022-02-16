import { Tier1Type, Tier2Type } from '../product/types';
export type DynamicBasicPromotionType = 
string | 
boolean |
Array<string> | 
number |
Array<BasicPromotionMedia> |
Promotion |
Array<Promotion> | 
React.ChangeEvent<HTMLInputElement> |
BasicPromotionMedia |
Array<Tier1Type> | 
Array<Tier2Type> |
undefined;

export interface BasicPromotionMedia extends BasicPromotionType<DynamicBasicPromotionType> {
    id?: string;
    name: string;
    path: string;
    type: string;
    size: number;
    loading?: boolean;
}

export interface BasicPromotionType<T> {
    [key: string]: T;
}

export interface BasicPromotionStateInput {
    [name: string]: DynamicBasicPromotionType
}

export interface Promotion extends BasicPromotionType<DynamicBasicPromotionType> {
    id: string;
    isActive: boolean;
    title: string;
    subtitle: string;
    category: string;
    description: string;
    startDate: string;
    endDate: string;
    pdf: Array<BasicPromotionMedia>;
    brochures: Array<BasicPromotionMedia>;
    images: Array<BasicPromotionMedia>;
    videos: Array<BasicPromotionMedia>;
}

export interface PromotionState extends BasicPromotionType<DynamicBasicPromotionType> {
    activePromotionId: string;
    activePromotion: Promotion | undefined;
    promotions: Array<Promotion>;
    promotionSearch: string;
    promotionListLoading: boolean;
    activePromotionLoading: boolean;
    mediaToPreview?: BasicPromotionMedia;
    mediaPreviewVisible: boolean;
    tierOneCategories: Array<Tier1Type>;
    tierTwoCategories: Array<Tier2Type>;
    tierThreeCategories: Array<string>;
    selectedTierOneCategory: string;
    selectedTierTwoCategory: string;
    selectedTierThreeCategory: string;
    hasSubCategory: boolean;
}

export const SET_PROMOTION_STATE = 'set_promotion_state';

export interface setPromotionStateAction {
    type: typeof SET_PROMOTION_STATE;
    payload: BasicPromotionStateInput;
}

export type PromotionAction = setPromotionStateAction;
