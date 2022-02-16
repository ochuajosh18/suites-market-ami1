import {
    SALESPERSON_CLICK,
    SalespersonAction,
    LOAD_SALESPERSON_LIST,
    TOGGLE_SALESPERSON_LIST_LOADING,
    TOGGLE_SALESPERSON_DETAILS_LOADING,
    UPDATE_ACTIVE_SALESPERSON,
    ActiveSalespersonInput,
    SET_SALESPERSON_STATE,
    SalespersonStateInput,
    Salesperson,
    SET_NEW_ACTIVE_SALESPERSON_DETAILS,
    TOGGLE_NEW_ACTIVE_SALESPERSON_DETAILS_LOADING,
    DynamicSalesSalespersonInput,
    SalespersonFilter,
} from './types';
import  { toastSuccess, toastError } from '../../modules/Toast';
import { SET_SYSTEM_STATE } from '../system/types';
import axios, { CancelTokenSource } from 'axios';
import { filterToParams } from '../../utils/filter';
import { initAxiosCancelToken } from '../../utils/validators';
import { AppThunk } from '..';
import sortBy from 'lodash/sortBy';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
const API_URL = process.env.REACT_APP_API_URL;
let cancellableRequest: CancelTokenSource | null = null;

export const loadSalespersonList = (filter?: Partial<SalespersonFilter>, view = 'list', active = true): AppThunk =>  {
    return async (dispatch) => {
        dispatch({
            type: TOGGLE_SALESPERSON_LIST_LOADING,
            payload: true
        });

        try {
            cancellableRequest = initAxiosCancelToken(cancellableRequest);

            const url = `${API_URL}/user/salesperson?${`view=${view}`}&isActive=${active ?? true}${filter ? `${filterToParams(filter, true)}` : ''}`;
            const res = await axios.get(url, { cancelToken: cancellableRequest.token });
            if (res.data) {
                dispatch({
                    type: LOAD_SALESPERSON_LIST,
                    payload:  sortBy(res.data, ['firstName', 'lastName'], ['asc', 'asc'])
                })
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            dispatch({
                type: TOGGLE_SALESPERSON_LIST_LOADING,
                payload: false
            });
        }
    }
}

export const loadSalesperson = (id: string): AppThunk =>  {
    return async (dispatch) => {
        dispatch({
            type: TOGGLE_SALESPERSON_DETAILS_LOADING,
            payload: true
        });

        try {
            const fieldsRes = await axios.get(`${API_URL}/basic-module-fields/salesperson`);
            const srRes = await axios.get(`${API_URL}/user/salesperson?id=${id}`);
            if (srRes.status === 200 && fieldsRes.status === 200) {
                dispatch({
                    type: SET_SALESPERSON_STATE,
                    payload: {
                        activeSalespersonDetail: srRes.data[0],
                        fields: fieldsRes.data.assignedFields,
                        sections: fieldsRes.data.sections
                    }
                })
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            dispatch({
                type: TOGGLE_SALESPERSON_DETAILS_LOADING,
                payload: false
            });
        }
    }
}

export const onSalespersonClick = (id: string) : SalespersonAction => {
    return{
        type: SALESPERSON_CLICK,
        payload: id
    }
}

export const updateActiveSalesperson = (input: ActiveSalespersonInput) : SalespersonAction => {
    return{
        type: UPDATE_ACTIVE_SALESPERSON,
        payload: input
    }
}

export const updateSalesperson = (data: Salesperson): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: TOGGLE_SALESPERSON_DETAILS_LOADING,
            payload: true
        });

        try {
            let newSalespersonContactNumberOther : string[] = [];
            map(data.contactNumber.other,(item) => {
                if(item !== " "){
                    newSalespersonContactNumberOther.push(item);
                }
            })
            data.contactNumber.other = newSalespersonContactNumberOther;
            const salespersonData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                contactNumber: data.contactNumber
            }          
            const res = await axios.put(`${API_URL}/user/salesperson/${data.id}`, salespersonData);
            if (res.status === 200 || res.status === 204) {
                let salespersons = getState().salesperson.salespersons;
                const existingSalesperson = find(salespersons,{id: data.id});
                if(existingSalesperson){
                    const updatedSalesperson = {...existingSalesperson, ...salespersonData};
                    const updatedSalespersonIndex = findIndex(salespersons, (s: Salesperson) => s.id === existingSalesperson.id);
                    if( updatedSalespersonIndex > -1){
                        salespersons[updatedSalespersonIndex] = updatedSalesperson;
                        dispatch({
                            type: SET_SALESPERSON_STATE,
                            payload: {salespersons}
                        });
                        dispatch(loadSalesperson(data.id));
                        toastSuccess('Salesperson successfully updated');
                    }
                }
            }
        }
        catch (e) {
            toastError(e.response.data && e.response.data.error ? e.response.data.error.message : 'There was an issue saving the data')
        }
        finally {
            dispatch({
                type: TOGGLE_SALESPERSON_DETAILS_LOADING,
                payload: false
            });
        }
    }
}   

export const createSalesperson = (data: Salesperson): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: TOGGLE_NEW_ACTIVE_SALESPERSON_DETAILS_LOADING,
            payload: true
        });

        try {
            let newSalespersonContactNumberOther : string[] = [];
            for (const item of data.contactNumber.other) {
                if(item !== " "){
                    newSalespersonContactNumberOther.push(item);
                }
            }
            data.contactNumber.other = newSalespersonContactNumberOther;
            const salespersonData = {
                id: '',
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                contactNumber: data.contactNumber,
                isActive: true,
                address: ' ',
                countryId: '',
                countryCode: '',
                organizationId: '',
                password: data.password,
                confirmedPassword: data.password
            }
            const res = await axios.post(`${API_URL}/user/salesperson`, salespersonData);
            if (res.data && (res.status === 200 || res.status === 204)) {
                const newSalesperson = { ...salespersonData, id: res.data.id, displayId: res.data.displayId }
                dispatch({
                    type: SET_SALESPERSON_STATE,
                    payload: { 
                        salespersons: sortBy([...getState().salesperson.salespersons, newSalesperson], ['firstName', 'lastName'], ['asc', 'asc']), 
                        activeSalesperson: newSalesperson.id,
                    }
                });

                dispatch(loadSalesperson(res.data.id))
                toastSuccess('Salesperson successfully created');
            }
        }
        catch (e) {
            console.log(e);
            toastError(e.response.data && e.response.data.error ? e.response.data.error.message : 'There was an issue saving the data')
        }
        finally {
            dispatch({
                type: TOGGLE_NEW_ACTIVE_SALESPERSON_DETAILS_LOADING,
                payload: false
            });
        }
    }
} 

export const setSalespersonState = (data: SalespersonStateInput): SalespersonAction => ({
    type: SET_SALESPERSON_STATE,
    payload: data
});

export const setNewActiveSalespersonDetails = (data: Salesperson): SalespersonAction => ({
    type: SET_NEW_ACTIVE_SALESPERSON_DETAILS,
    payload: data
});

export const upsertSalesperson = (): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_SALESPERSON_STATE,
            payload: { salespersonDetailLoading: true }
        });
        
        try {
            const { activeSalespersonDetail } = getState().salesperson;
            if (activeSalespersonDetail) {
                let data: { [name: string]: DynamicSalesSalespersonInput} = { ...activeSalespersonDetail };
                // remove excess
                delete data.organizationId;
                delete data.organizationCode;
                delete data.countryId;
                delete data.countryCode;

                if (activeSalespersonDetail.avatar && typeof activeSalespersonDetail.avatar.file !== 'undefined') {
                    // do avatar upload
                    const form = new FormData();
                    form.append('media', activeSalespersonDetail.avatar.file)
                    const upRes = await axios.post(`${API_URL}/media/basic/upload/user-avatar`, form);
                    if (upRes.status === 200) {
                        data = { ...data, avatar: upRes.data.avatar }
                    }
                }
                
                if (data.id) {
                    // do update
                    if (data.password) delete data.password;
                    const updateRes = await axios.put(`${API_URL}/user/salesperson/${data.id}`, data);
                    if (updateRes.status === 204) {
                        dispatch(loadSalesperson(data.id as string))
                        toastSuccess("Salesperson detail updated successfully");
                    }
                }
                else {
                    // create new salesperson
                    delete data.id;
                    const createRes = await axios.post(`${API_URL}/user/salesperson`, data);
                    if (createRes.status === 200) {
                        dispatch({
                            type: SET_SYSTEM_STATE,
                            payload: {
                                shallRedirect: true,
                                redirectTo: '/sales/salesperson'
                            } 
                        });
                        toastSuccess("Salesperson created successfully");
                    }
                }
            }
        }
        catch (e) {
            toastError("Something went wrong. Please contact the administrator");
        }
        finally {
            dispatch({
                type: SET_SALESPERSON_STATE,
                payload: { salespersonDetailLoading: false }
            });
        }
    }
}

export const deleteSalesperson = (id: string): AppThunk =>  {
    return async (dispatch) => {
        dispatch({
            type: TOGGLE_SALESPERSON_DETAILS_LOADING,
            payload: true
        });

        try {
            const res = await axios.delete(`${API_URL}/user/salesperson/${id}`);
            if (res.status === 204) {
                dispatch({
                    type: SET_SYSTEM_STATE,
                    payload: {
                        shallRedirect: true,
                        redirectTo: '/sales/salesperson'
                    } 
                });
                toastSuccess("Salesperson deleted successfully");
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            dispatch({
                type: TOGGLE_SALESPERSON_DETAILS_LOADING,
                payload: false
            });
        }
    }
}

export const loadSalesSalespersonModuleFields = (): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_SALESPERSON_STATE,
            payload: { salespersonDetailLoading: true }
        });

        try {
            const fieldsRes = await axios.get(`${API_URL}/basic-module-fields/salesperson`);
            dispatch({
                type: SET_SALESPERSON_STATE,
                payload: { 
                    fields: fieldsRes.data.assignedFields,
                    sections: fieldsRes.data.sections
                }
            });
        }
        catch (e) {
            console.log(e);
            toastError("Something went wrong. Please contact the administrator");
        }
        finally {
            dispatch({
                type: SET_SALESPERSON_STATE,
                payload: { salespersonDetailLoading: false }
            });
        }
    }
}