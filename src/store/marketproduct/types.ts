import { Field } from "../fields/types";
import { GenericMedia } from '../system/types';
import { Tier1Type, Tier2Type } from '../product/types';
export type ProductEditType = 'CREATE' | 'UPDATE';
export type DynamicMarketProductInput = 
number |
string | 
boolean |
Array<string> | 
Array<MarketProduct> | 
Array<MarketProductSku> | 
MarketProduct | boolean |  
Array<MarketProductMedia> | 
MarketProductSku | 
ProductEditType |
Array<Tier1Type> | 
Array<Tier2Type> |
GenericMedia |
undefined;

export interface MarketProductType<T> {
    [key: string]: T;
}

export interface MarketProduct extends MarketProductType<DynamicMarketProductInput> {
    id: string;
    name: string;
    type: string;
    featuredSku: string;
    brand: string;
    editing?: boolean;
    image?: GenericMedia;
}

export interface MarketProductSku extends MarketProductType<DynamicMarketProductInput> {
    id: string | undefined;
    skuNumber: string;
    size: string;
    media: Array<GenericMedia>;
    packagingSize: string;
    isTopTen: boolean;
    mainSku: boolean;
    editing?: boolean;
    isDeleted: boolean;
}

export interface MarketProductMedia {
    id?: string;
    name: string;
    path: string;
    type: string;
    size: number;
    loading?: boolean;
}
export interface HierarchyOne {
    name: string
    h1Thumbnail: {
        name: string;
        path: string;
        size: number;
        type: string;
    },
    h2: Array<HierarchyTwo>;
}

export interface HierarchyTwo {
    name: string
    h2Thumbnail: {
        name: string;
        path: string;
        size: number;
        type: string;
    },
    h3: Array<string>;
}

export interface MarketProductState {
    activeProductId: string;
    activeProduct?: MarketProduct;
    activeProductSkus?: Array<MarketProductSku>
    activeSku?: MarketProductSku;
    activeSkuId: string;
    products: Array<MarketProduct>;
    productSkus: Array<MarketProductSku>;
    productListLoading: boolean;
    productsLoading: boolean;
    productEditType: ProductEditType;
    productSaving: boolean;
    activeFields: Array<Field>;
    tier1Categories: Array<Tier1Type>;
    tier2Categories: Array<Tier2Type>;
    tier3Categories: Array<string>;
    selectedTier1Category: string;
    selectedTier2Category: string;
    selectedTier3Category: string;
    hasSubCategory: boolean;
    activeTab: string;
    activeProductLoading: boolean;
    activeProductError: boolean;
    tierOneCategories: Array<HierarchyOne>;
    tierTwoCategories: Array<HierarchyTwo>;
    tierThreeCategories: Array<string>;
    productViewActiveTab: string;
    productViewLoading: boolean;
    productSearch: string;
    productVariantsLoading: boolean;
    productVariants: Array<MarketProductSku>;
    activeProductFeaturedSku: string;
    activeProductVariant?: MarketProductSku;
    activeProductVariantLoading: boolean;
    mediaToDelete: Array<string>;
}

export interface MarketProductStateInput {
    [name: string]: DynamicMarketProductInput
}

// types
export const SET_MARKET_PRODUCT_STATE = 'set_market_product_state';

// action interfaces
export interface SetCustomerStateAction {
    type: typeof SET_MARKET_PRODUCT_STATE;
    payload: MarketProductStateInput;
}

export type MarketProductAction = SetCustomerStateAction;