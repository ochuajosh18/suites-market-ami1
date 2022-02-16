import {
    UserManagementAction,
    UserManagementStateInput,
    SET_USERMANAGEMENT_STATE,
    LOAD_VENDOR_LIST,
    LOAD_VENDOR_DETAILS,
    LOAD_CUSTOMER_LIST,
    LOAD_CUSTOMER_DETAILS,
    LOAD_ROLE_LIST,
    Vendor,
    UserManagementFilter
} from './types';
import { AppThunk } from '..';
import axios from 'axios';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import { toastError, toastSuccess } from '../../modules/Toast';
import find from 'lodash/find';
// import orderBy from 'lodash/orderBy';
import moment from 'moment';
const API_URL = process.env.REACT_APP_API_URL;

const generateFilter = (filter: Partial<UserManagementFilter>): string => {
    let queryParams = '';
    if(filter) {
        const af = Object.keys(filter);
        if (af.length > 0) {
            for (const f in af) {
                if (filter[af[f]]) {
                    // do simple string build
                    if (af[f].toLowerCase().indexOf('date') > -1) {
                        queryParams += `${af[f]}=${moment(filter[af[f]], 'DD/MM/YYYY').format()}&`;
                    }
                    else {
                        queryParams += `${af[f]}=${filter[af[f]]}&`;
                    }
                }
            }
            queryParams = queryParams.substr(0, queryParams.length - 1);
        }
    }
    // end query builder
    return queryParams;
}

export const loadVendorList = (searchString?: string, status = "Approved", filter?: Partial<UserManagementFilter>): AppThunk =>  {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: { userListLoading: true, vendors: [], search: searchString ? searchString : getState().usermanagement.search }
        });

        try {
            const url = `${API_URL}/user/VENDOR?status=${status}${searchString ? `&search=${searchString}` : ""}${filter ? `&${generateFilter(filter)}` : ''}`;
            const res = await axios.get(url);
            if (res.data) {
                dispatch({
                    type: LOAD_VENDOR_LIST,
                    payload: res.data
                })
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            dispatch({
                type: SET_USERMANAGEMENT_STATE,
                payload: { userListLoading: false }
            });    
        }
    }
}

export const loadVendor = (id: string): AppThunk =>  {
    return async (dispatch) => {
        dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: { userDetailLoading: true }
        });

        try {
            const res = await axios.get(`${API_URL}/user?id=${id}`);
            if (res.data && res.data) {
                dispatch({
                    type: LOAD_VENDOR_DETAILS,
                    payload: res.data
                })
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            dispatch({
                type: SET_USERMANAGEMENT_STATE,
            payload: { userDetailLoading: false }
            });
        }
    }
}

export const loadCustomerList = (searchString?: string, filter?: Partial<UserManagementFilter>): AppThunk =>  {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: { userListLoading: true, customers: [], search: searchString ? searchString : getState().usermanagement.search }
        });

        try {
            const url = `${API_URL}/user/CUSTOMER${searchString ? `?search=${searchString}` : ""}${filter ? `${searchString ? '&' : '?'}${generateFilter(filter)}` : ''}`;
            const res = await axios.get(url);
            if (res.data) {
                dispatch({
                    type: LOAD_CUSTOMER_LIST,
                    payload: res.data
                })
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            dispatch({
                type: SET_USERMANAGEMENT_STATE,
                payload: { userListLoading: false }
            });
        }
    }
}

export const loadCustomer = (id: string): AppThunk =>  {
    return async (dispatch) => {
        dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: { userDetailLoading: true }
        });

        try {
            const res = await axios.get(`${API_URL}/user?id=${id}`);
            if (res.data && res.data) {
                dispatch({
                    type: LOAD_CUSTOMER_DETAILS,
                    payload: res.data
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}

export const loadCustomerAddress = (id: string): AppThunk =>  {
    return async (dispatch) => {
        try {
            const res = await axios.get(`${API_URL}/user/address/getAddress/${id}`);
            const address = sortBy(res.data, ['dateCreated'], ['desc'])
            if (res.data && res.data) {
                dispatch({
                    type: SET_USERMANAGEMENT_STATE,
                    payload: {
                        customerHomeAddress: address.find(x => x.tag === "Home"),
                        customerOfficeAddress: address.find(x => x.tag === "Office")
                    }
                })
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            dispatch({
                type: SET_USERMANAGEMENT_STATE,
                payload: { userDetailLoading: false }
            });
        }
    }
}

export const updateVendorStatus = (status: string, remarks: string, vendor: Vendor): AppThunk =>  {
    return async (dispatch) => {
        dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: { statusLoading: true }
        });
        try {
            const result = await axios.put(
                `${API_URL}/user/vendor/${vendor.id}/status`, 
                { status, remarks }
            );
            if(result.status === 204) {
                toastSuccess(`Vendor Successfully ${status === 'Approved' ? 'Approved' : "Disapproved"}.`)
                dispatch({
                    type: SET_USERMANAGEMENT_STATE,
                    payload: { 
                        vendorDetails: {
                            ...vendor,
                            status,
                            remarks
                        } 
                    }
                });
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            dispatch({
                type: SET_USERMANAGEMENT_STATE,
                payload: { statusLoading: false }
            });
        }
    }
}

export const loadRoleList = (searchString?: string): AppThunk =>  {
    return async (dispatch) => {
        dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: { userListLoading: true, roles: [] }
        });

        try {
            const url = `${API_URL}/role?withDefaultRoles=true${searchString ? `&keyword=${searchString}` : ''}`;
            const res = await axios.get(url);
            if (res.data) {
                dispatch({
                    type: LOAD_ROLE_LIST,
                    payload: res.data
                })
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            dispatch({
                type: SET_USERMANAGEMENT_STATE,
                payload: { userListLoading: false }
            });    
        }
    }
}

export const saveRole = (id: string, name: string, description: string): AppThunk =>  {
    return async (dispatch) => {
        dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: { statusLoading: true }
        });
        try {
            if(id) {
                const updateResult = await axios.put(`${API_URL}/role/${id}`, {name, description});
                updateResult.status === 204 && toastSuccess(`Role successfully updated.`)
            } else {
                const addResult = await axios.post(`${API_URL}/role`, {
                    name, description, 
                    amiAccess: [],
                    appAccess: []
                });
                addResult.status === 200 && toastSuccess(`Role successfully added.`)
            }
            dispatch({
                type: SET_USERMANAGEMENT_STATE,
                payload: { 
                    modalVisible: false, 
                    selectedRoleId: "",
                    selectedRoleName: "",
                    selectedRoleDescription: ""
                }
            })
            await new Promise(resolve => setTimeout(resolve, 200));
            dispatch(loadRoleList(''))
        }
        catch (e) {
            console.log(e);
        }
        finally {
            dispatch({
                type: SET_USERMANAGEMENT_STATE,
                payload: { statusLoading: false }
            });
        }
    }
}

export const deleteRole = (id: string): AppThunk =>  {
    return async (dispatch) => {
        dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: { statusLoading: true }
        });
        try {
            if(id === 'ROLE::VENDOR' || id === 'ROLE::CUSTOMER') {
                toastError("Cannot delete default vendor and customer role")
            } else {
                const result = await axios.delete(`${API_URL}/role/${id}`);
                if (result.status === 204) {
                    await new Promise(resolve => setTimeout(resolve, 200));

                    toastSuccess("Role deleted successfully");
                    dispatch(loadRoleList(''))
                    dispatch({
                        type: SET_USERMANAGEMENT_STATE,
                        payload: { 
                            deleteModalVisible: false,
                            selectedRoleId: "",
                            selectedRoleName: "",
                            selectedRoleDescription: ""
                        }
                    });
                }
            }
        }
        catch (e) {
            if(e.response.data.error.message === "Delete Role: Cannot delete role. Role is tagged to user account/s") {
                toastError("Cannot delete role. Role is tagged to user account/s.")
            }
            console.log(e);
        }
        finally {
            dispatch({
                type: SET_USERMANAGEMENT_STATE,
                payload: { statusLoading: false }
            });
        }
    }
}

export const setUserManagementState = (data: UserManagementStateInput): UserManagementAction => ({
    type: SET_USERMANAGEMENT_STATE,
    payload: data
});

export const getRoles = () : AppThunk => {
    return async (dispatch, getState) => {
        try {
            const roles = await axios.get(`${API_URL}/role`);
            if (roles.status === 200) {
                dispatch({
                    type: SET_USERMANAGEMENT_STATE,
                    payload: {
                        userRoles: filter(roles.data, (role) => role.name !== 'Admin')
                    }
                })
            }
        } catch (e) {
            console.log(e);
            toastError(e.toString());
        }
    }
}

export const getUsers = (active: boolean, search?: string, filters?: Partial<UserManagementFilter>) : AppThunk => {
    return async (dispatch, getState) => {
        dispatch({ 
            type: SET_USERMANAGEMENT_STATE, 
            payload: { userListLoading : true, search: search ? search : getState().usermanagement.search }
        });
        try {
            const users = await axios.get(`${API_URL}/user?isActive=${active}${search ? `&search=${search}` : ''}${filters ? `&${generateFilter(filters)}` : ''}`);
            if (users.status === 200) {
                dispatch({
                    type: SET_USERMANAGEMENT_STATE,
                    payload: {
                        userAccounts: users.data
                    }
                })
            }
        } catch (e) {
            console.log(e);
            toastError(e.toString());
        } finally {
            dispatch({ type: SET_USERMANAGEMENT_STATE, payload: { userListLoading : false }})
        }
    }
}

export const addUserAccount = () : AppThunk => {
    return async (dispatch, getState) => {
        dispatch({ type: SET_USERMANAGEMENT_STATE, payload: { userAccountSaveLoading: true }});
        try {
            const { activeUser, userRoles, userAccountTab } = getState().usermanagement;
            if (activeUser) {
                const { firstName, lastName, email, role, status} = activeUser;
                const activeRole = find(userRoles, { name: activeUser.role });
                if (activeRole) {
                    const body : { firstName: string, lastName: string, email: string, roleId?: string, userType: string, isActive: boolean } = {
                        firstName,
                        lastName,
                        email,
                        roleId: activeRole?.id,
                        userType: role,
                        isActive: status === 'Active' ? true : false
                    }
                    const addRes = await axios.post(`${API_URL}/user`, body);
                    if (addRes.status === 200) {
                        toastSuccess('User successfully created');
                        dispatch({ type: SET_USERMANAGEMENT_STATE, payload: { userAccountNewUserDialogIsOpen : false }})
                        dispatch(getUsers(userAccountTab === 'Active'));
                    }
                }
            }
        } catch (e) {
            console.log(e);
            toastError(e.toString());
        } finally {
            dispatch({ type: SET_USERMANAGEMENT_STATE, payload: { userAccountSaveLoading: false }});
        }
    }
}

export const deleteUserAccount = (userId: string) : AppThunk => {
    return async (dispatch, getState) => {
        const { userAccountTab } = getState().usermanagement;
        try {
            const delRes = await axios.delete(`${API_URL}/user/deleteUser/${userId}`)
            if (delRes.status === 204) {
                toastSuccess('User successfully deleted');
                dispatch(getUsers(userAccountTab === 'Active'));
            }
        } 
        catch (e) {
            console.log(e);
            toastError(e.toString());
        }
    }
}

export const updateUserAccount = () : AppThunk => {
    return async (dispatch, getState) => {
        const { activeUser, userRoles, userAccountTab } = getState().usermanagement;
        try {
            if (activeUser) {
                const { firstName, lastName, email, role, status} = activeUser;
                const activeRole = find(userRoles, { name: activeUser.role });
                console.log(activeRole)
                if (activeRole) {
                    const body : { firstName: string, lastName: string, email: string, roleId?: string, userType: string, isActive: boolean } = {
                        firstName,
                        lastName,
                        email,
                        roleId: activeRole?.id,
                        userType: role,
                        isActive: status === 'Active' ? true : false
                    }
                    console.log(body)
                    const upRes = await axios.put(`${API_URL}/user/${activeUser.id}`, body)
                    if (upRes.status === 204) {
                        toastSuccess('User successfully updated');
                        dispatch({ type: SET_USERMANAGEMENT_STATE, payload: { userAccountNewUserDialogIsOpen : false }})
                        dispatch(getUsers(userAccountTab === 'Active'));
                    }
                }
            }
        } catch (e) {
            console.log(e);
            toastError(e.toString());
        }
    }
}

export const searchUser = (keyWord: string) : AppThunk => {
    return async (dispatch, getState) => {
        try {
            const { userAccountTab } = getState().usermanagement;
            if (userAccountTab === 'Active') {
                const users = await axios.get(`${API_URL}/user?isActive=true&search=${keyWord}`);
                if (users.status === 200) {
                    dispatch({
                        type: SET_USERMANAGEMENT_STATE,
                        payload: {
                            userAccounts: users.data
                        }
                    })
                }
            } else if (userAccountTab === 'Inactive') {
                const users = await axios.get(`${API_URL}/user?isActive=false&search=${keyWord}`);
                if (users.status === 200) {
                    dispatch({
                        type: SET_USERMANAGEMENT_STATE,
                        payload: {
                            userAccounts: users.data
                        }
                    })
                }
            }
        } catch (e) {
            console.log(e);
            toastError(e.toString());
        }
    }
}