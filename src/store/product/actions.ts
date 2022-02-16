import axios from 'axios';
import _ from 'lodash';

import {
    SET_PRODUCT_STATE,
    ProductAction,
    LOAD_PRODUCTS,
    EDIT_PRODUCTS,
    GET_PRODUCT,
    FILTER_PRODUCT_LIST,
    SAVE_PRODUCT,
    DELETE_PRODUCT,
    DELETE_SKU,
    SELECT_SKU,
    SKU_BUTTON_STATUS,
    ADD_SKU,
    ADD_PRODUCT_BUTTON,
    LOAD_CATEGORIES,
    TOOGLE_CATEGORY_ROW,
    UPLOAD_IMAGE,
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
    CHANGE_PRODUCT_PRICE_MIN,
    CHANGE_PRODUCT_DISCOUNT_PRICE,
    CHANGE_PRODUCT_SPECIAL_PRICE_MIN,
    CHANGE_PRODUCT_PRICE_MAX,
    CHANGE_PRODUCT_SPECIAL_PRICE_MAX,
    CHANGE_PRODUCT_PRICE,
    CHANGE_SKU_NUMBER,
    CHANGE_SKU_COLOR,
    CHANGE_SKU_SIZE,
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
    ProductInput,
    FILTER_VENDOR_LIST,
    FILTER_VENDOR_PRODUCT
} from './types';
import { toastError, toastSuccess, toastWarning } from '../../modules/Toast';
import { AppThunk } from '..';
import findIndex from 'lodash/findIndex';

const EXCLUDED_FIELDS = [
    'id',
    'docType',
    'lastUpdated',
    'dateUpdated',
    'dateCreated',
    'isDeleted',
];

const apiUrl = process.env.REACT_APP_API_URL;

export const LoadProducts = (): AppThunk => {
    return async (dispatch, getState) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const state = getState();
        try {
            const result = await axios.get(
                `${apiUrl}/product/byVendor/${state.login.user.id}?keyword=${' '}`
            );

            dispatch({
                type: LOAD_PRODUCTS,
                payload: result.data,
            });
        } catch (err) {
            console.log({ m: 'LoadProducts | error', d: err });
        }
    };
}

export const EditProducts = (): AppThunk => {
    return async (dispatch) => {
        try {
            //ajax here

            dispatch({
                type: EDIT_PRODUCTS,
                payload: [],
            });
        } catch (err) {
            console.log({ m: 'EditProducts | error', d: err });
        }
    };
}

export const GetProduct = (productId: string) : AppThunk => {
    return async (dispatch, getState) => {
        dispatch({ type: SET_PRODUCT_GET_PRODUCT_DETAILS_LOADING, payload: true })
        const apiUrl = process.env.REACT_APP_API_URL;
        try {
            const result = await axios.get(`${apiUrl}/product/${productId}/sku`);
            if (result && result.status === 200 && typeof result.data !== 'undefined') {
                let { name, brand, type, material, shortDescription, longDescription, h1, h2, h3 } = result.data
                if(typeof h2 !== 'undefined' && h2.length > 0) {
                    let tier2Categories = await axios.get(`${apiUrl}/product/category/${h1}/h2`);
                    if(tier2Categories && tier2Categories.data.length > 0) {
                        dispatch({ type: SET_PRODUCT_STATE, payload: { 'tier2Categories' : tier2Categories.data }})
                    }
                } 
                
                if(typeof h3 !== 'undefined' && typeof h2 !== 'undefined' && h3.length > 0 && h2.length > 0) {
                    let tier3Categories = await axios.get(`${apiUrl}/product/category/${h1}/${h2}/h3`);
                    if(tier3Categories && tier3Categories.data.h3.length > 0) {
                        dispatch({ type: SET_PRODUCT_STATE, payload: { 'tier3Categories' : tier3Categories.data.h3 }})
                    }
                }
                dispatch({ type: GET_PRODUCT, payload: { skus: result.data.sku, productId, name, brand, type, material, shortDescription, longDescription, h1, h2, h3  } });
            }
        } catch (err) {
            console.log({ m: 'GetProduct | error', d: err });
        } finally {
            dispatch({ type: SET_PRODUCT_GET_PRODUCT_DETAILS_LOADING, payload: false })
        }
    };
}

export function FilterProductList(filterText: string) {
    return {
        type: FILTER_PRODUCT_LIST,
        payload: filterText,
    };
}

export function FilterVendorList(filterText: string) {
    return {
        type: FILTER_VENDOR_LIST,
        payload: filterText,
    };
}

export function FilterVendorProductList(filterText: string) {
    return {
        type: FILTER_VENDOR_PRODUCT,
        payload: filterText,
    };
}

export const SaveProduct = (): AppThunk => {
    const validateProductData = (productData: any) => {
        const { name, brand, type, material, shortDescription, longDescription, h1, h2, h3, hasSubCategory } = productData;
        let productDataValid : boolean; 
        if (name.length <= 0 ) {
            productDataValid = false
            toastError('Product name is required.')
        } else if(brand.length <= 0) {
            productDataValid = false
            toastError('Product brand is required.')
        } else if(type.length <= 0) {
            productDataValid = false
            toastError('Product type is required.')
        } else if(material.length <= 0) {
            productDataValid = false
            toastError('Product material is required.')
        } else if(shortDescription.length <= 0) {
            productDataValid = false
            toastError('Product short description is required.')
        } else if(longDescription.length <= 0) {
            productDataValid = false
            toastError('Product long description is required.')
        } else if(h1.length <= 0) {
            productDataValid = false
            toastError('Tier 1 category is required.')
        } else if(h2.length <= 0) {
            productDataValid = hasSubCategory ? false : true;
            hasSubCategory && toastError('Tier 2 category is required.')
        } else if(h3.length <= 0) {
            productDataValid = hasSubCategory ? false : true;
            hasSubCategory && toastError('Tier 3 category is required.')
        } else {
            productDataValid = true
        }

        return productDataValid;
    }

    const validateSKUFields = (productSKUs: any) => {
        let skuIsValid = false;
        let mediaValid = false;
        let count = 0;
        _.map(productSKUs, (sku) => {
            sku.media.forEach(skuMedia => {
                let mediaArray = skuMedia.path.split('.')
                let validMedia = mediaArray[mediaArray.length - 1]
                if(validMedia === 'png' || validMedia === 'jpg' || validMedia === 'jpeg') {
                    mediaValid = true;
                    count++;
                }
            });
            if (sku.media.length <= 0 || (mediaValid === false && count < 1)) {
                skuIsValid = false;
                toastError(`Please upload atleast one product image for SKU number: ${sku.skuNumber}`)
            } else if (sku.marketStock <= 0) {
                skuIsValid = false;
                toastError(`Quantity is required for SKU number: ${sku.skuNumber}`)
            } else if (sku.price <= 0) {
                skuIsValid = false;
                toastError(`Price is required for SKU number: ${sku.skuNumber}`)
            } else if (sku.discountPrice <= 0 || sku.discountPrice === undefined) {
                sku.discountPrice = 0;
            } else if (sku.price < sku.discountPrice) {
                skuIsValid = false;
                toastError(`Discounted Price must be less than Display Price for SKU number: ${sku.skuNumber}`)
            } else {
                skuIsValid = true;
            }
        }) 

        return skuIsValid;
    }

    const validateUpdateProductData = (productData: any) => {
        let productDataValid : boolean; 
        if (productData.name.length <= 0 ) {
            productDataValid = false
            toastError('Product name is required.')
        } else if(productData.brand.length <= 0) {
            productDataValid = false
            toastError('Product brand is required.')
        } else if(productData.type.length <= 0) {
            productDataValid = false
            toastError('Product type is required.')
        } else if(productData.material.length <= 0) {
            productDataValid = false
            toastError('Product material is required.')
        } else if(productData.shortDescription.length <= 0) {
            productDataValid = false
            toastError('Product short description is required.')
        } else if(productData.longDescription.length <= 0) {
            productDataValid = false
            toastError('Product long description is required.')
        } else if(productData.longDescription.length <= 0) {
            productDataValid = false
            toastError('Product long description is required.')
        } else {
            productDataValid = true
        }

        return productDataValid;
    }

    const validateMinimumAndMaximum = (productSKUs : any) => {
        return new Promise((resolve, reject) => {
            let isValidSkus = true ;
            _.forEach(productSKUs, (sku) => {
                let { minPrice, maxPrice, minSpecialPrice, maxSpecialPrice, price, skuNumber } = sku;
                if(((minPrice * 2) < price || minPrice > (price - 1)) && minPrice !== 0) { /* 1. Check if min price have a value. 2. Check if minimum price multiplied by two is less than display price. 3. Check if minimum price exceeds display price minus one. */
                    isValidSkus = false;
                    toastError(`SKU Number: ${skuNumber}. Please check the minimum bargaining price.`)
                } else if((maxPrice > (price - 1)) && maxPrice !== 0) { /* 1. Check if max price is empty. 2. Check if max price exceeds display price minus one. */
                    isValidSkus = false
                    toastError(`SKU Number: ${skuNumber}. Please check the maximum bargaining price.`)
                } else if(minPrice > maxPrice) { // Check if minimum bargaining price is greater than maximum bargaining price.
                    isValidSkus = false
                    toastError(`SKU Number: ${skuNumber}. The minimum bargaining price cannot exceed the maximum bargaining price.`)
                } else if((minPrice === maxPrice) && (minPrice !== 0 || maxPrice !== 0) ){ // Check if minimum price is equal to max price
                    isValidSkus = false
                    toastError(`SKU Number: ${skuNumber}. Maximum bargaining price should be greater than minimum bargaining price.`)
                } else if (maxPrice > 0 && minPrice === 0) { // If maximum bargaining price has value. Minimum bargaining price should have too.
                    isValidSkus = false
                    toastError(`SKU Number: ${skuNumber}. Please check the minimum bargaining price.`)
                } else if (minPrice > 0 && maxPrice === 0) { // If minimum bargaining price has value. Maximum bargaining price should have too
                    isValidSkus = false
                    toastError(`SKU Number: ${skuNumber}. Please check the maximum bargaining price.`)
                } else if ((minSpecialPrice > 0 || maxSpecialPrice > 0)) { // Check if bargaining price have a value if special price range has value
                    if(minPrice === 0 || maxPrice === 0) {
                        isValidSkus = false
                        toastError(`SKU Number: ${skuNumber}. Bargaining price range is required if you have special price range.`)
                    } else if (minSpecialPrice >= minPrice) {
                        isValidSkus = false
                        toastError(`SKU Number: ${skuNumber}. The minimum special price cannot exceed or eqaul to the minimum bargaining price.`)
                    } else if (maxSpecialPrice >= minPrice) {
                        isValidSkus = false
                        toastError(`SKU Number: ${skuNumber}. The maximum special price cannot exceed or equal to the minimum bargaining price.`)
                    } else if (minSpecialPrice > maxSpecialPrice) {
                        isValidSkus = false
                        toastError(`SKU Number: ${skuNumber}. The minimum special price cannot exceed the maximum special price.`)
                    } else if (minSpecialPrice === maxSpecialPrice) {
                        isValidSkus = false
                        toastError(`SKU Number: ${skuNumber}. Maximum special price should be greater than minimum special price.`)
                    } else if (minSpecialPrice < price / 2) {
                        isValidSkus = false
                        toastError(`SKU Number: ${skuNumber}. Please check the minimum special price.`)
                    }
                }
            })

            resolve(isValidSkus)
        })
    }

    return async (dispatch, getState) => {
        const state = getState();
        const apiUrl = process.env.REACT_APP_API_URL;
        dispatch({type: SET_PRODUCT_SAVE_LOADING, payload: true })
        try {
            const { product: productState } = state;
            let product;
            if(state.login.user.userType === "ADMIN" && productState.selectedProduct !== "NEW") {
                product = _.find(productState.vendorProducts, {
                    id: productState.selectedProduct,
                });
            } else {
                product = _.find(productState.products, {
                    id: productState.selectedProduct,
                });
            }

            const productSKUs = _.filter(productState.skus, {
                productId: productState.selectedProduct,
            });

            if(state.login.user.userType === "ADMIN") {
                product.vendorId = productState.selectedVendor;
            } else {
                product.vendorId = state.login.user.id;
            }

            let newProductId: string = '';
            // let newProductSkuId: string = '';
            //if new product
            if (product.id.startsWith('NEW')) {
                let sku = productSKUs[0];
                if(state.login.user.userType === "ADMIN") {
                    sku.vendorId = productState.selectedVendor;
                } else {
                    sku.vendorId = state.login.user.id;
                }
                let { media, size, color, skuNumber, marketStock, unit, minQuantity, price, discountPrice, isActive, minPrice, maxPrice, minSpecialPrice, maxSpecialPrice } = sku;
                let { selectedTier1Category, selectedTier2Category, selectedTier3Category, name, brand, type, material, shortDescription, longDescription, hasSubCategory } = productState
                // delete product.id;
                // delete sku.id;
                // delete sku.productId;
                let productData : any = _.merge(
                    _.omit({ ...product }, [...EXCLUDED_FIELDS, 'category', 'featuredSku']),
                    { name, brand, type, material, shortDescription, longDescription, media, size, color, skuNumber, marketStock, unit, minQuantity, price, discountPrice : discountPrice ? discountPrice : 0, isActive, minPrice, maxPrice, minSpecialPrice, maxSpecialPrice },
                    { h1: selectedTier1Category, h2: selectedTier2Category, h3: selectedTier3Category, hasSubCategory }
                );

                let productChecker = state.product.products;
                let count = 0;

                let productDataValid = validateProductData(productData);
                let skuFieldsIsValid = validateSKUFields(productSKUs);
                let isMinAndMaxValid = await validateMinimumAndMaximum(productSKUs);
                productChecker.forEach(product => {
                    if(product.name.toUpperCase().trim() === productData.name.toUpperCase().trim()) {
                        count++;
                        toastError(`Product name already exists.`);
                    }
                });
                    
                if(productDataValid && skuFieldsIsValid && isMinAndMaxValid && count === 0) {
                    const result1 = await axios.post(
                        `${apiUrl}/product/createProduct`,
                        productData,
                        {
                            headers: {
                                Authorization: `Bearer ${state.login.token.token}`,
                            },
                        },
                    );
    
                    if (result1 && result1.status === 200) {
                        productData.id = result1.data.productId;    
                        productData.featuredSku = result1.data.productSkuId
                        toastSuccess('Product successfully created.')
                        
                        if(state.login.user.userType === 'ADMIN') {
                            dispatch(GetAllProductByVendor(productData.vendorId));
                        }
                    }
    
                    newProductId = result1.data.productId;
    
                    dispatch({type: SET_NEW_PRODUCT_ID, payload: { newProductId, productData }})
                    //if more than 1 sku
                    if (productSKUs.length > 1) {
                        let createSKUajax: any = [];
                        _.forEach(productSKUs, (s, i) => {
                            if (i === 0) {
                                return; //skip first sku
                            }
    
                            s.vendorId = product.vendorId;
                            s.productId = newProductId;
                            // delete s.id;
                            
                            createSKUajax.push(
                                axios.post(
                                    `${apiUrl}/product/createProductSku`,
                                    _.omit(s, EXCLUDED_FIELDS),
                                    {
                                        headers: {
                                            Authorization: `Bearer ${state.login.token.token}`,
                                        },
                                    },
                                ),
                            );
                        });
    
                        axios.all(createSKUajax).then(() => {
                            dispatch({
                                type: SAVE_PRODUCT,
                                payload: newProductId,
                            });
                        })
                    }
                }
            } else {
                //update product
                let { selectedTier1Category, selectedTier2Category, selectedTier3Category, skus } = productState;
                let getCategoryIdResult = await axios.get(`${apiUrl}/product/category/getId?h1=${encodeURIComponent(selectedTier1Category)}&h2=${encodeURIComponent(selectedTier2Category)}&h3=${encodeURIComponent(selectedTier3Category)}`)
                if(getCategoryIdResult && getCategoryIdResult.status === 200) {
                    product.name = productState.name;
                    product.brand = productState.brand;
                    product.type = productState.type;
                    product.material = productState.material;
                    product.shortDescription = productState.shortDescription;
                    product.longDescription = productState.longDescription;
                    product.categoryId = getCategoryIdResult.data.id
                    product.featuredSku = _.find(skus, (sku) => sku.isMainSku === true).id
                }
                let validateProductData = validateUpdateProductData(product)
                let skuFieldsIsValid = validateSKUFields(productState.skus);
                let isMinAndMaxValid = await validateMinimumAndMaximum(productState.skus)
                if(validateProductData && isMinAndMaxValid && skuFieldsIsValid) {
                    const result1 = await axios.put(
                        `${apiUrl}/product/updateProduct`,
                        {
                            id: product.id,
                            data: _.omit(product, EXCLUDED_FIELDS),
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${state.login.token.token}`,
                            },
                        },
                    );

                    if(result1 && result1.status === 204) {
                        toastSuccess('Product Successfully updated.')
                    }

                    let createSKUajax: any = [];
                    _.forEach(productState.skus, (s, i) => {
                        if (s.id.indexOf('PRODUCT::SKU') < 0) {
                            //if new sku
                            s.vendorId = product.vendorId;
                            s.productId = product.id;
                            createSKUajax.push(
                                axios.post(
                                    `${apiUrl}/product/createProductSku`,
                                    _.omit(s, EXCLUDED_FIELDS),
                                    {
                                        headers: {
                                            Authorization: `Bearer ${state.login.token.token}`,
                                        },
                                    },
                                ),
                            );
                        } else {
                            //update sku
                            createSKUajax.push(
                                axios.put(
                                    `${apiUrl}/product/updateProduct`,
                                    {
                                        id: s.id,
                                        data: _.omit(s, EXCLUDED_FIELDS),
                                    },
                                    {
                                        headers: {
                                            Authorization: `Bearer ${state.login.token.token}`,
                                        },
                                    },
                                ),
                            );
                        }
                    });
                    
                    axios.all(createSKUajax).then((...responses) => {
                        dispatch({
                            type: SAVE_PRODUCT,
                            payload: product.id,
                        })
                        dispatch(GetProduct(product.id));
                    });
                }
            }
        } catch (err) {
            if(err.message === "Network Error") {
                toastError('Couchbase Error');
            } else {
                if(err && err.response && err.response.data) {
                    switch (err.response.data.error.message) {
                        case "Create Product: H1 can't be blank, H2 can't be blank, H3 can't be blank":
                            toastError('Please select a Category!')
                            break;
                        default:
                            break;
                    }
                }
            }
            // console.log({ m: 'SaveProduct | error', d: err });
            throw err;
        } finally {
             dispatch({type: SET_PRODUCT_SAVE_LOADING, payload: false })
        }
    };
}

export function AddProductButton() {
    return {
        type: ADD_PRODUCT_BUTTON,
        payload: false,
    };
}

export const DeleteProduct = (productID: string): AppThunk => {
    return async (dispatch, getState) => {
        const state = getState();
        const apiUrl = process.env.REACT_APP_API_URL;

        try {
            await axios.delete(
                `${apiUrl}/product/deleteProduct/${productID}`,
                {
                    headers: {
                        Authorization: `Bearer ${state.login.token.token}`,
                    },
                },
            );

            dispatch({
                type: DELETE_PRODUCT,
                payload: productID,
            });
        } catch (err) {
            console.log({ m: 'DeleteProduct | error', d: err });
        }
    };
}

export const UploadImage = (images, callback: (urls: any) => void): AppThunk => {

    return (dispatch) => {
        dispatch({type: PRODUCT_SET_BACKDROP_LOADING, payload: true})
        let imagesBlob: any = [];
        const apiUrl = process.env.REACT_APP_API_URL;
        let countImages = images.length;
        try {
            const readImages = (image) => {
                return new Promise((resolvePromise, rejectPromise) => {
                    try {
                        const reader = new FileReader();
                        reader.onabort = () =>
                            console.log('file reading was aborted');
                        reader.onerror = () =>
                            console.log('file reading has failed');
                        reader.onload = () => {
                            // Do whatever you want with the file contents
                            // const binaryStr = reader.result!;
                            const arr = new Uint8Array(
                                reader.result as ArrayBuffer,
                            );
                            resolvePromise(new Blob([new Uint8Array(arr)]));
                        };
                        reader.readAsArrayBuffer(image);
                        // reader.readAsBinaryString(file);
                    } catch (err) {
                        rejectPromise(err);
                    }
                });
            };

            const forEachCallback = async () => {
                var fd: any = new FormData();
                for (let img of images) {
                    fd.append('media', img);
                }

                try {
                    let result = await axios.post(
                        `${apiUrl}/media/upload/product`,
                        fd
                    );

                    // const response = await fetch(`${apiUrl}/media/upload`, {
                    //     method: 'POST',
                    //     headers: {
                    //         Authorization: `Bearer ${state.login.token.token}`,
                    //         // 'Content-Type': 'multipart/form-data',
                    //     },
                    //     body: fd,
                    // });
                    // const result = await response.text();

                    // console.log(state.product);

                    // const sampleImages = _.map(images, (i) => i.name);
                    callback(result.data);
                    dispatch({ type: UPLOAD_IMAGE, payload: result.data });
                } catch (err) {
                    console.log({ m: 'UploadImage | error', d: err });
                }
            };

            _.forEach(images, async (img) => {
                try {
                    let i = await readImages(img);
                    imagesBlob.push(i);

                    if (imagesBlob.length === images.length) {
                        await forEachCallback();
                    }
                } catch (err) {
                    console.log({
                        m: 'UploadImage | readImages | error',
                        d: err,
                    });
                }
                if(countImages === 1) {
                    dispatch({type: PRODUCT_SET_BACKDROP_LOADING, payload: false})
                }
                countImages--;
            });
        }
        catch (err) {
            console.log({ m: 'UploadImage | error', d: err });
        }
    };
}

export function DeleteImage(url: string): ProductAction {
    return { type: DELETE_IMAGE, payload: url };
}

export function ReorderImage(images): ProductAction {
    return { type: REORDER_IMAGE, payload: images };
}

export function SelectSKU(skuNumber: string) {
    return {
        type: SELECT_SKU,
        payload: skuNumber,
    };
}

export const AddSKU = () : AppThunk => {
    return async (dispatch, getState) => {
        let { skus, sku } = getState().product;
        let addSku = false;
        let { color: skuColor, size: skuSize, skuNumber } = sku;

        skuColor = typeof skuColor !== 'undefined' ? skuColor : '';
        skuSize = typeof skuSize !== 'undefined' ? skuSize : '';
        skuNumber = typeof skuNumber !== 'undefined' ? skuNumber : '';

        if(skuNumber === '' && (skuSize === '' || skuColor === '')) {
            toastError('SKU Number and either Color and Size/Model is required.')
        } else if(skus.length >= 1) {
            let { color, size } = skus[0];

            color = typeof color !== 'undefined' ? color : '';
            size = typeof size !== 'undefined' ? size : '';

            if(skuNumber === '') {
                toastError('Sku Number is required.')
                addSku = false;
            } else if(color.length > 0 && size.length > 0) {
                if(skuColor.length > 0 && skuSize.length > 0) {
                    addSku = true;
                } else {
                    toastError('Color and Size/Model is required.')
                }
            } else if (color.length > 0) { 
                if(skuColor.length > 0) {
                    addSku = true;
                } else {
                    toastError('Color is required.')
                }
            } else if (size.length > 0) {
                if(skuSize.length > 0) {
                    addSku = true;
                } else {
                    toastError('Size is required.')
                }
            } 
        } else {
            addSku = true;
        }

        skus.forEach(data => {
            if(sku.color !== undefined && sku.size !== undefined) {
                if(data.color.toUpperCase().trim() === sku.color.toUpperCase().trim() && data.size.toUpperCase().trim() === sku.size.toUpperCase().trim()) {
                    toastError('SKU Color and Size/Model already exist.')
                    addSku = false;
                }
            } else if(sku.color !== undefined) {
                if (data.color.toUpperCase().trim() === sku.color.toUpperCase().trim()) {
                    toastError('SKU Color already exist.')
                    addSku = false;
                }
            } else if(sku.size !== undefined) {
                if (data.size.toUpperCase().trim() === sku.size.toUpperCase().trim()) {
                    toastError('Size/Model already exist.')
                    addSku = false;
                }
            }
        });
        
        if(addSku) {
            dispatch({ type: ADD_SKU, payload: null });
            dispatch({ type: SKU_BUTTON_STATUS, payload: false });
        }
    };
}

export function AddSKUButton() {
    return {
        type: SKU_BUTTON_STATUS,
        payload: true,
    };
}

export function CancelSKUButton() {
    return {
        type: SKU_BUTTON_STATUS,
        payload: false,
    };
}

export const DeleteSKU = (skuNumber: string): AppThunk => {
    return async (dispatch, getState) => {
        const state = getState();
        const apiUrl = process.env.REACT_APP_API_URL;
        try {
            const sku = _.find(state.product.skus, {
                skuNumber,
            });
            let result;

            if(state.product.skus.length === 1) {
                if (window.confirm(`Are you sure you want to delete SKU Number ${skuNumber}?`)) {
                    // Save it!
                    result = await axios.delete(`${apiUrl}/product/sku/${sku.id}`, {
                        headers: {
                            Authorization: `Bearer ${state.login.token.token}`,
                        },
                    })
                    dispatch({
                        type: DELETE_PRODUCT_LAST_SKU_AND_PRODUCT,
                        payload: skuNumber,
                    });
                }
            } else if(state.product.skus.length === 2) {
                if (window.confirm(`Are you sure you want to delete SKU Number ${skuNumber}?`)) {
                    dispatch({
                        type: DELETE_SKU,
                        payload: skuNumber,
                    });
                    dispatch({
                        type: SET_PRODUCT_STATE,
                        payload: { 'availableFields' : 'COLORSIZE' }
                    })
                }
            } else {
                if (window.confirm(`Are you sure you want to delete SKU Number ${skuNumber}?`)) {
                    dispatch({
                        type: DELETE_SKU,
                        payload: skuNumber,
                    });
                }
            }

            if(result && result.status === 204){
                toastSuccess('Product SKU successfully deleted.')
            }
        } catch (err) {
            if(err.response.data) {
                switch (err.response.data.error.message) {
                    case 'Delete Product SKU: Product SKU is currently in use':
                        toastWarning('Product SKU cannot be deleted because there is an existing transaction associated with it.')
                        break;
                    case 'Delete Product SKU: Product SKU is featured and exist with other skus':
                        toastWarning(`Product SKU cannot be deleted unless this is the last sku left.`)
                        break;
                    default:
                        break;
                }
            }
            console.log({ m: 'DeleteSKU | error', d: err });
        }
    };
}

export const ChangeMainSKU = (skuNumber: string) : AppThunk => {
    return async (dispatch, getState) => {
        let { skus } = getState().product
        _.map(skus, (sku) => {
            sku.isMainSku = false;
        })
        let skuIndex = _.findIndex(skus, { skuNumber });
        if(skuIndex > -1) {
            skus[skuIndex].isMainSku = true
        }
        dispatch({ type: PRODUCT_SET_MAIN_SKU, payload: skus })
    };
}

export const LoadCategories = (): AppThunk => {
    return async (dispatch, getState) => {
        const state = getState();
        const apiUrl = process.env.REACT_APP_API_URL;

        try {
            let l1Categories = await axios.get(
                `${apiUrl}/product/category/h1`,
                {
                    headers: {
                        Authorization: `Bearer ${state.login.token.token}`,
                    },
                },
            );

            let cLayer1: any = [];
            let cLayer2: any = [];
            let cLayer3: any = [];

            let categoryPromises: any = [];
            _.forEach([...l1Categories.data], (c1, i1) => {
                //layer 1
                let p1 = axios
                    .get(`${apiUrl}/product/category/${c1.h1}/h2`, {
                        headers: {
                            Authorization: `Bearer ${state.login.token.token}`,
                        },
                    })
                    .then((resultL2) => {
                        //layer 2
                        _.forEach([...resultL2.data], (c2, i2) => {
                            let p2 = axios
                                .get(
                                    `${apiUrl}/product/category/${c1.h1}/${c2.h2}/h3`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${state.login.token.token}`,
                                        },
                                    },
                                )
                                .then((resultL3) => {
                                    //layer 3
                                    _.forEach([...resultL3.data.h3], (c3, i3) => {
                                        cLayer3.push({
                                            id: `1_${i1}_${i2}_${i3}`,
                                            parentId: `1_${i1}_${i2}`,
                                            name: c3,
                                        });
                                    });
                                });

                            cLayer2.push({
                                id: `1_${i1}_${i2}`,
                                parentId: `1_${i1}`,
                                name: c2.h2,
                            });
                            categoryPromises.push(p2);
                        });
                    });

                cLayer1.push({ id: `1_${i1}`, name: c1.h1 });
                categoryPromises.push(p1);
            });
            axios.all(categoryPromises).then(() => {
                dispatch({
                    type: LOAD_CATEGORIES,
                    payload: {
                        layer1: cLayer1,
                        layer2: cLayer2,
                        layer3: cLayer3,
                    },
                });
            });
        } catch (err) {
            console.log({ m: 'LoadCategories | error', d: err });
        }
    };
}

export const ToggleCategoryRow = (layer: number, categoryItem): AppThunk => {
    return async (dispatch, getState) => {
        const state = getState();

        switch (layer) {
            case 1:
                dispatch({type: SET_PRODUCT_ACTIVE_H1_CATEGORY, payload: categoryItem.name})
                break;
            case 2:
                dispatch({type: SET_PRODUCT_ACTIVE_H2_CATEGORY, payload: categoryItem.name})
                break;
            default:
                break;
        }

        try {
            let { categories } = state.product;

            categories[`layer${layer}`] = _.map(
                categories[`layer${layer}`],
                (c) => {
                    return { ...c, isOpen: c.id === categoryItem.id };
                },
            );

            dispatch({
                type: TOOGLE_CATEGORY_ROW,
                payload: categories,
            });
        } catch (err) {
            console.log({ m: 'ToggleCategoryRow | error', d: err });
        }
    };
}

export const SelectCategory = (layer: number, categoryItem): AppThunk => {
    return async (dispatch, getState) => {
        const state = getState();

        dispatch({type: SET_PRODUCT_ACTIVE_H3_CATEGORY, payload: categoryItem.name})
        try {
            let { categories } = state.product;

            const c3 = _.find(categories[`layer3`], {
                id: categoryItem.id,
            });

            const c2 = _.find(categories[`layer2`], {
                id: c3.parentId,
            });

            const c1 = _.find(categories[`layer1`], {
                id: c2.parentId,
            });

            categories[`layer${layer}`] = _.map(
                categories[`layer${layer}`],
                (c) => {
                    return { ...c, isOpen: c.id === categoryItem.id };
                },
            );

            // let productCategory = await axios.get(
            //     `${apiUrl}/product/category/getId/${c1.name}/${c2.name}/${c3.name}`,
            //     {
            //         headers: {
            //             Authorization: `Bearer ${state.login.token.token}`,
            //         },
            //     },
            // );

            // dispatch({
            //     type: CHANGE_PRODUCT_CATEGORY,
            //     payload: productCategory.data.id,
            // });

            dispatch({
                type: CHANGE_PRODUCT_CATEGORY_LIST,
                payload: { c1, c2, c3 },
            });

            dispatch({
                type: TOOGLE_CATEGORY_ROW,
                payload: categories,
            });
        } catch (err) {
            alert('Category data not found');
            console.log({ m: 'SelectCategory | error', d: err });
        }
    };
}

export const SetSelectedCategory = (productCategoryId: string): AppThunk => {
    return async (dispatch, getState) => {
        const state = getState();
        const apiUrl = process.env.REACT_APP_API_URL;
        try {
            let categoryData = await axios.get(
                `${apiUrl}/product/category/getById/${productCategoryId}`,
                {
                    headers: {
                        Authorization: `Bearer ${state.login.token.token}`,
                    },
                },
            );
            let { categories } = state.product;
            if (productCategoryId) {
                const c1 = _.find(categories.layer1, {
                    name: categoryData.data.h1,
                });

                const c2 = _.find(categories.layer2, {
                    parentId: c1.id,
                    name: categoryData.data.h2,
                });

                const c3 = _.find(categories.layer3, {
                    parentId: c2.id,
                    name: categoryData.data.h3,
                });

                c1.isOpen = true;
                c2.isOpen = true;
                c3.isOpen = true;
            }

            dispatch({
                type: TOOGLE_CATEGORY_ROW,
                payload: categories,
            });
        } catch (err) {
            console.log(err.response.data);
            console.log({ m: 'GetCategoryDetails | error', d: err });
        }
    };
}

/* Change events */
export function ChangeProductName(value: string): ProductAction {
    return { type: CHANGE_PRODUCT_NAME, payload: value };
}

export function ChangeProductCategory(value: string): ProductAction {
    return { type: CHANGE_PRODUCT_CATEGORY, payload: value };
}

export function ChangeProductBrand(value: string): ProductAction {
    return { type: CHANGE_PRODUCT_BRAND, payload: value };
}

export function ChangeProductMaterial(value: string): ProductAction {
    return { type: CHANGE_PRODUCT_MATERIAL, payload: value };
}

export function ChangeProductType(value: string): ProductAction {
    return { type: CHANGE_PRODUCT_TYPE, payload: value };
}

export function ChangeProductDetailedDescription(value: string): ProductAction {
    return { type: CHANGE_PRODUCT_DETAILED_DESCRIPTION, payload: value };
}

export function ChangeProductLongDescription(value: string): ProductAction {
    return { type: CHANGE_PRODUCT_LONG_DESCRIPTION, payload: value };
}

export function ChangeProductQuantity(value: number): ProductAction {
    return { type: CHANGE_PRODUCT_QUANTITY, payload: value };
}

export function ChangeProductPrice(value: number): ProductAction {
    return { type: CHANGE_PRODUCT_PRICE, payload: value };
}

export function ChangeProductPriceMin(value: number): ProductAction {
    return { type: CHANGE_PRODUCT_PRICE_MIN, payload: value };
}

export function ChangeProductPriceMax(value: number): ProductAction {
    return { type: CHANGE_PRODUCT_PRICE_MAX, payload: value };
}

export function ChangeProductDiscountPrice(value: number): ProductAction {
    return { type: CHANGE_PRODUCT_DISCOUNT_PRICE, payload: value };
}

export function ChangeProductSpecialPriceMin(value: number): ProductAction {
    return { type: CHANGE_PRODUCT_SPECIAL_PRICE_MIN, payload: value };
}

export function ChangeProductSpecialPriceMax(value: number): ProductAction {
    return { type: CHANGE_PRODUCT_SPECIAL_PRICE_MAX, payload: value };
}

export function ChangeSKUNumber(value: string): ProductAction {
    return { type: CHANGE_SKU_NUMBER, payload: value };
}

export function ChangeSKUColor(value: string): ProductAction {
    return { type: CHANGE_SKU_COLOR, payload: value };
}

export function ChangeSKUSize(value: string): ProductAction {
    return { type: CHANGE_SKU_SIZE, payload: value };
}

export const setImageContainerWidth = (width: number): ProductAction => {
    return {
        type: SET_IMAGE_CONTAINER_WIDTH,
        payload: width
    }
}

export const resetTabIndex = () : ProductAction => {
    return {
        type: RESET_PRODUCT_TAB_INDEX,
        payload: null
    }
}

export const setTabIndex = (index: number) : ProductAction => {
    return {
        type: SET_PRODUCT_TAB_INDEX,
        payload: index
    }
}

export const setSkuStatus = (skunumber: string, status: boolean) : ProductAction => {
    return {
        type: PRODUCT_SET_PRODUCT_SKU_ISACTIVE,
        payload: {skunumber, status}
    }
}

export const setAvailableFields = (availableFields : 'COLORSIZE' | 'COLOR' | 'SIZE' | '' ) : ProductAction => {
    return {
        type: PRODUCT_SET_AVAILABLE_FIELDS,
        payload: availableFields
    }
}

export const GetAllVendor = (): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({ type: SET_PRODUCT_GET_PRODUCT_DETAILS_LOADING, payload: true })
        const apiUrl = process.env.REACT_APP_API_URL;
        try {
            const result = await axios.get(
                `${apiUrl}/user/VENDOR?approved=true`
            );

            if (result && result.status === 200) {
                dispatch({
                    type: GET_ALL_VENDOR,
                    payload: result.data
                });
            }
        } catch (err) {
            console.log({ m: 'GetAllVendor | error', d: err });
        } finally {
            dispatch({ type: SET_PRODUCT_GET_PRODUCT_DETAILS_LOADING, payload: false })
        }
    };
}

export const GetAllProductByVendor = (id: string): AppThunk => {
    return async (dispatch, getState) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        try {
            const result = await axios.get(
                `${apiUrl}/product/byVendor/${id}`
            );

            dispatch({
                type: GET_ALL_PRODUCT_BY_VENDOR,
                payload: result.data,
            });
        } catch (err) {
            console.log({ m: 'GetAllProductByVendor | error', d: err });
        }
    };
}

export const editSku = (row: { [name: string]: string | number }, textInput: boolean): AppThunk => {
    return async(dispatch, getState) => {
        let skus = getState().product.skus;
        const skuIndex = findIndex(skus, { id: row.id })
        let newSku: typeof row;
        if(textInput) {
            newSku = { ...skus[skuIndex], ...row }
        } else {
            newSku = {...skus[skuIndex], isEditing: !skus[skuIndex].isEditing }
        }
        skus[skuIndex] = newSku;
        
        dispatch({
            type: EDIT_SKU,
            payload: skus
        })
        if(skus.length === 1) {
            dispatch({
                type: SET_PRODUCT_STATE,
                payload: { 'availableFields' : 'COLORSIZE' }
            })
        }
    }
}

export const clearSelectedTier2And3 = () : ProductAction => {
    return {
        type: CLEAR_SELECTED_TIER2AND3,
        payload: null
    }
}

export const clearSelectedTier3 = () : ProductAction => {
    return {
        type: CLEAR_SELECTED_TIER3,
        payload: null
    }
}

export const setProductState = (input : ProductInput) : ProductAction => {
    return {
        type: SET_PRODUCT_STATE,
        payload: input
    }
}

export const fetchTier1Categories = () : AppThunk => {
    return async (dispatch, getState) => {
        try {
            const categories = await axios.get(`${apiUrl}/product/category/h1`);
            if(categories.status === 200 && categories.data.length > 0) {
                dispatch({ type: SET_PRODUCT_STATE, payload: { 'tier1Categories' : categories.data } })
            }
        } catch (e) {
            console.log(e);
            alert(e.toString());
        }
    }
}

export const fetchTier2Categories = (h1: string) : AppThunk => {
    return async (dispatch, getState) => {
        try {
            const categories = await axios.get(`${apiUrl}/product/category/${h1}/h2`);
            if(categories.status === 200 && categories.data.length > 0) {
                dispatch({ type: SET_PRODUCT_STATE, payload: { 'tier2Categories' : categories.data } })
            }
        } catch (e) {
            console.log(e);
            alert(e.toString());
        }
    }
}

export const fetchTier3Categories = (h1: string, h2: string) : AppThunk => {
    return async (dispatch, getState) => {
        try {
            const categories = await axios.get(`${apiUrl}/product/category/${h1}/${h2}/h3`);
            if(categories.status === 200 && categories.data.h3.length > 0) {
                dispatch({ type: SET_PRODUCT_STATE, payload: { 'tier3Categories' : categories.data.h3 } })
            }
        } catch (e) {
            console.log(e);
            alert(e.toString());
        }
    }
}