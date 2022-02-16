import {
    SET_BASIC_PRODUCT_STATE,
    BasicProductStateInput,
    BasicProductAction,
    BasicProductSku,
    DynamicBasicProductInput,
    BasicProductMedia,
    HierarchyOne,
    HierarchyTwo
} from './types';
import { GenericMedia, SET_SYSTEM_STATE } from '../system/types';
import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import { AppThunk } from '..';
import { toastError, toastSuccess, toastWarning } from '../../modules/Toast';
import { mediaFieldUploader } from '../../utils/fields';
import { initAxiosCancelToken } from '../../utils/validators';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import find from 'lodash/find';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import { v4 } from 'uuid';
const API_URL = process.env.REACT_APP_API_URL;
let cancellableRequest: CancelTokenSource | null = null;

export const setBasicProductState = (state: BasicProductStateInput): BasicProductAction => ({
    type: SET_BASIC_PRODUCT_STATE,
    payload: state
});

export const getProductSkus = (productId: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_BASIC_PRODUCT_STATE,
            payload: { productsLoading: true }
        });
        try {
            const res = await axios.get(`${API_URL}/product/basic/sku?productId=${productId}`);
            const prodRes = await axios.get(`${API_URL}/product/basic?id=${productId}`);
            // get fields
            const fields = await axios.get(`${API_URL}/basic-module-fields/product`);
            const product = prodRes.data;
            if (res.status === 200) {
                // map data to proper types
                dispatch({
                    type: SET_BASIC_PRODUCT_STATE,
                    payload: { 
                        activeProductSkus: orderBy(
                            map(res.data, (sku) => ({ ...sku, mainSku: product && product.featuredSku === sku.id })),
                            ['mainSku'],
                            ['desc']
                        ),
                        activeFields: fields.data,
                        activeProduct: prodRes.data
                    }
                });
            }
        }
        catch (e) {
            toastError("Something went wrong. Please contact the system administrator");
        }
        finally {
            dispatch({
                type: SET_BASIC_PRODUCT_STATE,
                payload: { productsLoading: false }
            });
        }
    }
}

export const getProducts = (type: 'list' | '', productSearch = '', active?: boolean): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_BASIC_PRODUCT_STATE,
            payload: { productListLoading: true, activeProduct: undefined, productSearch}
        });
        try {
            const activeQueryParam = typeof active === 'boolean' ? `&isActive=${active}` : '';
            const searchQueryParam = productSearch ? `&search=${productSearch}` : '';
            cancellableRequest = initAxiosCancelToken(cancellableRequest);
            const res = await axios.get(`${API_URL}/product/basic?view=${type}${activeQueryParam}${searchQueryParam}`, { cancelToken: cancellableRequest.token });
            if (res.status === 200) {
                dispatch({
                    type: SET_BASIC_PRODUCT_STATE,
                    payload: { products: res.data }
                })
            }
        }
        catch (e) {
            if (typeof e.message !== 'undefined')
                toastError("Something went wrong. Please contact the system administrator");
        }
        finally {
            dispatch({
                type: SET_BASIC_PRODUCT_STATE,
                payload: { productListLoading: false }
            });
        }
    }
}


export const uploadProductMedia = (file: File, skuId: string): AppThunk => {
    return async (dispatch, getState) => {
        // add to local media
        const { activeSku, activeProductSkus } = getState().basicproduct;
        const mediaId = v4();
        if (activeProductSkus && activeSku) { 
            const index = findIndex(activeProductSkus, { id: skuId });
            if (index > -1) {
                let newSkuList = activeProductSkus;
                let sku: BasicProductSku = newSkuList[index];
                const newMedia = {
                    id: mediaId,
                    name: file.name,
                    type: file.type,
                    path: '',
                    size: file.size / 1000000, // convert Bytes to MB
                    loading: true
                };
                const media = typeof sku.media !== 'undefined' ? [...map(activeSku.media, (m) => ({...m, loading: false})), newMedia] : [newMedia];

                sku = { 
                    ...sku, 
                    media
                }
                newSkuList[index] = sku;

                dispatch({
                    type: SET_BASIC_PRODUCT_STATE,
                    payload: { activeProductSkus: [...newSkuList], activeSku: { ...activeSku, media } as BasicProductSku }
                });
            }
        }
        // upload media, then reload media list
        try {
            const mediaForm = new FormData();
            mediaForm.append('media', file);
            const res = await axios.post(`${API_URL}/media/basic/upload/product`, mediaForm);
            
            const index = findIndex(activeProductSkus, { id: skuId });
            let newSkuList = activeProductSkus!;

            if (res.status === 200 || res.status === 204) {
                if (activeSku && index > -1) {
                    const media =  typeof activeSku.media !== 'undefined' ? [...activeSku.media, ...res.data.media] : [...res.data.media] ;
                    let sku: BasicProductSku = newSkuList[index];
                    sku = { 
                        ...sku, 
                        media
                    }
                    newSkuList[index] = sku;
                    dispatch({
                        type: SET_BASIC_PRODUCT_STATE,
                        payload: {
                            activeSku: { 
                                ...activeSku, 
                                media
                            }, 
                            activeProductSkus: [...newSkuList]
                        }
                    })
                }
            }
        }
        catch (e) {
            toastError("Something went wrong. Please contact the system administrator");
        }
        finally {

        }
    }
}

export const saveProduct = (): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_BASIC_PRODUCT_STATE,
            payload: { productSaving: true }
        });
        const { activeProduct, activeProductSkus, activeSku } = getState().basicproduct;
        if (activeProduct && activeProductSkus && activeSku) {
            const data = {
                name: activeProduct.name,
                type: activeProduct.type,
                media: map(activeSku.media, (media) => ({
                    name: media.name,
                    path: media.path,
                    type: media.type,
                    size: media.size
                })),
                brand: activeProduct.brand,
                ingredient: activeProduct.ingredient || '',
                description: typeof activeProduct.description !== 'undefined' ? activeProduct.description : '',
                isActive: activeSku.isActive as boolean,
                size: activeSku.size,
                color: activeSku.color as string,    
                skuNumber: activeSku.skuNumber,
            }
            try {
                const res = await axios.post(`${API_URL}/product/basic`, data);
                if (res.status === 200 || res.status === 204) {
                    // update featuredSku
                    await axios.put(`${API_URL}/product/basic/sku/${res.data.productSkuId}`, {
                        stock: typeof activeSku.stock === 'string' ? parseFloat(activeSku.stock) : activeSku.stock,
                        price: typeof activeSku.price === 'string' ? parseFloat(activeSku.price) : activeSku.price,
                        isActive: activeSku.isActive as boolean
                    })

                    toastSuccess('Product Saved');
                    dispatch({
                        type: SET_BASIC_PRODUCT_STATE,
                        payload: {
                            activeProductId: res.data.productId,
                            activeSku: undefined,
                            activeProductSkus: undefined,
                            productEditType: 'UPDATE'
                        }
                    });
                    dispatch(getProducts(''));
                    dispatch(getProductSkus(res.data.productId))
                }
            }
            catch (e) {
                console.log(e);
                toastError("Something went wrong. Please contact the system administrator");
            }
            finally {
                dispatch({
                    type: SET_BASIC_PRODUCT_STATE,
                    payload: { productSaving: false }
                });
            }
        }
    }
}

export const updateProduct = (productId: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_BASIC_PRODUCT_STATE,
            payload: { productSaving: true }
        });
        const { activeProduct, activeProductSkus } = getState().basicproduct;
        if (activeProduct) {
            let data: { [property: string]: DynamicBasicProductInput} = {
                name: activeProduct.name,
                type: activeProduct.type,
                brand: activeProduct.brand,
                ingredient: activeProduct.ingredient || '',
                description: typeof activeProduct.description !== 'undefined' ? activeProduct.description : '',
            }

            // update using module fields
            for (const field of getState().basicproduct.activeFields) {
                if (activeProduct[field.name]) {
                    data = { ...data, [field.name]: activeProduct[field.name] }
                }
            }

            const mainSku = find(activeProductSkus, { mainSku: true })
            if (mainSku) data = { ...data, featuredSku: mainSku.id } // change featured SKU
            try {
                const res = await axios.put(`${API_URL}/product/basic/${productId}`, data);
                if (res.status === 200 || res.status === 204) {
                    let requests: Array<Promise<AxiosResponse>> = [];
                    // update skus
                    const skusToUpdate = filter(activeProductSkus, (sku) => sku.id!.indexOf('PRODUCT::SKU') > -1);
                    for (const s of skusToUpdate) {
                        let req: Promise<AxiosResponse>;
                        if (!s.isDeleted) {
                            // do update
                            req = axios.put(`${API_URL}/product/basic/sku/${s.id}`, {
                                stock: typeof s.stock === 'string' ? parseFloat(s.stock) : s.stock,
                                price: typeof s.price === 'string' ? parseFloat(s.price) : s.price,
                                isActive: s.isActive as boolean,
                                media: map(s.media, (m) => ({ name: m.name, path: m.path, size: m.size, type: m.type }))
                            });
                        }
                        else {
                            // do delete
                            req = axios.delete(`${API_URL}/product/basic/sku/${s.id}`);
                        }
                        requests.push(req)
                    }
                    // add skus
                    const skusToAdd = filter(activeProductSkus, (sku) => sku.id!.indexOf('PRODUCT::SKU') === -1);
                    for (const s of skusToAdd) {
                        const req = axios.post(`${API_URL}/product/basic/sku`, {
                            stock: parseFloat(s.stock as string),
                            price: parseFloat(s.price as string),
                            isActive: s.isActive as boolean,
                            media: map(s.media, (m) => ({ name: m.name, path: m.path, size: m.size, type: m.type })),
                            skuNumber: s.skuNumber,
                            color: s.color as string,
                            size: s.size as string,
                            productId // the id to add the sku
                        })
                        requests.push(req)
                    }
                    
                    await Promise.all(requests);
                    toastSuccess('Product Updated');
                }
            }
            catch (e) {
                console.log(e);
                toastError("Something went wrong. Please contact the system administrator");
            }
            finally {
                dispatch({
                    type: SET_BASIC_PRODUCT_STATE,
                    payload: { productSaving: false }
                });
            }
        }
    }
}

export const saveProductSku = (skus: Array<BasicProductSku>): AppThunk => {
    return async (dispatch) => {
        let requests: Array<Promise<AxiosResponse>> = [];
        for (const s of skus) {
            const req = axios.post(`${API_URL}/product/basic/sku`, {...s})
            requests.push(req)
        }

        try {
            // const fullfilled = await Promise.all(requests);
            // console.log(fullfilled
        }
        catch (e) {
            console.log(e)
        }
        finally {

        }
    }
}

export const onAddCustomerClick = (): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_BASIC_PRODUCT_STATE,
            payload: { productsLoading: true, activeProduct: undefined }
        });
        try {
            const fields = await axios.get(`${API_URL}/basic-module-fields/product`)
            const newSku: BasicProductSku = {
                id: undefined,
                skuNumber: '',
                size: '',
                color: '',
                editing: true,
                media: [] as Array<BasicProductMedia>,
                packagingSize: '',
                isTopTen: false,
                mainSku: true,
                isDeleted: false
            }
            
            if (fields.status === 200) {
                dispatch({
                    type: SET_BASIC_PRODUCT_STATE,
                    payload: { 
                        activeProductId: '',
                        activeProduct: {
                            id: '',
                            name: '',
                            type: '',
                            featuredSku: '',
                            brand: '',
                            ingredient: ''
                        },
                        activeProductSkus: [newSku],
                        activeSkuId: '',
                        activeSku: undefined,
                        productEditType: 'CREATE',
                        activeFields: fields.data
                    }
                });
            }
        }
        catch (e) {
            console.log(e);
            toastError("Something went wrong, please contact the administrator")
        }
        finally {
            dispatch({
                type: SET_BASIC_PRODUCT_STATE,
                payload: { productsLoading: false }
            });
        }
    }
}

// get product new process
export const getProduct = (id: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_BASIC_PRODUCT_STATE,
            payload: { productViewLoading: true, activeProductId: id, productViewActiveTab: 'Common Information' }
        });

        try {
            const fieldsRes = await axios.get(`${API_URL}/basic-module-fields/product`);
            const prodRes = await axios.get(`${API_URL}/product/basic?id=${id}`);
            const catRes = await axios.get(`${API_URL}/product/category/basic`);
            if (prodRes.status === 200 && catRes.status === 200 && fieldsRes.status === 200) {
                const prodList = getState().basicproduct.products;
                const productData = prodRes.data;

                const productFromList = find(prodList, { id: productData.id });
                const tierOne = productFromList ? find(catRes.data, { name: productFromList.h1 }) : [];
                const tierTwo = productFromList && tierOne ? tierOne.h2 : []
                const tierTwoList = productFromList ? find(tierTwo, { name: productFromList.h2 }) : undefined;

                dispatch({
                    type: SET_BASIC_PRODUCT_STATE,
                    payload: { 
                        activeProduct: productFromList ? { ...productFromList, ...productData } : productData,
                        tierOneCategories: catRes.data,
                        tierTwoCategories: tierTwo,
                        tierThreeCategories: tierTwoList ? tierTwoList.h3 : [],
                        activeProductFeaturedSku: prodRes.data.featuredSku,
                        fields: fieldsRes.data.assignedFields,
                        sections: fieldsRes.data.sections
                    }
                });
            }
        }
        catch (e) {
            if (e.response && e.response.status === 404) {
                // redirect to list since resource not found
                dispatch({
                    type: SET_SYSTEM_STATE,
                    payload: { shallRedirect: true, redirectTo: '/sales/product' }
                });

                toastWarning("Resource not found");
            }
            else {
                toastError("Something went wrong. Please contact the system administrator");
                dispatch({
                    type: SET_BASIC_PRODUCT_STATE,
                    payload: { activeProductError: true }
                });
            }
        }
        finally {
            dispatch({
                type: SET_BASIC_PRODUCT_STATE,
                payload: { productViewLoading: false }
            });
        }
    }
}

// get product variants new process
export const getProductVariants = (productId: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_BASIC_PRODUCT_STATE,
            payload: { productVariantsLoading: true, activeProductVariant: undefined }
        });

        try {
            const getVarRes = await axios.get(`${API_URL}/product/basic/sku?productId=${productId}`);
            if (getVarRes.status === 200) {
                dispatch({
                    type: SET_BASIC_PRODUCT_STATE,
                    payload: { productVariants: orderBy(getVarRes.data, ['skuNumber', 'size', 'color'], ['asc', 'asc', 'asc']) }
                });
            }
        }
        catch (e) {
            toastError("Something went wrong. Please contact the administrator");
        }
        finally {
            dispatch({
                type: SET_BASIC_PRODUCT_STATE,
                payload: { productVariantsLoading: false }
            });
        }
    }
}

// save product new process
export const saveSalesProduct = (): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_BASIC_PRODUCT_STATE,
            payload: { activeProductLoading: true, activeProductVariantLoading: true, productViewLoading: true }
        });

        try {
            const { activeProduct, activeProductId, activeProductVariant } = getState().basicproduct;
            if (activeProduct) {
                let product: { [property: string]: DynamicBasicProductInput} = {
                    h1: activeProduct.h1 as string || '',
                    h2: activeProduct.h2 as string || '',
                    h3: activeProduct.h3 as string || ''
                }
    
                // update using module fields
                for (const field of getState().basicproduct.fields) {
                    if (typeof activeProduct[field.name] !== 'undefined') {
                        if ((field.type === 'Image' || field.type === 'Multimedia')) {
                            product = await mediaFieldUploader(`${API_URL}/media/basic/upload/product`, field, activeProduct, product);
                        }
                        else {
                            product = { ...product, [field.name]: field.type.toLowerCase().indexOf('number') > -1 ? parseFloat(activeProduct[field.name] as string) : activeProduct[field.name] };
                        }
                    }
                }
    
                if (activeProductId && activeProductId !== 'new' && typeof activeProduct.id !== 'undefined') {
                    const saveRes = await axios.put(`${API_URL}/product/basic/${activeProduct.id}`, product);
                    if (saveRes.status === 204) {
                        toastSuccess("Product successfully updated");
                        dispatch(getProduct(activeProductId));
                    }
                }
                else {
                    // do create new product
                    let sku: { [property: string]: DynamicBasicProductInput} = { };
                    if (activeProductVariant) {
                        // save media if needed
                        // update using module fields
                        
                        for (const field of getState().basicproduct.variantFields) {
                            const fType = field.type.toLowerCase();
                            if (typeof activeProductVariant[field.name] !== 'undefined') {
                                if ((field.type === 'Image' || field.type === 'Multimedia')) {
                                    // do upload
                                    const mediaForm = new FormData();
                                    if (field.isMultiple) {
                                        for (const m of activeProductVariant[field.name] as Array<GenericMedia>) {
                                            if (m.file) {
                                                mediaForm.append('media', m.file);
                                            }
                                        }
                                    }
                                    else {
                                        if (activeProductVariant[field.name]) {
                                            mediaForm.append('media', Array.isArray(activeProductVariant[field.name]) ? (activeProductVariant[field.name] as GenericMedia)[0].file! :  (activeProductVariant[field.name] as GenericMedia).file!);
                                        }
                                    }

                                    const upRes = await axios.post(`${API_URL}/media/basic/upload/product`, mediaForm); 
                                    if (upRes.status === 200) {
                                        sku = { 
                                            ...sku, 
                                            [field.name]: 
                                                field.isMultiple ? [...(activeProductVariant[field.name] as Array<GenericMedia>), ...upRes.data.media]
                                                :
                                                upRes.data.media[0] ? upRes.data.media[0] : activeProductVariant[field.name] ? activeProductVariant[field.name] : null
                                        }
                                    }
                                }
                                else {
                                    sku = { ...sku, [field.name]: fType.indexOf('number') > -1 ? parseFloat(activeProductVariant[field.name] as string) : (activeProductVariant[field.name] ? activeProductVariant[field.name] : null) }
                                }
                            }

                            if (fType === 'input range') {
                                if (activeProductVariant[field.minName as string] && activeProductVariant[field.maxName as string]) {
                                    sku = {
                                        ...sku,
                                        [field.minName as string]:  parseFloat(activeProductVariant[field.minName as string] as string),
                                        [field.maxName as string]:  parseFloat(activeProductVariant[field.maxName as string] as string),
                                    }
                                }
                            }
                        }


                        const saveRes = await axios.post(`${API_URL}/product/basic`, {
                            product: { ...product, isActive: true },
                            sku
                        });
                        
                        if (saveRes.status === 200 || saveRes.status === 204) {
                            // redirect to list 
                            dispatch({
                                type: SET_SYSTEM_STATE,
                                payload: { shallRedirect: true, redirectTo: '/sales/product', header: undefined }
                            });

                            toastSuccess("Product created successfully");
                        }
                    }


                }
            }
        }
        catch (e) {
            console.log(e)
            if (e.message) {
                toastWarning(e.message)
            }
            else {
                toastError("Something went wrong. Please contact the administrator");
            }
        }
        finally {
            dispatch({
                type: SET_BASIC_PRODUCT_STATE,
                payload: { activeProductLoading: false, activeProductVariantLoading: false, productViewLoading: false }
            });
        }
    }
}

// delete product
export const deleteProduct = (id: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_BASIC_PRODUCT_STATE,
            payload: { activeProductLoading: true }
        });

        try {
            const delRes = await axios.delete(`${API_URL}/product/basic/${id}`)
            if (delRes.status === 204) {
                const list = getState().basicproduct.products;
                const prodIndex = findIndex(list, { id });
                if (prodIndex > -1) {
                    dispatch({
                        type: SET_BASIC_PRODUCT_STATE,
                        payload: { activeProductLoading: false, product: list.splice(prodIndex, 1) }
                    });
        
                    dispatch({
                        type: SET_SYSTEM_STATE,
                        payload: {
                            shallRedirect: true,
                            redirectTo: '/sales/product'
                        }
                    });
                    toastSuccess("Product successfully deleted");
                }
            }
        }
        catch (e) {
            toastError("Something went wrong. Please contact the administrator");
        }
    }
}

export const getProductVariant = (variantId: string, isDuplicating?: boolean): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_BASIC_PRODUCT_STATE,
            payload: { 
                activeProductVariant: { id: variantId }, 
                activeProductVariantLoading: true 
            }
        });
        
        try {
            const varRes = await axios.get(`${API_URL}/product/basic/sku?id=${variantId}`);
            const fieldsRes = await axios.get(`${API_URL}/basic-module-fields/product_sku`);
            if (varRes.status === 200 && fieldsRes.status === 200) {
                dispatch({
                    type: SET_BASIC_PRODUCT_STATE,
                    payload: { 
                        activeVariantCopy: varRes.data,
                        activeProductVariant: isDuplicating ? {
                            ...varRes.data,
                            id: 'new',
                            stock: '',
                            size: '',
                            color: '',
                            skuNumber: ''
                        } :varRes.data,
                        variantFields: fieldsRes.data.assignedFields,
                        variantSections: fieldsRes.data.sections,
                    }
                });
            }
        }
        catch(e) {

        }
        finally {
            dispatch({
                type: SET_BASIC_PRODUCT_STATE,
                payload: { activeProductVariantLoading: false }
            });
        }
    }
}

export const saveProductVariant = (): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_BASIC_PRODUCT_STATE,
            payload: { activeProductVariantLoading: true }
        });
        
        const { activeProductId, activeProductVariant, activeProductFeaturedSku, activeProduct, mediaToDelete, isDuplicating } = getState().basicproduct
        try {
            if (activeProductVariant && activeProductVariant.id) { 
                let data: { [property: string]: DynamicBasicProductInput} = { };
                for (const field of getState().basicproduct.variantFields) {
                    const fType = field.type.toLowerCase();
                    if (typeof activeProductVariant[field.name] !== 'undefined') {
                        if (field.type === 'Image' || field.type === 'Multimedia') {
                            // do upload
                            const mediaForm = new FormData();
                            if (field.isMultiple) {
                                for (const m of activeProductVariant[field.name] as Array<GenericMedia>) {
                                    if (m.file) {
                                        mediaForm.append('media', m.file);
                                    }
                                }
                            }
                            else {
                                mediaForm.append('media', Array.isArray(activeProductVariant[field.name]) ? (activeProductVariant[field.name] as GenericMedia)[0].file! :  (activeProductVariant[field.name] as GenericMedia).file!);
                            }

                            const upRes = await axios.post(`${API_URL}/media/basic/upload/product`, mediaForm); 
                            data = { 
                                ...data, 
                                [field.name]: 
                                    field.isMultiple ? 
                                        [...filter(activeProductVariant[field.name] as Array<GenericMedia>, (f) => typeof f.file === 'undefined'), ...upRes.data.media] 
                                    : 
                                        upRes.data.media[0] ? upRes.data.media[0] : activeProductVariant[field.name] ? activeProductVariant[field.name] : null
                            };
                        }
                        else {
                            data = { 
                                ...data, 
                                [field.name]: fType.indexOf('number') > -1 ? parseFloat(activeProductVariant[field.name] as string) : (activeProductVariant[field.name] ? activeProductVariant[field.name] : null)
                            }
                            
                        }
                    }

                    if (fType === 'input range') {
                        if (activeProductVariant[field.minName as string] && activeProductVariant[field.maxName as string]) {
                            data = {
                                ...data,
                                [field.minName as string]:  parseFloat(activeProductVariant[field.minName as string] as string),
                                [field.maxName as string]:  parseFloat(activeProductVariant[field.maxName as string] as string),
                            }
                        }
                    }
                }
                
                // delete media
                if (mediaToDelete.length > 0) {
                    let dString = '';
                    for (const mtd of mediaToDelete) {
                        dString += `fileName=${mtd}&`
                    }
                    await axios.delete(`${API_URL}/media?${dString.substring(0, dString.length - 1)}`);
                }

                if (activeProductVariant.id.indexOf('PRODUCT::SKU') > -1 && !isDuplicating) {
                    const varRes = await axios.put(`${API_URL}/product/basic/sku/${activeProductVariant.id}`, data);
                    if (varRes.status === 204) {
                        toastSuccess("SKU successfully updated")
                    }
                }
                else {
                    delete data.id;
                    const varRes = await axios.post(`${API_URL}/product/basic/sku`, { 
                        ...data, 
                        productId: activeProductId
                    });
                    if (varRes.status === 200) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        toastSuccess("SKU successfully created")
                    }
                }

                if (activeProduct && activeProduct.featuredSku !== activeProductFeaturedSku) {
                    await axios.put(`${API_URL}/product/basic/${activeProduct.id}`, { ...activeProduct, featuredSku: activeProduct.featuredSku, isActive: true });
                    dispatch({
                        type: SET_BASIC_PRODUCT_STATE,
                        payload: { activeProductFeaturedSku: activeProduct.featuredSku }
                    });
                }

                dispatch(getProductVariants(activeProductId));
            }
        }
        catch(e) {
            console.log(e)
            if (e.message) {
                toastWarning(e.message)
            }
            else {
                toastError("Something went wrong. Please contact the administrator");
            }
        }
        finally {
            dispatch({
                type: SET_BASIC_PRODUCT_STATE,
                payload: { activeProductVariantLoading: false }
            });
        }
    }
}

export const uploadVariantMedia = (file: File): AppThunk => {
    return async (dispatch, getState) => {
        const { activeProductVariant } = getState().basicproduct;
        if (activeProductVariant) {
            const pseudoId = v4();
            dispatch({
                type: SET_BASIC_PRODUCT_STATE,
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
                const upRes = await axios.post(`${API_URL}/media/basic/upload/product`, mediaForm); 
                if (upRes.status === 200) {
                    const newVariant = getState().basicproduct.activeProductVariant!;
                    const i = findIndex(newVariant.media, { id: pseudoId });
                    let newMedia = newVariant.media;
                    newMedia[i] = { ...upRes.data.media[0] };
                    dispatch({
                        type: SET_BASIC_PRODUCT_STATE,
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
                toastError("Something went wrong, please contact the administrator")
            }
        }
    }
}


// delete product
export const deleteProductVariant = (skuId: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_BASIC_PRODUCT_STATE,
            payload: { activeProductVariantLoading: true, productVariantsLoading: true }
        });

        try {
            const delRes = await axios.delete(`${API_URL}/product/basic/sku/${skuId}`)
            if (delRes.status === 204) {
                toastSuccess("Product SKU successfully deleted");
                dispatch(getProductVariants(getState().basicproduct.activeProductId));
            }
        }
        catch (e) {
            toastError("Something went wrong. Please contact the administrator");
        }
        finally {
            dispatch({
                type: SET_BASIC_PRODUCT_STATE,
                payload: { activeProductVariantLoading: false, productVariantsLoading: false }
            });
        }
    }
}

export  const loadCategories = (withLoading = false): AppThunk => {
    return async (dispatch, getState) => {
        if (withLoading) {
            dispatch({
                type: SET_BASIC_PRODUCT_STATE,
                payload: { productViewLoading: true }
            });
        }
        try {
            // let url = `${API_URL}/product/category/basic`;
            // url = h1 ? `${url}${h1}/h2` : `${url}/h1`; // load h1 or h2
            // url = h2 ? `${url}/${h1}/${h2}/h3` : url;

            // let property: 'tierOneCategories' | 'tierTwoCategories' | 'tierThreeCategories' = 'tierOneCategories';
            // property = h1 ? 'tierTwoCategories' : property;
            // property = h2 ? 'tierThreeCategories' : property;

            // const { tierTwoCategories, tierThreeCategories } = getState().basicproduct;

            const catRes = await axios.get(`${API_URL}/product/category/basic`);
            const fields = await axios.get(`${API_URL}/basic-module-fields/product`);
            const skuFields = await axios.get(`${API_URL}/basic-module-fields/product_sku`);
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
                    type: SET_BASIC_PRODUCT_STATE,
                    payload: { 
                        tierOneCategories,
                        tierTwoCategories,
                        tierThreeCategories,
                        fields: fields.data.assignedFields,
                        sections: fields.data.sections,
                        variantFields: skuFields.data.assignedFields,
                        variantSections: skuFields.data.sections
                    }
                });
            }

        }
        catch (e) {
            
        }
        finally {
            if (withLoading) {
                dispatch({
                    type: SET_BASIC_PRODUCT_STATE,
                    payload: { productViewLoading: false }
                });
            }
        }
    }
}