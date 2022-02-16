import {
    SET_ADMINISTRATION_STATE,
    AdministrationStateInput,
    AdministrationAction,
} from './types';
import axios from 'axios';
import { AppThunk } from '..';
import { toastWarning, toastSuccess, toastError } from '../../modules/Toast';
import filter from 'lodash/filter'
import find from 'lodash/find';

const API_URL = process.env.REACT_APP_API_URL;

export const setAdministrationState = (state: AdministrationStateInput): AdministrationAction => ({
    type: SET_ADMINISTRATION_STATE,
    payload: state
});

export const getUsers = (): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_ADMINISTRATION_STATE,
            payload: { userLoading: true }
        });

        try {
            const res = await axios.get(`${API_URL}/user`)
            const rolesRes =  await axios.get(`${API_URL}/role`);
            
            if (res.status === 200 || res.status === 204) {
                dispatch({
                    type: SET_ADMINISTRATION_STATE,
                    payload: { users: res.data, roles: filter(rolesRes.data, (role) => role.name !== 'Vendor' && role.name !== 'Customer' ) }
                })
            }
        }
        catch (e) {
            console.log(e);
            toastWarning("Something went wrong, please contact the administrator");
        }
        finally {
            dispatch({
                type: SET_ADMINISTRATION_STATE,
                payload: { userLoading: false }
            });
        }
    }
}

export const updateUser = (): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_ADMINISTRATION_STATE,
            payload: { userLoading: true }
        });

        try {
            const userAction = getState().administration.userAction;
            const userId = getState().administration.activeUser?.id;
            let userData = getState().administration.activeUser;
            let userList = getState().administration.users;
            let count = 0;
            const userType = find(getState().administration.roles, { id: userData?.roleId });
            let data = {
                ...userData,
                userType: userType ? userType.name.toUpperCase() : '' 
            };

            const validateEmail = (data) => {
                // eslint-disable-next-line
                const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                let isValid = re.test(String(data.email).toLowerCase());
                return isValid;
            };

            const userFieldValidation = (data) => {
                let validData = false;
                if(data.firstName < 0 || data.firstName === '' || data.firstName === undefined) {
                    toastError("First Name is required.");
                } else if(data.lastName < 0 || data.lastName === '' || data.lastName === undefined) {
                    toastError("Last Name is required.");
                } else if(data.email < 0 || data.email === '' || data.firstName === undefined) {
                    toastError("Email is required.");
                } else if(!validateEmail(data)) {
                    toastError("Please use valid email.");
                } else if(data.roleId < 0 || data.roleId === '' || data.roleId === undefined) {
                    toastError("Role is required.");
                } else {
                    validData = true;
                }

                return validData;
            }

            userList.forEach(users => {
                if(users.id !== userData?.id) {
                    if(users.email.toUpperCase() === userData?.email.toUpperCase()) {
                        count++;
                        toastError(`Email already exists.`);
                    }
                }
            });
            
            if(userFieldValidation(data) && count === 0){
                if(userAction === 'Create') {
                    let res = await axios.post(`${API_URL}/user`, data)
                    
                    if (res.status === 200 || res.status === 204) {
                        toastSuccess("User successfully created.");
                        dispatch(getUsers());
                    }
                } else if(userAction === 'Update') {
                    let res = await axios.put(`${API_URL}/user/${userId}`, data)
    
                    if (res.status === 200 || res.status === 204) {
                        toastSuccess("User successfully updated.");
                        dispatch(getUsers());
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
            toastWarning("Something went wrong, please contact the administrator");
        }
        finally {
            dispatch({
                type: SET_ADMINISTRATION_STATE,
                payload: { userLoading: false }
            });
        }
    }
}

export const deleteUser = (): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_ADMINISTRATION_STATE,
            payload: { userLoading: true }
        });

        try {
            const userId = getState().administration.activeUser?.id;

            let res = await axios.delete(`${API_URL}/user/${userId}`)
            
            if (res.status === 200 || res.status === 204) {
                toastSuccess("User successfully deleted.");
                dispatch(getUsers());
            }
        }
        catch (e) {
            console.log(e);
            toastWarning("Something went wrong, please contact the administrator");
        }
        finally {
            dispatch({
                type: SET_ADMINISTRATION_STATE,
                payload: { userLoading: false }
            });
        }
    }
}