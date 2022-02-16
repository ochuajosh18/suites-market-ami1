import { 
    SET_PROMO_BANNER_STATE,
    PromoBannerAction, 
    PromoBannerState 
} from './types';

const INITIAL_STATE: PromoBannerState = {
    promoBannerTabs: 'Home Page',
    promoBannerLoading: false,
    banners: [],
    vendors: [],
    defaultBanner: undefined,
    bannerTierOneCategories: [],
    bannerTierTwoCategories: [],
    bannerTierThreeCategories:[ ],
    bannerSelectCategoryModalIsOpen: false,
    bannerSaveLoading: false,
    deleteModalIsOpen: false,
    deleteModalIsLoading: false
}

export default (state = INITIAL_STATE, action: PromoBannerAction): PromoBannerState => {
    switch (action.type) {
        case SET_PROMO_BANNER_STATE:
            return { ...state, ...action.payload }
        default:
            return state;
    }
}