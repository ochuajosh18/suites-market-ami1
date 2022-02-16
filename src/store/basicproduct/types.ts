import { Field } from "../fields/types";
import { GenericMedia } from '../system/types';
import { Tier1Type, Tier2Type } from '../product/types';
import { Geolocation } from "../customer/types";
export type ProductEditType = 'CREATE' | 'UPDATE';
export type DynamicBasicProductInput = 
number |
string | 
boolean |
Array<string> | 
Array<BasicProduct> | 
Array<BasicProductSku> | 
BasicProduct | boolean |  
Array<BasicProductMedia> | 
BasicProductSku | 
ProductEditType |
Array<Tier1Type> | 
Array<Tier2Type> |
[number, number] |
GenericMedia |
Array<GenericMedia> |
null |
Geolocation |
undefined;

export interface BasicProductType<T> {
    [key: string]: T;
}

export interface BasicProduct extends BasicProductType<DynamicBasicProductInput> {
    id: string;
    name: string;
    type: string;
    featuredSku: string;
    brand: string;
    editing?: boolean;
}

export interface BasicProductSku extends BasicProductType<DynamicBasicProductInput> {
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

export interface BasicProductMedia {
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

export interface BasicProductState {
    activeProductId: string;
    activeProduct?: BasicProduct;
    activeProductSkus?: Array<BasicProductSku>
    activeSku?: BasicProductSku;
    activeSkuId: string;
    products: Array<BasicProduct>;
    productSkus: Array<BasicProductSku>;
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
    productVariants: Array<BasicProductSku>;
    activeProductFeaturedSku: string;
    activeVariantCopy?: BasicProductSku;
    activeProductVariant?: BasicProductSku;
    activeProductVariantLoading: boolean;
    mediaToDelete: Array<string>;
    fields: Array<Field>;
    sections: Array<string>;
    variantFields: Array<Field>;
    variantSections: Array<string>;
    isDuplicating: boolean;
}

export interface BasicProductStateInput {
    [name: string]: DynamicBasicProductInput
}

// types
export const SET_BASIC_PRODUCT_STATE = 'set_basic_product_state';

// action interfaces
export interface SetCustomerStateAction {
    type: typeof SET_BASIC_PRODUCT_STATE;
    payload: BasicProductStateInput;
}

export type BasicProductAction = SetCustomerStateAction;