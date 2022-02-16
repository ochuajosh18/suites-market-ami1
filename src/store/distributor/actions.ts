import {
    SET_DISTRIBUTOR_STATE,
    DynamicDistributorInput,
    DynamicDistributorType,
    DistributorAction
} from './types';
import { Field } from '../fields/types';
import { SET_SYSTEM_STATE } from '../system/types';
import { AppThunk } from '..';
import { toastSuccess } from '../../modules/Toast';
import { filterToParams, Filter } from '../../utils/filter';
import { mediaFieldUploader } from '../../utils/fields';
import { errorHandler } from '../../utils/validators';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const setDistributorState = (state: DynamicDistributorInput<DynamicDistributorType>): DistributorAction => ({
    type: SET_DISTRIBUTOR_STATE,
    payload: state
});

export const getDistributors = (id?: string, filter?: Partial<Filter>): AppThunk => async (dispatch, getState) => {
    dispatch({
        type: SET_DISTRIBUTOR_STATE,
        payload: { distributorListLoading: true, distributorViewLoading: true }
    });

    try {
        const url = `${API_URL}/v1/distributors${id ? `/${id}` : ''}${filter ? `?${filterToParams(filter)}` : ''}`;
        const distribRes = await axios.get(url);
        if (distribRes.status === 200) {
            // if view
            let fields: Array<Field> = [];
            let sections: Array<string> = [];
            if (id) {
                const fieldsRes = await axios.get(`${API_URL}/basic-module-fields/distributor`);
                if (fieldsRes.status === 200) {
                    fields = fieldsRes.data.assignedFields;
                    sections = fieldsRes.data.sections;
                }
            }
            dispatch({
                type: SET_DISTRIBUTOR_STATE,
                payload: {
                    fields,
                    sections,
                    [id ? 'activeDistributor': 'distributors']: distribRes.data
                }
            });
        }
    }
    catch (e) {
        errorHandler(e);
    }
    finally {
        dispatch({
            type: SET_DISTRIBUTOR_STATE,
            payload: { distributorListLoading: false, distributorViewLoading: false }
        });
    }
}

export const saveDistributor = (): AppThunk => async (dispatch, getState) => {
    dispatch({
        type: SET_DISTRIBUTOR_STATE,
        payload: { distributorViewLoading: true }
    });

    try {
        const { fields, activeDistributor } = getState().distributor;
        if (activeDistributor) {
            let distributorData: DynamicDistributorInput<DynamicDistributorType> = {};
            for (const f of fields) {
                if (f.type === 'Multimedia') {
                    distributorData = await mediaFieldUploader(`${API_URL}/media/basic/upload/customer-logo`, f, activeDistributor, distributorData);
                }
                else {
                    distributorData = { ...distributorData, [f.name]: f.type.toLowerCase().indexOf('number') > -1 ? parseFloat(activeDistributor[f.name] as string) : (activeDistributor[f.name] ? activeDistributor[f.name] : null) }
                }
            }

            if (activeDistributor.id) {
                // do update
                await axios.put(`${API_URL}/v1/distributors/${activeDistributor.id}`, distributorData);
                toastSuccess('Distributor successfully updated');
            }
            else {
                // do create
                await axios.post(`${API_URL}/v1/distributors`, distributorData);
                dispatch({
                    type: SET_SYSTEM_STATE,
                    payload: {
                        redirectTo: '/sales/distributor',
                        shallRedirect: true
                    }
                });
                toastSuccess('Distributor successfully updated');

            }
        }
    }
    catch (e) {
        errorHandler(e);
    }
    finally {
        dispatch({
            type: SET_DISTRIBUTOR_STATE,
            payload: { distributorViewLoading: false }
        });
    }
}

export const loadTaggedCustomers = (distributorId: string): AppThunk => async (dispatch) => {
    dispatch({
        type: SET_DISTRIBUTOR_STATE,
        payload: { activeDistributorCustomerListLoading: true }
    });

    try {
        const cusRes = await axios.get(`${API_URL}/customer?distributorId=${distributorId}`);
        const cusListRes = await axios.get(`${API_URL}/customer?view=detailed&isActive=true`);
        if (cusRes.status === 200 && cusListRes.status === 200) {
            dispatch({
                type: SET_DISTRIBUTOR_STATE,
                payload: { 
                    activeDistributorCustomers: cusRes.data,
                    customerList: cusListRes.data
                }
            });
        }
    }
    catch (e) {
        errorHandler(e);
    }
    finally {
        dispatch({
            type: SET_DISTRIBUTOR_STATE,
            payload: { activeDistributorCustomerListLoading: false }
        });
    }
}

export const tagCustomerToDistributor = (distributorId: string, customerId: string): AppThunk => async (dispatch) => {
    dispatch({
        type: SET_DISTRIBUTOR_STATE,
        payload: { activeDistributorCustomerListLoading: true, activeDistributorModalOpen: false }
    });

    try {
        const cusRes = await axios.put(`${API_URL}/customer/${customerId}`, { distributorId });
        if (cusRes.status === 204) {
            toastSuccess('Customer successully tagged to distributor');
        }
    }
    catch (e) {
        errorHandler(e);
    }
    finally {
        dispatch(loadTaggedCustomers(distributorId));
    }
}

export const deleteDistributor = (distributorId: string): AppThunk => async (dispatch) => {
    dispatch({
        type: SET_DISTRIBUTOR_STATE,
        payload: { distributorViewLoading: true }
    });

    try {
        const cusRes = await axios.delete(`${API_URL}/v1/distributors/${distributorId}`);
        if (cusRes.status === 204) {
            dispatch({
                type: SET_SYSTEM_STATE,
                payload: {
                    redirectTo: '/sales/distributor',
                    shallRedirect: true
                }
            });
            toastSuccess('Distributor successully deleted');
        }
    }
    catch (e) {
        errorHandler(e);
    }
    finally {
        dispatch({
            type: SET_DISTRIBUTOR_STATE,
            payload: { distributorViewLoading: false }
        });
    }
}

export const removeCustomerTag = (customerId: string): AppThunk => async (dispatch, getState) => {
    dispatch({
        type: SET_DISTRIBUTOR_STATE,
        payload: { activeDistributorCustomerListLoading: true }
    });

    try {
        const cusRes = await axios.put(`${API_URL}/customer/${customerId}`, { distributorId: '' });
        if (cusRes.status === 204) {
            toastSuccess('Customer successully removed');
            
        }
    }
    catch (e) {
        errorHandler(e);
    }
    finally {
        dispatch(loadTaggedCustomers(getState().distributor.activeDistributor!.id))
    }
}

export const loadDistributorField = ():  AppThunk => async (dispatch) => {
    dispatch({
        type: SET_DISTRIBUTOR_STATE,
        payload: { distributorViewLoading: true }
    });
    try {
        const fieldsRes = await axios.get(`${API_URL}/basic-module-fields/distributor`);
        if (fieldsRes.status === 200) {
            dispatch({
                type: SET_DISTRIBUTOR_STATE,
                payload: { fields: fieldsRes.data.assignedFields, sections: fieldsRes.data.sections }
            });
        }
    }
    catch (e) {
        errorHandler(e);
    }
    finally {
        dispatch({
            type: SET_DISTRIBUTOR_STATE,
            payload: { distributorViewLoading: false }
        });
    }
}