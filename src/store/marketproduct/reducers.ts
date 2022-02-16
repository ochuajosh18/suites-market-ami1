import {
    SET_MARKET_PRODUCT_STATE,
    MarketProductState,
    MarketProductAction
} from './types';

const INITIAL_STATE: MarketProductState = {
    activeProductId: '',
    activeSkuId: '',
    products: [],
    productSkus: [],
    productListLoading: false,
    productsLoading: false,
    productEditType: 'CREATE',
    productSaving: false,
    activeFields: [],
    tier1Categories:[],
    tier2Categories: [],
    tier3Categories: [],
    selectedTier1Category: '',
    selectedTier2Category: '',
    selectedTier3Category: '',
    hasSubCategory: false,
    activeTab: 'Active',
    activeProductLoading: false,
    activeProductError: false,
    tierOneCategories: [],
    tierTwoCategories: [],
    tierThreeCategories: [],
    productViewActiveTab: 'Common Information',
    productViewLoading: false,
    productSearch: '',
    productVariantsLoading: false,
    productVariants: [],
    activeProductVariantLoading: false,
    activeProductFeaturedSku: '',
    mediaToDelete: []
};

export default (state = INITIAL_STATE, action: MarketProductAction): MarketProductState => {
    switch (action.type) {
        case SET_MARKET_PRODUCT_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};