import axios from 'axios';
import { 
    AccessibilityAction,
    AccessibilityInput,
    SET_ACCESSIBILITY_STATE
} from './types';
import { SET_SYSTEM_STATE } from '../system/types';
import { AppThunk } from '..';
import { toastSuccess } from '../../modules/Toast'
import map from 'lodash/map';
const API_URL = process.env.REACT_APP_API_URL;

export const setAccessibilityState = (input: AccessibilityInput) : AccessibilityAction => {
    return {
        type: SET_ACCESSIBILITY_STATE,
        payload: input
    }
}

export const getUserRoles = (): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_ACCESSIBILITY_STATE,
            payload: { 
                activePlatform: getState().system.userType === 'Basic' ? 'Symphony Sales' : 'Symphony Market',
                userRoles: []
            }
        })
        try {
            const roleRes = await axios.get(`${API_URL}/role?withDefaultRoles=true`);
            if (roleRes.status === 200) {
                dispatch({
                    type: SET_ACCESSIBILITY_STATE,
                    payload: { userRoles: roleRes.data }
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    } 
}



export const getUserRole = (id: string): AppThunk => {
    return async (dispatch, getState) => {
        const { userType } =  getState().system;
        // const marketAmiModules = [ 'Product Management', 'Reviews', 'Order Management', 'Promo Banner', 'Category Management', 'Library' ];
        // const salesAmiModules = [ 'Product Management', 'Customer Management', 'Salesperson Management', 'Product Promotion', 'News', 'Application Settings', 'Fields Management', 'User Management' ];
        // const marketAppModules = [ 'Categories', 'Favorites', 'Shopping Bag', 'My Account' ];
        // const salesAppModules = [ 'Home', 'Order', 'Cart', 'Menu', 'News', 'Application Settings' ];
        const amiModulesListRes = await axios.get(`${API_URL}/v1/module-list/${userType === 'Basic' ? 'sales' : 'market'}/ami`);
        const appModulesListRes = await axios.get(`${API_URL}/v1/module-list/${userType === 'Basic' ? 'sales' : 'market'}/mobile`);

        const modules =  map(amiModulesListRes.data.modules, (m) => m.title);
        dispatch({
            type: SET_ACCESSIBILITY_STATE,
            payload: { 
                activePlatform: userType === 'Basic' ? 'Symphony Sales' : 'Symphony Market',
                amiModules: modules,
                appModules: map(appModulesListRes.data.modules, (m) => m.title),
                userRoles: []
            }
        });
        try {
            const roleRes = await axios.get(`${API_URL}/role/${id}`);
            if (roleRes.status === 200) {
                let moduleCheckbox: Array<string> = [];
                for (const m of modules) {
                    let ctr = 0;
                    const moduleComparator = m.toUpperCase().replace(/ +/g, '_');
                    if (typeof roleRes.data['amiAccess'] !== 'undefined') {
                        for (const c of roleRes.data['amiAccess']) {
                            if (c.indexOf(moduleComparator) > -1 && typeof c[c.indexOf(moduleComparator) + moduleComparator.length + 1] === 'undefined') {
                                ctr+=1;
                            }
                        }
                    }

                    if (ctr > 3) {
                        moduleCheckbox = [ ...moduleCheckbox, m ]
                    }
                }

                dispatch({
                    type: SET_ACCESSIBILITY_STATE,
                    payload: { 
                        activeEditUserRole: roleRes.data,
                        activeModuleCheckbox: moduleCheckbox.length === modules.length ? [ ...moduleCheckbox, 'ALL' ] : moduleCheckbox
                    }
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    } 
}

export const upsertUserRole = (): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_ACCESSIBILITY_STATE,
            payload: { roleLoading: true }
        })
        try {
            const { activeEditUserRole } = getState().accessibility;
            if (activeEditUserRole) {
                if (activeEditUserRole.id) {
                    if (activeEditUserRole.countryCode) delete activeEditUserRole.countryCode;
                    if (activeEditUserRole.organizationId) delete activeEditUserRole.organizationId;
                    const roleRes = await axios.put(`${API_URL}/role/${activeEditUserRole.id}`, activeEditUserRole);
                    if (roleRes.status === 204) {
                        dispatch({
                            type: SET_SYSTEM_STATE,
                            payload: {
                                shallRedirect: true,
                                redirectTo: '/symphony/roles'
                            }
                        });
                        toastSuccess('Role successfully updated');
                    }
                }
                else {
                    // add new role
                    const roleRes = await axios.post(`${API_URL}/role`, activeEditUserRole);
                    if (roleRes.status === 200) {
                        dispatch({
                            type: SET_SYSTEM_STATE,
                            payload: {
                                shallRedirect: true,
                                redirectTo: '/symphony/roles'
                            }
                        });
                        toastSuccess('Role successfully created');
                    }
                }
            }
        } catch (e) {
            console.log(e);
        } finally {
            dispatch({
                type: SET_ACCESSIBILITY_STATE,
                payload: { roleLoading: false }
            })
        }
    }
}

export const loadModules = (): AppThunk => async (dispatch, getState) => {
    dispatch({
        type: SET_ACCESSIBILITY_STATE,
        payload: { 
            roleLoading: true
        }
    });
    try {
        const userType = getState().system.userType;
        const amiModulesListRes = await axios.get(`${API_URL}/v1/module-list/${userType === 'Basic' ? 'sales' : 'market'}/ami`);
        const appModulesListRes = await axios.get(`${API_URL}/v1/module-list/${userType === 'Basic' ? 'sales' : 'market'}/mobile`);
        const modules =  map(amiModulesListRes.data.modules, (m) => m.title);
        dispatch({
            type: SET_ACCESSIBILITY_STATE,
            payload: { 
                activePlatform: userType === 'Basic' ? 'Symphony Sales' : 'Symphony Market',
                amiModules: modules,
                appModules: map(appModulesListRes.data.modules, (m) => m.title),
                userRoles: []
            }
        });
    }
    catch (e) {
        console.log(e)
    }
    finally {
        dispatch({
            type: SET_ACCESSIBILITY_STATE,
            payload: { 
                roleLoading: false
            }
        });
    }
}