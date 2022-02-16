import { AnyAction } from 'redux';

export interface ProductState {
    skus: any;
    sku: any;
    products: any;
    filteredProducts: any;
    filteredVendors: any;
    selectedSKU: string;
    selectedProduct: string;
    addSKU: boolean;
    categories: any;
    imageContainerWidth: number;
    saveLoading: boolean;
    tabIndex: number;
    name: string;
    brand: string;
    type: string;
    material: string;
    shortDescription: string;
    longDescription: string;
    getProductDetailsLoading: boolean;
    specialPriceDisable: boolean;
    backDropLoading: boolean;
    availableFields: 'COLORSIZE' | 'COLOR' | 'SIZE' | '';
    vendorInfo: any;
    vendorProducts: any;
    selectedVendor: string;
    tier1Categories: Array<Tier1Type>;
    tier2Categories: Array<Tier2Type>;
    tier3Categories: Array<string>;
    selectedTier1Category: string;
    selectedTier2Category: string;
    selectedTier3Category: string;
    hasSubCategory: boolean;
}

export interface MediaType {
    name: string;
    path: string;
    size: number;
    type: string;
}

export interface Tier1Type {
    h1: string;
    h1Thumbnail: MediaType;
    hasSubCategory: boolean;
    tier2Categories?: Array<Tier2Type>;
}

export interface Tier2Type {
    h2: string;
    h2Thumbnail: MediaType;
    hasSubCategory: boolean;
}

export const LOAD_PRODUCTS = 'load_products';
export const CREATE_PRODUCTS = 'create_products';
export const EDIT_PRODUCTS = 'edit_products';
export const GET_PRODUCT = 'get_product';
export const FILTER_PRODUCT_LIST = 'filter_product_list';
export const SAVE_PRODUCT = 'save_product';
export const ADD_PRODUCT_BUTTON = 'add_product_button';
export const DELETE_PRODUCT = 'delete_product';
export const SELECT_SKU = 'select_sku';
export const ADD_SKU = 'add_sku';
export const SKU_BUTTON_STATUS = 'sku_button_status';
export const DELETE_SKU = 'delete_sku';
export const UPLOAD_IMAGE = 'upload_image';
export const CHANGE_MAIN_SKU = 'change_main_sku';
export const LOAD_CATEGORIES = 'load_categories';
export const TOOGLE_CATEGORY_ROW = 'toggle_category_row';
export const SELECT_CATEGORY = 'select_catergory';
export const SET_SELECTED_CATEGORY = 'set_selected_category';
export const DELETE_IMAGE = 'delete_image';
export const REORDER_IMAGE = 'reorder_image';

export const CHANGE_PRODUCT_NAME = 'change_product_name';
export const CHANGE_PRODUCT_CATEGORY = 'change_product_category';
export const CHANGE_PRODUCT_CATEGORY_LIST = 'change_product_category_list';
export const CHANGE_PRODUCT_BRAND = 'change_product_brand';
export const CHANGE_PRODUCT_MATERIAL = 'change_product_material';
export const CHANGE_PRODUCT_TYPE = 'change_product_type';
export const CHANGE_PRODUCT_DETAILED_DESCRIPTION =
    'change_product_detailed_description';
export const CHANGE_PRODUCT_LONG_DESCRIPTION =
    'change_product_long_description';
export const CHANGE_PRODUCT_QUANTITY = 'change_product_quantity';
export const CHANGE_PRODUCT_PRICE = 'change_product_price';
export const CHANGE_PRODUCT_PRICE_MIN = 'change_product_price_min';
export const CHANGE_PRODUCT_PRICE_MAX = 'change_product_price_max';
export const CHANGE_PRODUCT_DISCOUNT_PRICE = 'change_product_discount_price';
export const CHANGE_PRODUCT_SPECIAL_PRICE_MIN =
    'change_product_special_price_min';
export const CHANGE_PRODUCT_SPECIAL_PRICE_MAX =
    'change_product_special_price_max';

export const CHANGE_SKU_NUMBER = 'change_sku_number';
export const CHANGE_SKU_COLOR = 'change_sku_color';
export const CHANGE_SKU_SIZE = 'change_sku_size';

export const SET_IMAGE_CONTAINER_WIDTH = 'set_image_container_width';

export const SET_PRODUCT_ACTIVE_H1_CATEGORY = 'set_product_active_h1_category';
export const SET_PRODUCT_ACTIVE_H2_CATEGORY = 'set_product_active_h2_category';
export const SET_PRODUCT_ACTIVE_H3_CATEGORY = 'set_product_active_h3_category';
export const SET_PRODUCT_SAVE_LOADING = 'set_product_save_loading';
export const SET_NEW_PRODUCT_ID = 'set_new_product_id';

export const RESET_PRODUCT_TAB_INDEX = 'reset_product_tab_index';
export const SET_PRODUCT_TAB_INDEX = 'set_product_tab_index';

export const DELETE_PRODUCT_LAST_SKU_AND_PRODUCT = 'delete_product_last_sku_and_product';

export const SET_PRODUCT_GET_PRODUCT_DETAILS_LOADING = 'set_product_get_product_details_loading';
export const SET_PRODUCT_NEW_PRODUCT = 'set_product_new_product';

export const PRODUCT_SET_PRODUCT_SKU_ISACTIVE = 'product_set_product_sku_isactive'
export const PRODUCT_SET_MAIN_SKU = 'product_set_main_sku'
export const PRODUCT_SET_BACKDROP_LOADING = 'product_set_backdrop_loading';

export const PRODUCT_SET_AVAILABLE_FIELDS = 'product_set_available_fields';

export const GET_ALL_VENDOR = 'get_all_vendor'
export const GET_ALL_PRODUCT_BY_VENDOR = 'get_all_product_by_vendor';
export const CLEAR_SELECTED_TIER2AND3 = 'clear_selected_tier2and3';
export const CLEAR_SELECTED_TIER3 = 'clear_selected_tier3';

export const SET_PRODUCT_STATE = 'set_product_state';
export const FILTER_VENDOR_LIST = 'filter_vendor_list';
export const FILTER_VENDOR_PRODUCT = 'filter_vendor_product';


export interface ProductInput {
    [name: string] : string | boolean | number | Array<any>
}

export interface SetProductStateAction {
    type: typeof SET_PRODUCT_STATE;
    payload: ProductInput
}

export const EDIT_SKU = 'edit_sku';

export interface setTabIndexAction {
    type: typeof SET_PRODUCT_TAB_INDEX
    payload: number
}

export interface clearTier2And3Action {
    type: typeof CLEAR_SELECTED_TIER2AND3;
    payload: null
}

export interface clearTier3Action {
    type: typeof CLEAR_SELECTED_TIER3;
    payload: null
}

export interface resetProductTabIndexAction {
    type: typeof RESET_PRODUCT_TAB_INDEX
    payload: null
}

export interface LoadProductsAction {
    type: typeof LOAD_PRODUCTS;
    payload: any[];
}

export interface CreateProductsAction {
    type: typeof CREATE_PRODUCTS;
    payload: any;
}

export interface EditProductsAction {
    type: typeof EDIT_PRODUCTS;
    payload: any;
}

export interface GetProductAction {
    type: typeof GET_PRODUCT;
    payload: any;
}

export interface FilterProductListAction {
    type: typeof FILTER_PRODUCT_LIST;
    payload: any;
}

export interface SaveProductAction {
    type: typeof SAVE_PRODUCT;
    payload: any;
}

export interface AddProductButtonAction {
    type: typeof ADD_PRODUCT_BUTTON;
    payload: any;
}

export interface DeleteProductAction {
    type: typeof DELETE_PRODUCT;
    payload: string;
}

export interface SelectSKUAction {
    type: typeof SELECT_SKU;
    payload: string;
}

export interface AddSKUAction {
    type: typeof ADD_SKU;
    payload: any;
}

export interface DeleteSKUAction {
    type: typeof DELETE_SKU;
    payload: any;
}

export interface UploadImageAction {
    type: typeof UPLOAD_IMAGE;
    payload: any;
}

export interface LoadCategoriesAction {
    type: typeof LOAD_CATEGORIES;
    payload: any;
}

export interface ToggleCategoryRowAction {
    type: typeof TOOGLE_CATEGORY_ROW;
    payload: any;
}

export interface SelectCategoryAction {
    type: typeof SELECT_CATEGORY;
    payload: any;
}

export interface DeleteImageAction {
    type: typeof DELETE_IMAGE;
    payload: string;
}

export interface ReorderImageAction {
    type: typeof REORDER_IMAGE;
    payload: any;
}

/* Change events */
export interface ChangeProductNameAction {
    type: typeof CHANGE_PRODUCT_NAME;
    payload: string;
}

export interface ChangeProductCategoryAction {
    type: typeof CHANGE_PRODUCT_CATEGORY;
    payload: string;
}

export interface ChangeProductCategoryListAction {
    type: typeof CHANGE_PRODUCT_CATEGORY_LIST;
    payload: any;
}

export interface ChangeProductBrandAction {
    type: typeof CHANGE_PRODUCT_BRAND;
    payload: string;
}

export interface ChangeProductMaterialAction {
    type: typeof CHANGE_PRODUCT_MATERIAL;
    payload: string;
}

export interface ChangeProductTypeAction {
    type: typeof CHANGE_PRODUCT_TYPE;
    payload: string;
}

export interface ChangeProductDetailedDescriptionAction {
    type: typeof CHANGE_PRODUCT_DETAILED_DESCRIPTION;
    payload: string;
}

export interface ChangeProductLongDescriptionAction {
    type: typeof CHANGE_PRODUCT_LONG_DESCRIPTION;
    payload: string;
}

export interface ChangeProductQuantityAction {
    type: typeof CHANGE_PRODUCT_QUANTITY;
    payload: number;
}

export interface ChangeProductPriceAction {
    type: typeof CHANGE_PRODUCT_PRICE;
    payload: number;
}

export interface ChangeProductPriceMinAction {
    type: typeof CHANGE_PRODUCT_PRICE_MIN;
    payload: number;
}

export interface ChangeProductPriceMaxAction {
    type: typeof CHANGE_PRODUCT_PRICE_MAX;
    payload: number;
}

export interface ChangeProductDiscountPriceAction {
    type: typeof CHANGE_PRODUCT_DISCOUNT_PRICE;
    payload: number;
}

export interface ChangeProductSpecialPriceMinAction {
    type: typeof CHANGE_PRODUCT_SPECIAL_PRICE_MIN;
    payload: number;
}

export interface ChangeProductSpecialPriceMaxAction {
    type: typeof CHANGE_PRODUCT_SPECIAL_PRICE_MAX;
    payload: number;
}

export interface ChangeSKUNumberAction {
    type: typeof CHANGE_SKU_NUMBER;
    payload: string;
}

export interface ChangeSKUColorAction {
    type: typeof CHANGE_SKU_COLOR;
    payload: string;
}

export interface ChangeSKUSizeAction {
    type: typeof CHANGE_SKU_SIZE;
    payload: string;
}

export interface ChangeMainSKUAction {
    type: typeof CHANGE_MAIN_SKU;
    payload: object;
}

export interface setImageContainerWidthAction {
    type: typeof SET_IMAGE_CONTAINER_WIDTH;
    payload: number;
}

export interface deleteProductLastSkuAction {
    type: typeof DELETE_PRODUCT_LAST_SKU_AND_PRODUCT
    payload: number
}

export interface setSkuStatusAction {
    type: typeof PRODUCT_SET_PRODUCT_SKU_ISACTIVE
    payload: {skunumber: string, status: boolean}
}

export interface setAvailableFields {
    type: typeof PRODUCT_SET_AVAILABLE_FIELDS,
    payload: 'COLORSIZE' | 'COLOR' | 'SIZE' | ''
}

export interface getAllVendorAction {
    type: typeof GET_ALL_VENDOR;
    payload: any;
}

export interface getAllProductByVendorAction {
    type: typeof GET_ALL_PRODUCT_BY_VENDOR;
    payload: any;
}

export interface editSkuAction {
    type: typeof EDIT_SKU;
    payload: any;
}

export interface FilterVendorListAction {
    type: typeof FILTER_VENDOR_LIST;
    payload: any;
}

export interface FilterVendorProductAction {
    type: typeof FILTER_VENDOR_PRODUCT;
    payload: any;
}

export type ProductAction =
    | AnyAction
    | LoadProductsAction
    | CreateProductsAction
    | EditProductsAction
    | GetProductAction
    | FilterProductListAction
    | SaveProductAction
    | SelectSKUAction
    | AddSKUAction
    | DeleteSKUAction
    | UploadImageAction
    | LoadCategoriesAction
    | ToggleCategoryRowAction
    | ChangeProductNameAction
    | ChangeProductCategoryAction
    | ChangeProductCategoryListAction
    | ChangeProductBrandAction
    | ChangeProductMaterialAction
    | ChangeProductTypeAction
    | ChangeProductDetailedDescriptionAction
    | ChangeProductLongDescriptionAction
    | ChangeProductQuantityAction
    | ChangeProductPriceAction
    | ChangeProductPriceMinAction
    | ChangeProductPriceMaxAction
    | ChangeProductDiscountPriceAction
    | ChangeProductSpecialPriceMinAction
    | ChangeProductSpecialPriceMaxAction
    | ChangeSKUNumberAction
    | ChangeSKUColorAction
    | ChangeSKUSizeAction 
    | setImageContainerWidthAction
    | resetProductTabIndexAction
    | setTabIndexAction
    | deleteProductLastSkuAction
    | setSkuStatusAction
    | getAllVendorAction
    | getAllProductByVendorAction
    | editSkuAction
    | clearTier2And3Action
    | clearTier3Action
    | SetProductStateAction
    | FilterVendorListAction
    | FilterVendorProductAction
