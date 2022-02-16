import {
    SET_MANAGE_STATE,
    ManageStateInput,
    ManageAction,
} from './types';
import axios from 'axios';
import { AppThunk } from '..';
import { toastSuccess, toastWarning } from '../../modules/Toast';
import filter  from 'lodash/filter';
const API_URL = process.env.REACT_APP_API_URL;

export const setManageState = (state: ManageStateInput): ManageAction => ({
    type: SET_MANAGE_STATE,
    payload: state
});

export const getEntity = (entity: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_MANAGE_STATE,
            payload: { entityLoading: true }
        });

        try {
            const res = await axios.get(`${API_URL}/user/${entity.toUpperCase()}`)

            if (res.status === 200 || res.status === 204) {
                dispatch({
                    type: SET_MANAGE_STATE,
                    payload: { entities: entity === 'vendor' ? filter(res.data, (e) => e.status !== 'Approved') : res.data }
                })
            }
        }
        catch (e) {
            console.log(e);
            toastWarning("Something went wrong, please contact the administrator");
        }
        finally {
            dispatch({
                type: SET_MANAGE_STATE,
                payload: { entityLoading: false }
            });
        }
    }
}

export const loadEntity = (entity: string, id: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_MANAGE_STATE,
            payload: { activeEntityLoading: true }
        });


        try {
            const entityRes = await axios.get(`${API_URL}/user?id=${id}`)
            const rolesRes =  await axios.get(`${API_URL}/role`);

            if (entityRes.status === 200 || entityRes.status === 204) {
                dispatch({
                    type: SET_MANAGE_STATE,
                    payload: { 
                        activeEntity: entityRes.data,
                        activeEntityType: entity,
                        entityRoles: rolesRes.data
                    }
                })
            }
        }
        catch (e) {
            console.log(e);
            toastWarning("Something went wrong, please contact the administrator");
        }
        finally {
            dispatch({
                type: SET_MANAGE_STATE,
                payload: { activeEntityLoading: false }
            });
        }
    }
}

export const updateVendorApproval = (approval: string, id: string, remarks: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_MANAGE_STATE,
            payload: { activeEntityLoading: true }
        });


        try {
            const approvalRes = await axios.put(`${API_URL}/user/vendor/${id}/status`, {
                remarks,
                status: approval === 'Approved' ? 'Approved' : 'Rejected'
            })

            if (approvalRes.status === 200 || approvalRes.status === 204) {
                toastSuccess(`You have successfully ${approval === 'Approved' ? 'approved' : 'disapproved'} the vendor`)
            }
        }
        catch (e) {
            console.log(e);
            toastWarning("Something went wrong, please contact the administrator");
        }
        finally {
            dispatch({
                type: SET_MANAGE_STATE,
                payload: { activeEntityLoading: false }
            });
        }
    }
}