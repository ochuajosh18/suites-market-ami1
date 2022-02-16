import {
    SET_PROMOTION_STATE,
    PromotionAction,
    PromotionState,
} from './types'

const INITIAL_STATE: PromotionState = {
    activePromotion: undefined,
    activePromotionId: '',
    promotions: [],
    promotionSearch: '',
    promotionListLoading: false,
    mediaPreviewVisible: false,
    activePromotionLoading: false,
    tierOneCategories:[],
    tierTwoCategories: [],
    tierThreeCategories: [],
    selectedTierOneCategory: '',
    selectedTierTwoCategory: '',
    selectedTierThreeCategory: '',
    hasSubCategory: false
}

export default (state = INITIAL_STATE, action: PromotionAction): PromotionState => {
    switch (action.type) {
        case SET_PROMOTION_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}