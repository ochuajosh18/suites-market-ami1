import { AppThunk } from "..";
import { CategoryAction, CategoryInput, ColumnLevel, SET_CATEGORY_STATE } from "./types";
import { toastError, toastSuccess } from  '../../modules/Toast';
import { GenericMedia } from "../system/types";

import axios from 'axios';
import find from 'lodash/find';

const API_URL = process.env.REACT_APP_API_URL;

export const setCategoryState = (input: CategoryInput) : CategoryAction => {
    return {
        type: SET_CATEGORY_STATE,
        payload: input
    }
}

export const getAllCategories = (isCrud = false) : AppThunk => {
    return async (dispatch, getState) => {
        dispatch({ type: SET_CATEGORY_STATE, payload: { categoryLoading : true }});
        const { selectedTierOne, selectedTierTwo } = getState().category;
        try {
            const categories = await axios.get(`${API_URL}/product/category${isCrud ? '?forMarketplace=true' : ''}`);
            if(categories && categories.status === 200) {
                if(categories.data.length > 0) {
                    const tierOne = find(categories.data, { name: selectedTierOne })
                    const tierTwoCategories = tierOne ? typeof tierOne.h2 === 'undefined' ? [] : tierOne.h2 : [];
                    const tierTwoCategory = tierTwoCategories.length > 0 ? find(tierTwoCategories, { name: selectedTierTwo }) : undefined
                    dispatch({
                        type: SET_CATEGORY_STATE,
                        payload: {
                            tierOneCategories: categories.data,
                            tierTwoCategories,
                            tierThreeCategories: tierTwoCategory ? tierTwoCategory.h3 : []
                        }
                    })
                }
            }
        } catch (e) {
            console.log(e.toString());
            toastError(e.toString());
        } finally {
            dispatch({ type: SET_CATEGORY_STATE, payload: { categoryLoading : false }});
        }
    }
}

export const addCategory = (level: ColumnLevel) : AppThunk => {
    return async (dispatch, getState) => {
        dispatch({ type: SET_CATEGORY_STATE, payload: { modalAddOrEditIsLoading: true }})
        const { modalImage, tierOneCategories, tierTwoCategories, selectedTierOne, selectedTierTwo, modalCategoryName } = getState().category;

        interface BodyType {
            layer: number;
            h1: string;
            h1Thumbnail: GenericMedia;
            h2?: Array<{h2Thumbnail: GenericMedia; name: string; h3?: Array<String>}>
        }
        let uploadFail = false;

        let data : BodyType = { h1: '', h1Thumbnail: { name: '', type: '', size: 0, path: '' }, layer: 1 }

        switch(level) {
            case 'Level 1': data = { ...data, h1: modalCategoryName, layer: 1 }
                break;
            case 'Level 2': {
                const tierOne = find(tierOneCategories, { name: selectedTierOne });
                if(tierOne) {
                    data = { ...data, h1: tierOne.name, h1Thumbnail: tierOne.h1Thumbnail, h2: [{ name: modalCategoryName, h2Thumbnail: modalImage }], layer: 2  }
                }
            }
                break;
            case 'Level 3': {
                const tierOne = find(tierOneCategories, { name: selectedTierOne });
                const tierTwo = find(tierTwoCategories, { name: selectedTierTwo });
                if(tierOne && tierTwo) {
                    data = { 
                        ...data, 
                        h1: tierOne.name, 
                        h1Thumbnail: tierOne.h1Thumbnail, 
                        h2: [{ 
                            name: tierTwo.name, 
                            h2Thumbnail: tierTwo.h2Thumbnail,
                            h3: tierTwo.h3 ? [ ...tierTwo.h3, modalCategoryName ] : [modalCategoryName]
                        }], 
                        layer: 3
                    }
                }
            }
        }

        //UPLOAD CATEGORY THUMBNAIL AND GET THE URL
        if (typeof modalImage.file !== 'undefined') {
            const mediaForm = new FormData();
            mediaForm.append('media', modalImage.file!);
            try {
                const upRes = await axios.post(`${API_URL}/media/upload/thumbnail`, mediaForm);
                if (upRes.status === 200) {
                    if(level === 'Level 1') {
                        data = { ...data, h1: modalCategoryName, h1Thumbnail: upRes.data.thumbnail}
                    } else {
                        const tierOne = find(tierOneCategories, { name: selectedTierOne });
                        if(tierOne) {
                            data = { ...data, h1: tierOne.name, h2: [{ name: modalCategoryName, h2Thumbnail: upRes.data.thumbnail }]  }
                        }
                    }
                }
            } catch (e) {
                if(e.response.data.error.message === "Each file cannot exceed 5mb") toastError('File cannot exceed 5mb');
                uploadFail = true;
            }
        }

        if(!uploadFail) {
            try {
                const addRes = await axios.post(`${API_URL}/product/category`, data);
                if(addRes.status === 200) {
                    dispatch({ type: SET_CATEGORY_STATE, payload: { modalAddOrEditIsOpen: false } })
                    await new Promise(resolve => setTimeout(resolve, 100));
                    dispatch(getAllCategories());
                    toastSuccess('Category successfully created');
                }
            } catch (e) {
                toastError(e.toString());
            } finally {
                dispatch({ type: SET_CATEGORY_STATE, payload: { modalAddOrEditIsLoading: false }})
            }
        }
    }
}

export const deleteCategory = () : AppThunk => {
    return async (dispatch, getState) => {
        dispatch({ type: SET_CATEGORY_STATE, payload: { modalDeleteIsLoading: true }})
        const { selectedLevel, selectedTierOne, selectedTierTwo, modalCategoryName } = getState().category;

        let body : { h1: string, h2?: string, h3?: string } = { h1: '' };

        switch(selectedLevel) {
            case 'Level 1': body = { ...body, h1: modalCategoryName }
                break;
            case 'Level 2': body = { ...body, h1: selectedTierOne, h2: modalCategoryName }
                break;
            case 'Level 3': body = { ...body, h1: selectedTierOne, h2: selectedTierTwo, h3: modalCategoryName }
                break;
            default:
                return;
        }

        try {
            const delRes = await axios.delete(`${API_URL}/product/category`, { data: body });
            if(delRes.status === 204) {
                if(selectedLevel === 'Level 1' && modalCategoryName === body.h1) {
                    dispatch({ type: SET_CATEGORY_STATE, payload: { selectedTierOne: '', selectedTierTwo: '' } })
                } else if ( selectedLevel === 'Level 2' && modalCategoryName === body.h2) {
                    dispatch({ type: SET_CATEGORY_STATE, payload: { selectedTierTwo: '' } })
                }

                dispatch({ type: SET_CATEGORY_STATE, payload: { modalDeleteIsOpen: false, modalDeleteIsLoading: false } })
                await new Promise(resolve => setTimeout(resolve, 100));
                dispatch(getAllCategories());
                toastSuccess('Category successfully deleted');
            }
        } catch (e) {
            if(e.response.data.error.message === "Delete Category: Category is being used") {
                toastError('There are products. tagged to this category.');
            } else {
                toastError(e.toString());
            }
        } finally {
            dispatch({ type: SET_CATEGORY_STATE, payload: { modalDeleteIsLoading: false }})
        }

    }
}

export const updateCategory = () : AppThunk => {
    return async (dispatch, getState) => {
        dispatch({ type: SET_CATEGORY_STATE, payload: { modalAddOrEditIsLoading: true }})
        const { modalImage, tierOneCategories, tierTwoCategories, selectedTierOne, selectedTierTwo, modalCategoryName, selectedLevel, prevModalCategoryName } = getState().category;

        interface BodyType {
            current_name: string;
            new_name?: string;
            layer: number
            thumbnail?: GenericMedia;
            h1?: string;
            h2?: string;
        }

        let noChanges = false;

        let body : BodyType = { current_name: '', layer: 1 };

        switch(selectedLevel) {
            case 'Level 1': body = { ...body, current_name: prevModalCategoryName, new_name: modalCategoryName, layer: 1 }
                break;
            case 'Level 2': {
                const tierOne = find(tierOneCategories, { name: selectedTierOne });
                if(tierOne) {
                    body = { ...body, h1: tierOne.name, current_name: prevModalCategoryName, new_name: modalCategoryName, layer: 2 }
                }
                break;
            }
            case 'Level 3': {
                const tierOne = find(tierOneCategories, { name: selectedTierOne });
                const tierTwo = find(tierTwoCategories, { name: selectedTierTwo });
                if(tierOne && tierTwo) {
                    body = { 
                        ...body, 
                        h1: tierOne.name, 
                        h2: tierTwo.name,
                        current_name: prevModalCategoryName,
                        new_name: modalCategoryName,
                        layer: 3
                    }
                }
                break;
            }
            default:
                return;
        }

        //UPLOAD CATEGORY THUMBNAIL AND GET THE URL
        if (typeof modalImage.file !== 'undefined') {
            const mediaForm = new FormData();
            mediaForm.append('media', modalImage.file!);
            const upRes = await axios.post(`${API_URL}/media/upload/thumbnail`, mediaForm);
            if (upRes.status === 200) {
                if(selectedLevel === 'Level 1') {
                    body = { ...body, thumbnail: upRes.data.thumbnail }
                } else {
                    const tierOne = find(tierOneCategories, { name: selectedTierOne });
                    if(tierOne) {
                        body = { ...body, thumbnail: upRes.data.thumbnail }
                    }
                }
            }
        }

        if(body.current_name === body.new_name) {
            if (selectedLevel !== 'Level 3') {
                delete body.new_name;
            } else {
                noChanges = true;
            }
        }

        if(typeof body.thumbnail === 'undefined' || body.thumbnail.path.length <= 0 ) {
            delete body.thumbnail
        }
        
        if(!noChanges) {
            try {
                const updateRes = await axios.put(`${API_URL}/product/category`, body);
                if(updateRes.status === 204) {
                    dispatch({ type: SET_CATEGORY_STATE, payload: { modalAddOrEditIsOpen: false } })
                    if(selectedLevel === 'Level 1' && selectedTierOne === prevModalCategoryName) {
                        dispatch({ type: SET_CATEGORY_STATE, payload: { selectedTierOne: modalCategoryName } })
                    } else if (selectedLevel === 'Level 2' && selectedTierTwo === prevModalCategoryName) {
                        dispatch({ type: SET_CATEGORY_STATE, payload: { selectedTierTwo: modalCategoryName } })
                    }
                    await new Promise(resolve => setTimeout(resolve, 100));
                    dispatch(getAllCategories());
                    toastSuccess('Category successfully updated');
                }
            } catch (e) {
                console.log(e.toString());
                toastError(e.toString());
            } finally {
                dispatch({ type: SET_CATEGORY_STATE, payload: { modalAddOrEditIsLoading: false }})
            }
        } else {
            toastSuccess('Category successfully updated');
            dispatch({ type: SET_CATEGORY_STATE, payload: { modalAddOrEditIsLoading: false, modalAddOrEditIsOpen: false }})
        }
    }
}