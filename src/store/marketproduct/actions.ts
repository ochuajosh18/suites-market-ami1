import {
    SET_MARKET_PRODUCT_STATE,
    MarketProductStateInput,
    MarketProductAction,
    DynamicMarketProductInput,
    HierarchyOne,
    HierarchyTwo
} from './types';
import { GenericMedia, SET_SYSTEM_STATE } from '../system/types';
import axios, { AxiosResponse } from 'axios';
import { AppThunk } from '..';
import { toastError, toastSuccess, toastWarning } from '../../modules/Toast';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import filter from 'lodash/filter';
import { v4 } from 'uuid';
const API_URL = process.env.REACT_APP_API_URL;

// media uploader
const mediaUpload = async (data: Array<GenericMedia>): Promise<Array<GenericMedia>> => {
    // upload media if needed
    let mediaUploadData: { 
        image: Array<File>, 
        video: Array<File>, 
        pdf: Array<File>
    } = {
        image: [],
        video: [],
        pdf: []    
    };

    for (const m of data) {
        if (typeof m.file !== 'undefined') {
            if (m.type.indexOf('image') > -1) mediaUploadData.image = [...mediaUploadData.image, m.file];
            else if (m.type.indexOf('video') > -1) mediaUploadData.video = [...mediaUploadData.video, m.file];
            else if (m.type.indexOf('pdf') > -1) mediaUploadData.pdf = [...mediaUploadData.pdf, m.file];
        }
    }
    
    let newMedia: Array<GenericMedia> = [];
    try {
        for (const i of Object.keys(mediaUploadData)) {
            const fileList = mediaUploadData[i] as Array<File>;
            const form = new FormData();
            if (fileList.length > 0) {
                for (const f of mediaUploadData[i]) {
                    form.append('media', f);
                }
                // do upload
                const upRes = await axios.post(`${API_URL}/media/upload/product?mediaType=${i}`, form);
                if (upRes.status === 200) {
                    newMedia = [...newMedia, ...upRes.data.media]
                }
            }
        }
    }
    catch (e) {
        Promise.reject(e);
    }

    return Promise.resolve(newMedia);
}

const errorHandler = (e: { response: AxiosResponse<any> }) => {
    if (typeof e.response !== 'undefined' && e.response.data.error && e.response.data.error.message) {
        const m =  e.response.data.error.message;
        if (m.indexOf(':') > -1 && m.split(':')[1]) {
            toastError(m.split(':')[1].trim());
        }
        else {
            toastError("Something went wrong. Please contact the administrator");
        }
    }
    else {
        toastError("Something went wrong. Please contact the administrator");
    }
}

export const setMarketProductState = (state: MarketProductStateInput): MarketProductAction => ({
    type: SET_MARKET_PRODUCT_STATE,
    payload: state
});

export const getProducts = (type: 'list' | '', productSearch = '', active?: boolean): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: { productListLoading: true, activeProduct: undefined, productSearch, products: [] }
        });
        const { user } = getState().login;
        try {
            const activeQueryParam = typeof active === 'boolean' ? `&isActive=${active}` : '';
            const searchQueryParam = productSearch ? `&search=${productSearch}` : '';
            const res = await axios.get(`${API_URL}/v1/products?vendorId=${user ? user.id : ''}&view=${type}${activeQueryParam}${searchQueryParam}`);
            if (res.status === 200) {
                dispatch({
                    type: SET_MARKET_PRODUCT_STATE,
                    payload: { products: res.data }
                })
            }
        }
        catch (e) {
            errorHandler(e);
        }
        finally {
            dispatch({
                type: SET_MARKET_PRODUCT_STATE,
                payload: { productListLoading: false }
            });
        }
    }
}

// get product new process
export const getProduct = (id: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: { productViewLoading: true, activeProductId: id, productViewActiveTab: 'Common Information' }
        });

        try {
            const prodRes = await axios.get(`${API_URL}/v1/products/${id}?withCategoryString=true`);
            const catRes = await axios.get(`${API_URL}/product/category`)
            if (prodRes.status === 200 && catRes.status === 200) {
                const prodList = getState().marketproduct.products;
                const productData = prodRes.data;

                const productFromList = find(prodList, { id: productData.id });
                const tierOne = productFromList ? find(catRes.data, { name: productFromList.h1 }) : [];
                const tierTwo = productFromList && tierOne ? tierOne.h2 : []
                const tierTwoList = productFromList ? find(tierTwo, { name: productFromList.h2 }) : undefined;

                dispatch({
                    type: SET_MARKET_PRODUCT_STATE,
                    payload: { 
                        activeProduct: productFromList ? { ...productFromList, ...productData } : productData,
                        tierOneCategories: catRes.data,
                        tierTwoCategories: tierTwo,
                        tierThreeCategories: tierTwoList ? tierTwoList.h3 : [],
                        activeProductFeaturedSku: prodRes.data.featuredSku
                    }
                });
            }
        }
        catch (e) {
            if (e.response && e.response.status === 404) {
                // redirect to list since resource not found
                dispatch({
                    type: SET_SYSTEM_STATE,
                    payload: { shallRedirect: true, redirectTo: '/market/product' }
                });

                toastWarning("Resource not found");
            }
            else {
                toastError("Something went wrong. Please contact the system administrator");
                dispatch({
                    type: SET_MARKET_PRODUCT_STATE,
                    payload: { activeProductError: true }
                });
            }
        }
        finally {
            dispatch({
                type: SET_MARKET_PRODUCT_STATE,
                payload: { productViewLoading: false }
            });
        }
    }
}

// get product variants new process
export const getProductVariants = (productId: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: { productVariantsLoading: true, activeProductVariant: undefined }
        });

        try {
            const getVarRes = await axios.get(`${API_URL}/v1/products/${productId}/skus`);
            if (getVarRes.status === 200) {
                
                dispatch({
                    type: SET_MARKET_PRODUCT_STATE,
                    payload: { productVariants: getVarRes.data, activeProductFeaturedSku:  getState().marketproduct.activeProduct!.featuredSku }
                });
            }
        }
        catch (e) {
            errorHandler(e);
        }
        finally {
            dispatch({
                type: SET_MARKET_PRODUCT_STATE,
                payload: { productVariantsLoading: false }
            });
        }
    }
}

// save product new process
export const saveMarketProduct = (): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: { productViewLoading: true, activeProductVariantLoading: true}
        });

        try {
            const { activeProduct, activeProductId, activeProductVariant } = getState().marketproduct;
            if (activeProduct) {
                let data: { [property: string]: DynamicMarketProductInput} = {
                    name: activeProduct.name,
                    type: activeProduct.type,
                    brand: activeProduct.brand,
                    material: activeProduct.material as string || '',
                    ingredient: activeProduct.ingredient as string || '',
                    description: activeProduct.description as string || '',
                    h1: activeProduct.h1 as string || '',
                    h2: activeProduct.h2 as string || '',
                    h3: activeProduct.h3 as string || ''
                }
    
                // update using module fields
                // for (const field of getState().marketproduct.activeFields) {
                //     if (activeProduct[field.name]) {
                //         data = { ...data, [field.name]: activeProduct[field.name] }
                //     }
                // }
    
                if (activeProductId && activeProductId !== 'new' && typeof activeProduct.id !== 'undefined') {
                    const saveRes = await axios.put(`${API_URL}/v1/products/${activeProduct.id}`, data);
                    if (saveRes.status === 204 || saveRes.status === 200) {
                        toastSuccess("Product successfully updated")
                    }
                }
                else {
                    // do create new product
                    if (activeProductVariant) {
                        // save media if needed
                        let newMedia = await mediaUpload(activeProductVariant.media);
                        let createData: { [name: string]: DynamicMarketProductInput} = {
                            vendorId: getState().login.user.id,
                            name: data.name,
                            type: data.type,
                            media: newMedia.length > 0 ? newMedia : activeProductVariant.media,
                            brand: data.brand,
                            ingredient: data.ingredient,
                            material: data.material,
                            unit: activeProductVariant.unit as string,
                            description: data.description,
                            discountPrice: parseFloat(activeProductVariant.discountPrice as string) || 0,
                            size: activeProductVariant.size,
                            color: activeProductVariant.color,
                            skuNumber: activeProductVariant.skuNumber,
                            price: activeProductVariant.price ? parseInt(activeProductVariant.price as string) : 0,
                            marketStock: activeProductVariant.marketStock ? parseInt(activeProductVariant.marketStock as string) : 1,
                            minQuantity: 1,
                            h1: data.h1,
                            h2: data.h2,
                            h3: data.h3,
                            isActive: true
                        };

                        if (!activeProductVariant.size) delete createData.size;
                        if (!activeProductVariant.color) delete createData.color;
                        const saveRes = await axios.post(`${API_URL}/v1/products`, createData);
                        
                        if (saveRes.status === 200 || saveRes.status === 204) {
                            // update variant after saving product
                            const { productSkuId } = saveRes.data;
                            let varUpdateData: Partial<typeof activeProductVariant> = { 
                                ...activeProductVariant,
                                media: newMedia.length > 0 ? newMedia : activeProductVariant.media,
                                price: parseFloat(activeProductVariant.price as string),
                                discountPrice: parseFloat(activeProductVariant.discountPrice as string),
                                marketStock: activeProductVariant.marketStock ? parseInt(activeProductVariant.marketStock as string) : 1,
                            };
                            delete varUpdateData.id;
                            if (!parseFloat(varUpdateData.minBargainPrice as string)) delete varUpdateData.minBargainPrice;
                            if (!parseFloat(varUpdateData.maxBargainPrice as string)) delete varUpdateData.maxBargainPrice;
                            if (!parseFloat(varUpdateData.minSpecialPrice as string)) delete varUpdateData.minSpecialPrice;
                            if (!parseFloat(varUpdateData.maxSpecialPrice as string)) delete varUpdateData.maxSpecialPrice;
                            if (!varUpdateData.size) delete varUpdateData.size;
                            if (!varUpdateData.color) delete varUpdateData.color;
                            await new Promise(resolve => setTimeout(resolve, 200));
                            const varRes = await axios.put(`${API_URL}/v1/products/${saveRes.data.productId}/skus/${productSkuId}`, varUpdateData);
                            if (varRes.status === 200 || varRes.status === 204) {
                                // redirect to list 
                                dispatch({
                                    type: SET_SYSTEM_STATE,
                                    payload: { shallRedirect: true, redirectTo: '/market/product', header: undefined }
                                });
    
                                toastSuccess("Product created successfully");
                            }
                        }
                    }


                }
            }
        }
        catch (e) {
            errorHandler(e);
        }
        finally {
            dispatch({
                type: SET_MARKET_PRODUCT_STATE,
                payload: { productViewLoading: false, activeProductVariantLoading: false }
            });
        }
    }
}

// delete product
export const deleteProduct = (id: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: { activeProductLoading: true }
        });

        try {
            const delRes = await axios.delete(`${API_URL}/v1/products/${id}`)
            if (delRes.status === 200 || delRes.status === 204) {
                const list = getState().marketproduct.products;
                const prodIndex = findIndex(list, { id });
                if (prodIndex > -1) {
                    dispatch({
                        type: SET_MARKET_PRODUCT_STATE,
                        payload: { activeProductLoading: false, product: list.splice(prodIndex, 1) }
                    });
        
                    dispatch({
                        type: SET_SYSTEM_STATE,
                        payload: {
                            shallRedirect: true,
                            redirectTo: '/market/product'
                        }
                    });
                    toastSuccess("Product successfully deleted");
                }
            }
        }
        catch (e) {
            errorHandler(e);
        }
    }
}

export const getProductVariant = (variantId: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: { 
                activeProductVariant: { id: variantId }, 
                activeProductVariantLoading: true 
            }
        });
        
        try {
            const varRes = await axios.get(`${API_URL}/v1/products/${getState().marketproduct.activeProductId}/skus/${variantId}`);
            if (varRes.status === 200) {
                let varData = varRes.data;
                for (const key in varData) {
                    if (key.toLowerCase().indexOf('price') > -1) {
                        varData[key] = parseFloat(isNaN(parseFloat(varData[key])) ? '0.00' : varData[key]).toFixed(2);
                    }
                }
                dispatch({
                    type: SET_MARKET_PRODUCT_STATE,
                    payload: { 
                        activeProductVariant: varData
                    }
                });
            }
        }
        catch(e) {
            errorHandler(e);
        }
        finally {
            dispatch({
                type: SET_MARKET_PRODUCT_STATE,
                payload: { activeProductVariantLoading: false }
            });
        }
    }
}

export const saveProductVariant = (): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: { activeProductVariantLoading: true }
        });
        
        const { activeProductId, activeProductVariant, activeProductFeaturedSku, activeProduct, mediaToDelete } = getState().marketproduct
        try {
            if (activeProductVariant && activeProductVariant.id) {
                const { price, marketStock, minBargainPrice, maxBargainPrice, minSpecialPrice, maxSpecialPrice, discountPrice, media } = activeProductVariant;
                let data: { [name: string]: DynamicMarketProductInput } = {
                    ...activeProductVariant,
                    price: parseInt(price as string),
                    marketStock: marketStock ? parseInt(marketStock as string) : 0,
                }

                if (discountPrice) { data = { ...data, discountPrice: parseInt(discountPrice as string)}; } // discount price
                if (minBargainPrice) { data = { ...data, minSpecialPrice: parseInt(minBargainPrice as string)}; } // min bargain price
                if (maxBargainPrice) { data = { ...data, maxBargainPrice: parseInt(maxBargainPrice as string)}; } // max bargain price
                if (minSpecialPrice) { data = { ...data, minSpecialPrice: parseInt(minSpecialPrice as string)}; } // min special price
                if (maxSpecialPrice) { data = { ...data, maxSpecialPrice: parseInt(maxSpecialPrice as string)}; } // max special price
                
                
                let newMedia = await mediaUpload(media);
                if (newMedia.length > 0) {
                    const filteredMedia = filter(media, (m) => typeof m.file === 'undefined');
                    data = { ...data, media: [...filteredMedia, ...newMedia] } 
                }

                // delete media
                if (mediaToDelete.length > 0) {
                    let dString = '';
                    for (const mtd of mediaToDelete) {
                        dString += `fileName=${mtd}&`
                    }
                    await axios.delete(`${API_URL}/media?${dString.substring(0, dString.length - 1)}`);
                }

                if (activeProductVariant.id.indexOf('PRODUCT::SKU') > -1) {
                    const varRes = await axios.put(`${API_URL}/v1/products/${activeProductId}/skus/${activeProductVariant.id}`, data);
                    if (varRes.status === 200 || varRes.status === 204 ) {
                        toastSuccess("SKU successfully updated")
                    }
                }
                else {
                    delete data.id;
                    const varRes = await axios.post(`${API_URL}/v1/products/${activeProductId}/skus`, { 
                        ...data, 
                        vendorId: getState().login.user.id,
                        discountPrice: data.discountPrice ? parseFloat(data.discountPrice as string) : 0,
                        minQuantity: 1,
                        productId: activeProductId
                    });
                    if (varRes.status === 200 || varRes.status === 204) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        toastSuccess("SKU successfully created")
                    }
                }

                if (activeProduct && activeProduct.id && activeProduct.featuredSku !== activeProductFeaturedSku) {
                    await axios.put(`${API_URL}/v1/products/${activeProduct.id}`, { ...activeProduct, featuredSku: activeProductFeaturedSku, isActive: true } );
                    dispatch({
                        type: SET_MARKET_PRODUCT_STATE,
                        payload: { activeProductFeaturedSku, activeProduct: { ...activeProduct, featuredSku: activeProductFeaturedSku }}
                    });
                }

                dispatch(getProductVariants(activeProductId));
            }
        }
        catch(e) {
            errorHandler(e);
        }
        finally {
            dispatch({
                type: SET_MARKET_PRODUCT_STATE,
                payload: { activeProductVariantLoading: false }
            });
        }
    }
}

export const uploadVariantMedia = (file: File): AppThunk => {
    return async (dispatch, getState) => {
        const { activeProductVariant } = getState().marketproduct;
        if (activeProductVariant) {
            const pseudoId = v4();
            dispatch({
                type: SET_MARKET_PRODUCT_STATE,
                payload: { 
                    activeProductVariant: {
                        ...activeProductVariant,
                        media: [...activeProductVariant.media, {
                            id: pseudoId,
                            loading: true,
                            name: file.name,
                            path: '',
                            type: file.type,
                            size: file.size / 1000000, // convert Bytes to MB
                        }]
                    }
                }
            });

            // upload media then update local
            try {
                const mediaForm = new FormData();
                mediaForm.append('media', file);
                const upRes = await axios.post(`${API_URL}/media/upload/product`, mediaForm); 
                if (upRes.status === 200) {
                    const newVariant = getState().marketproduct.activeProductVariant!;
                    const i = findIndex(newVariant.media, { id: pseudoId });
                    let newMedia = newVariant.media;
                    newMedia[i] = { ...upRes.data.media[0] };
                    dispatch({
                        type: SET_MARKET_PRODUCT_STATE,
                        payload: { 
                            activeProductVariant: {
                                ...newVariant,
                                media: newMedia
                            }
                        }
                    });
                }
                
            }
            catch (e) {
                errorHandler(e);
            }
        }
    }
}

// delete product
export const deleteProductVariant = (skuId: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: { activeProductVariantLoading: true, productVariantsLoading: true }
        });

        try {
            const delRes = await axios.delete(`${API_URL}/v1/products/${getState().marketproduct.activeProductId}/skus/${skuId}`)
            if (delRes.status === 200 || delRes.status === 204) {
                toastSuccess("Product SKU successfully deleted");
                dispatch(getProductVariants(getState().marketproduct.activeProductId));
            }
        }
        catch (e) {
            errorHandler(e);
        }
        finally {
            dispatch({
                type: SET_MARKET_PRODUCT_STATE,
                payload: { activeProductVariantLoading: false, productVariantsLoading: false }
            });
        }
    }
}

export  const loadCategories = (): AppThunk => {
    return async (dispatch, getState) => {
        try {
            const catRes = await axios.get(`${API_URL}/product/category`);
            const tierOneCategories: Array<HierarchyOne> = catRes.data;
            const tierTwoCategories: Array<HierarchyTwo> = [];
            const tierThreeCategories: Array<string> = [];
            for (const tierOne of tierOneCategories) {
                if (typeof tierOne.h2 !== 'undefined') {
                    tierTwoCategories.push(...tierOne.h2);
                    for (const tierTwo of tierOne.h2) {
                        if (typeof tierTwo.h3 !== 'undefined') {
                            tierThreeCategories.push(...tierTwo.h3);
                        }
                    }
                }
            }

            if (catRes.status === 200) {
                dispatch({
                    type: SET_MARKET_PRODUCT_STATE,
                    payload: { 
                        tierOneCategories,
                        tierTwoCategories,
                        tierThreeCategories
                    }
                });
            }

        }
        catch (e) {
            errorHandler(e);
        }
        
    }
}