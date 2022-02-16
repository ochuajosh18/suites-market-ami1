import {
    SET_BASIC_PRODUCT_STATE,
    BasicProductState,
    BasicProductAction
} from './types';

const INITIAL_STATE: BasicProductState = {
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
    mediaToDelete: [],
    fields: [],
    sections: [],
    variantFields: [],
    variantSections: [],
    isDuplicating: false
};

export default (state = INITIAL_STATE, action: BasicProductAction): BasicProductState => {
    switch (action.type) {
        case SET_BASIC_PRODUCT_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};