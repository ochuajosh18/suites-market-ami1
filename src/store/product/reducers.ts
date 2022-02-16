import {
    LOAD_PRODUCTS,
    CREATE_PRODUCTS,
    EDIT_PRODUCTS,
    GET_PRODUCT,
    FILTER_PRODUCT_LIST,
    SAVE_PRODUCT,
    SELECT_SKU,
    SKU_BUTTON_STATUS,
    ADD_SKU,
    DELETE_SKU,
    ADD_PRODUCT_BUTTON,
    CHANGE_MAIN_SKU,
    UPLOAD_IMAGE,
    DELETE_PRODUCT,
    LOAD_CATEGORIES,
    TOOGLE_CATEGORY_ROW,
    DELETE_IMAGE,
    REORDER_IMAGE,
    CHANGE_PRODUCT_NAME,
    CHANGE_PRODUCT_CATEGORY,
    CHANGE_PRODUCT_CATEGORY_LIST,
    CHANGE_PRODUCT_BRAND,
    CHANGE_PRODUCT_MATERIAL,
    CHANGE_PRODUCT_TYPE,
    CHANGE_PRODUCT_DETAILED_DESCRIPTION,
    CHANGE_PRODUCT_LONG_DESCRIPTION,
    CHANGE_PRODUCT_QUANTITY,
    CHANGE_PRODUCT_PRICE,
    CHANGE_PRODUCT_PRICE_MAX,
    CHANGE_PRODUCT_PRICE_MIN,
    CHANGE_PRODUCT_DISCOUNT_PRICE,
    CHANGE_PRODUCT_SPECIAL_PRICE_MIN,
    CHANGE_PRODUCT_SPECIAL_PRICE_MAX,
    CHANGE_SKU_NUMBER,
    CHANGE_SKU_COLOR,
    CHANGE_SKU_SIZE,
    ProductAction,
    ProductState,
    SET_IMAGE_CONTAINER_WIDTH,
    SET_PRODUCT_ACTIVE_H1_CATEGORY,
    SET_PRODUCT_ACTIVE_H2_CATEGORY,
    SET_PRODUCT_ACTIVE_H3_CATEGORY,
    SET_PRODUCT_SAVE_LOADING,
    SET_NEW_PRODUCT_ID,
    RESET_PRODUCT_TAB_INDEX,
    SET_PRODUCT_TAB_INDEX,
    DELETE_PRODUCT_LAST_SKU_AND_PRODUCT,
    SET_PRODUCT_GET_PRODUCT_DETAILS_LOADING, 
    PRODUCT_SET_PRODUCT_SKU_ISACTIVE, 
    PRODUCT_SET_MAIN_SKU, 
    PRODUCT_SET_BACKDROP_LOADING,
    PRODUCT_SET_AVAILABLE_FIELDS,
    GET_ALL_VENDOR,
    GET_ALL_PRODUCT_BY_VENDOR,
    EDIT_SKU,
    CLEAR_SELECTED_TIER2AND3,
    CLEAR_SELECTED_TIER3,
    SET_PRODUCT_STATE,
    FILTER_VENDOR_LIST,
    FILTER_VENDOR_PRODUCT
} from './types';
import _ from 'lodash';
import { v4 } from 'uuid';

const INITIAL_STATE: ProductState = {
    skus: [],
    sku: {},
    products: [],
    filteredProducts: [],
    filteredVendors: [],
    selectedSKU: '',
    selectedProduct: '',
    addSKU: false,
    categories: {},
    imageContainerWidth: 0,
    saveLoading: false,
    tabIndex: 0,
    name: '',
    brand: '',
    type: '',
    material: '',
    shortDescription: '',
    longDescription: '',
    getProductDetailsLoading: false,
    specialPriceDisable: false,
    backDropLoading: false,
    availableFields: '',
    vendorInfo: [],
    vendorProducts: [],
    selectedVendor: '',
    tier1Categories: [],
    tier2Categories: [],
    tier3Categories: [],
    selectedTier1Category: '',
    selectedTier2Category: '',
    selectedTier3Category: '',
    hasSubCategory: false
};

export const productReducer = (state = INITIAL_STATE, action: ProductAction): ProductState => {
    switch (action.type) {
        case LOAD_PRODUCTS: {
            let products = _.orderBy(action.payload, ['name'], ['asc']);
            return { ...state, products };
        }
        case CREATE_PRODUCTS: {
            return state;
        }
        case EDIT_PRODUCTS: {
            return state;
        }
        case GET_PRODUCT: {
            let { name, brand, type, material, shortDescription, longDescription, h1, h2, h3} = action.payload;
            
            state.categories.layer1.map(tier1 => {
                if(tier1.name === h1) {
                    tier1.isOpen = true;
                } else {
                    tier1.isOpen = false;
                }
                return tier1;
            })

            state.categories.layer2.map(tier2 => {
                if(tier2.name === h2) {
                    tier2.isOpen = true;
                } else {
                    tier2.isOpen = false;
                }
                return tier2;
            })

            state.categories.layer3.map(tier3 => {
                if(tier3.name === h3) {
                    tier3.isOpen = true;
                } else {
                    tier3.isOpen = false;
                }
                return tier3;
            })

            return {
                ...state,
                skus: action.payload.skus,
                selectedSKU: '',
                selectedProduct: action.payload.productId,
                name,
                brand,
                type,
                material,
                shortDescription, 
                longDescription,
                selectedTier1Category: h1,
                selectedTier2Category: h2,
                selectedTier3Category: h3,
                specialPriceDisable: false
            };
        }
        case FILTER_PRODUCT_LIST: {
            const filteredProducts = _.filter(state.products, (p) => {
                return p.name && p.name
                    .toLowerCase()
                    .includes(action.payload.toLowerCase());
            });
            return { ...state, filteredProducts };
        }
        case ADD_PRODUCT_BUTTON: {
            const product = {
                id: 'NEW',
                name: '',
                category: '',
                brand: '',
                material: '',
                type: '',
                shortDescription: '',
                longDescription: '',
                isActive: true,
            };

            if (_.find(state.products, { id: 'new' })) {
                return { ...state, selectedProduct: 'NEW' };
            } else {
                state.products.push(product);

                return { ...state, selectedProduct: 'NEW', skus: [], specialPriceDisable: false };
            }
        }
        case SAVE_PRODUCT: {
            return {
                ...state,
                selectedProduct: action.payload,
                selectedSKU: '',
                // skus: [],
                tabIndex: 0
            };
        }
        case SELECT_SKU: {
            const { skus } = state;
            let disable = false;
            let sku = _.find(skus, (sku) => sku.skuNumber === action.payload)
            let { price, minPrice } = sku;
            if(price > 0) {
                if(minPrice  < (price / 2) + 2) { 
                    disable = true
                }
            }
            return { ...state, selectedSKU: action.payload, specialPriceDisable: disable };
        }
        case SKU_BUTTON_STATUS: {
            return { ...state, addSKU: action.payload };
        }
        case DELETE_PRODUCT: {
            return { ...state };
        }
        case CHANGE_MAIN_SKU: {
            return { ...state, products: action.payload };
        }
        case ADD_SKU: {
            let { sku, skus } = state;
            sku = {
                ...sku,
                productId: state.selectedProduct,
                image: [],
                media: [],
                price: 0,
                specialPrice: 0,
                minPrice: 0,
                maxPrice: 0,
                minSpecialPrice: 0,
                maxSpecialPrice: 0,
                stock: 0,
                minQuantity: 1,
                unit: 'PCS',
                isActive: true,
                isMainSKU: false,
                isEditing: undefined,
                id: v4()
            };
            skus.push({ ...sku });
            return { ...state, skus, sku: {} };
        }
        case DELETE_SKU: {
            let { skus } = state;

            skus = _.remove(skus, (s: any) => {
                return s.skuNumber !== action.payload;
            });

            return { ...state, skus };
        }
        case DELETE_PRODUCT_LAST_SKU_AND_PRODUCT: {
            let { skus, products, selectedProduct } = state;
            products = products.filter(product => product.id !== skus[0].productId )
            products = _.remove(products, (o:any) => {
                return o.id !== selectedProduct
            })
            return { ...state, products, skus : [], selectedProduct: '' };
        }
        case LOAD_CATEGORIES: {
            return { ...state, categories: action.payload };
        }
        case TOOGLE_CATEGORY_ROW: {
            return { ...state, categories: action.payload};
        }
        case UPLOAD_IMAGE: {
            let { skus, selectedSKU } = state;
            let sku = _.find(skus, { skuNumber: selectedSKU });

            sku.media = [...sku.media, ...action.payload.media];

            return { ...state, skus };
        }
        case DELETE_IMAGE: 
            let { skus, selectedSKU } = state;
            let skuIndex = _.findIndex(skus, { skuNumber: selectedSKU })
            skus[skuIndex].media = _.filter(skus[skuIndex].media, (s) => s.path !== action.payload);
            return { ...state, skus };
        case REORDER_IMAGE: {
            let { skus, selectedSKU } = state;
            let sku = _.find(skus, { skuNumber: selectedSKU });

            sku.image = action.payload;

            return { ...state, skus };
        }
        case CHANGE_PRODUCT_NAME: {
            // const product = _.find(state.products, {
            //     id: state.selectedProduct,
            // });
            // product.name = action.payload;

            return { ...state, name: action.payload };
        }
        case CHANGE_PRODUCT_CATEGORY: {
            const product = _.find(state.products, {
                id: state.selectedProduct,
            });
            product.category = action.payload;
            return { ...state };
        }
        case CHANGE_PRODUCT_CATEGORY_LIST: {
            const product = _.find(state.products, {
                id: state.selectedProduct,
            });
            product.h1 = action.payload.c1.name;
            product.h2 = action.payload.c2.name;
            product.h3 = action.payload.c3.name;
            return { ...state };
        }
        case CHANGE_PRODUCT_BRAND: {
            return { ...state, brand: action.payload };
        }
        case CHANGE_PRODUCT_MATERIAL: {
            return { ...state, material: action.payload };
        }
        case CHANGE_PRODUCT_TYPE: {
            return { ...state, type: action.payload };
        }
        case CHANGE_PRODUCT_DETAILED_DESCRIPTION: {
            return { ...state, shortDescription: action.payload };
        }
        case CHANGE_PRODUCT_LONG_DESCRIPTION: {
            return { ...state, longDescription: action.payload };
        }
        case CHANGE_PRODUCT_QUANTITY: {
            const sku = _.find(state.skus, { skuNumber: state.selectedSKU });
            if(action.payload.length === 0) {
                sku.marketStock = parseFloat('0');
            } else {
                sku.marketStock = parseFloat(action.payload);
            }
            return { ...state };
        }
        case CHANGE_PRODUCT_PRICE: {
            const sku = _.find(state.skus, { skuNumber: state.selectedSKU });
            let disable = false;
            if(sku.minPrice > 0) {
                if(action.payload.length !== 0) {
                    disable = sku.minPrice < ((parseFloat(action.payload) / 2) + 2) ? true : false
                    sku.minSpecialPrice = disable ? parseFloat('0') : sku.minSpecialPrice
                    sku.maxSpecialPrice = disable ? parseFloat('0'): sku.maxSpecialPrice
                }
            }
            if(action.payload.length === 0) {
                sku.price = parseFloat('0');
            } else {
                sku.price = parseFloat(action.payload);
            }
            return { ...state, specialPriceDisable: disable,  };
        }
        case CHANGE_PRODUCT_PRICE_MIN: {
            const sku = _.find(state.skus, { skuNumber: state.selectedSKU });
            let disable = false;

            if(sku.price > 0) {
                if(action.payload.length !== 0) {
                    disable = parseFloat(action.payload) < ((sku.price / 2) + 2) ? true : false
                    sku.minSpecialPrice = disable ? parseFloat('0') : sku.minSpecialPrice
                    sku.maxSpecialPrice = disable ? parseFloat('0'): sku.maxSpecialPrice
                }
            }

            if(action.payload.length === 0) {
                sku.minPrice = parseFloat('0')
            } else {
                sku.minPrice = parseFloat(action.payload);
            }
            return { ...state, specialPriceDisable: disable };
        }
        case CHANGE_PRODUCT_PRICE_MAX: {
            const sku = _.find(state.skus, { skuNumber: state.selectedSKU });
            if(action.payload.length === 0) {
                sku.maxPrice = parseFloat('0')
            } else {
                sku.maxPrice = parseFloat(action.payload);
            }
            return { ...state };
        }
        case CHANGE_PRODUCT_DISCOUNT_PRICE: {
            const sku = _.find(state.skus, { skuNumber: state.selectedSKU });
            
            if(sku.discountPrice > 0) {
                if(action.payload.length !== 0) {
                    sku.minSpecialPrice = parseFloat(action.payload) > 0 ? parseFloat('0') : sku.minSpecialPrice
                    sku.maxSpecialPrice = parseFloat(action.payload) > 0 ? parseFloat('0'): sku.maxSpecialPrice
                    sku.minPrice = parseFloat(action.payload) > 0 ? parseFloat('0') : sku.minPrice
                    sku.maxPrice = parseFloat(action.payload) > 0 ? parseFloat('0'): sku.maxPrice
                }
            }

            if(action.payload.length === 0) {
                sku.discountPrice = parseFloat('0')
            } else {
                sku.discountPrice = parseFloat(action.payload);
            }
            return { ...state, specialPriceDisable: parseFloat(action.payload) > 0 };
        }
        case CHANGE_PRODUCT_SPECIAL_PRICE_MIN: {
            const sku = _.find(state.skus, { skuNumber: state.selectedSKU });
            if(action.payload.length === 0) {
                sku.minSpecialPrice = parseFloat('0')
            } else {
                sku.minSpecialPrice = parseFloat(action.payload);
            }
            return { ...state };
        }
        case CHANGE_PRODUCT_SPECIAL_PRICE_MAX: {
            const sku = _.find(state.skus, { skuNumber: state.selectedSKU });
            if(action.payload.length === 0) {
                sku.maxSpecialPrice = parseFloat('0')
            } else {
                sku.maxSpecialPrice = parseFloat(action.payload);
            }
            return { ...state };
        }
        case CHANGE_SKU_NUMBER: {
            const { sku } = state;
            sku.skuNumber = action.payload;
            return { ...state, sku };
        }
        case CHANGE_SKU_COLOR: {
            const { sku } = state;
            sku.color = action.payload;
            return { ...state, sku };
        }
        case CHANGE_SKU_SIZE: {
            const { sku } = state;
            sku.size = action.payload;
            return { ...state, sku };
        }
        case SET_IMAGE_CONTAINER_WIDTH:
            return { ...state, imageContainerWidth: action.payload }
        case SET_PRODUCT_ACTIVE_H1_CATEGORY:
            return { ...state, selectedTier1Category: action.payload }
        case SET_PRODUCT_ACTIVE_H2_CATEGORY:
            return { ...state, selectedTier2Category: action.payload}
        case SET_PRODUCT_ACTIVE_H3_CATEGORY:
            return { ...state, selectedTier3Category: action.payload }
        case SET_PRODUCT_SAVE_LOADING:
            return { ...state, saveLoading: action.payload}
        case SET_NEW_PRODUCT_ID:
            let { products } = state;
            let { newProductId } = action.payload
            let { name, brand, type, shortDescription, longDescription } = action.payload.productData
            let productIndex = _.findIndex(products, (x: any) => x.id === 'NEW');
            products[productIndex].id = newProductId
            products[productIndex].name = name
            products[productIndex].brand = brand
            products[productIndex].type = type
            products[productIndex].shortDescription = shortDescription
            products[productIndex].longDescription = longDescription
            return { ...state, products, selectedProduct: newProductId }
        case RESET_PRODUCT_TAB_INDEX:
            let { categories } = state;
            let { layer1, layer2, layer3 } = categories;

            _.map(layer1, (o: any) => {
                o.isOpen = false;
            })

            _.map(layer2, (o: any) => {
                o.isOpen = false;
            })

            _.map(layer3, (o: any) => {
                o.isOpen = false;
            })

            return { ...state, tabIndex: 0, name: '', brand: '', type: '', material: '', shortDescription: '', longDescription: '', selectedTier1Category: '', selectedTier2Category: '', selectedTier3Category: '', selectedSKU: '', availableFields: '' }
        case SET_PRODUCT_TAB_INDEX:
            return { ...state, tabIndex: action.payload }
        case SET_PRODUCT_GET_PRODUCT_DETAILS_LOADING:
            return { ...state, getProductDetailsLoading: action.payload }
        case PRODUCT_SET_PRODUCT_SKU_ISACTIVE:
            let skuObject = _.find(state.skus, (sku) => action.payload.skunumber === sku.skuNumber)
            skuObject.isActive = action.payload.status;
            return { ...state, skus: state.skus }
        case PRODUCT_SET_MAIN_SKU: {
            return { ...state, sku: action.payload}
        }
        case PRODUCT_SET_BACKDROP_LOADING: {
            return { ...state, backDropLoading: action.payload}
        }
        case PRODUCT_SET_AVAILABLE_FIELDS: {
            return { ...state, availableFields: action.payload }
        }
        case GET_ALL_VENDOR: {
            return { ...state, vendorInfo: action.payload}
        }
        case GET_ALL_PRODUCT_BY_VENDOR: {
            let products = _.orderBy(action.payload, ['name'], ['asc']);
            
            return { ...state, vendorProducts: products, selectedVendor: products[0].vendorId };
        }
        case EDIT_SKU: {
            return { ...state, skus: action.payload }
        }
        case 'reset_global_state':
            return INITIAL_STATE;
        case CLEAR_SELECTED_TIER2AND3:
            return { ...state, selectedTier2Category: '', selectedTier3Category: '' }
        case CLEAR_SELECTED_TIER3:
            return { ...state, selectedTier3Category: '' }
        case SET_PRODUCT_STATE:
            return { ...state, ...action.payload }
        case FILTER_VENDOR_LIST: {
            const filteredVendors = _.filter(state.vendorInfo, (v) => {
                return v.companyName && v.companyName
                    .toLowerCase()
                    .includes(action.payload.toLowerCase());
            });

            return { ...state, filteredVendors, filteredProducts: state.vendorProducts };
        }
        
        case FILTER_VENDOR_PRODUCT: {
        const filteredProducts = _.filter(state.vendorProducts, (p) => {
            return p.name && p.name
                .toLowerCase()
                .includes(action.payload.toLowerCase());
        });
            return { ...state, filteredProducts, filteredVendors: state.vendorInfo };
        }
        default: {
            return state;
        }   
    }
}
