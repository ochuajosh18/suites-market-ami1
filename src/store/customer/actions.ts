import {
    SET_CUSTOMER_STATE,
    CustomerAction,
    CustomerStateInput,
    DynamicBasicCustomerInput
} from './types';
import { SET_SALESPERSON_STATE } from '../salesperson/types';
import { SET_SYSTEM_STATE } from '../system/types';
import { toastSuccess, toastError, toastWarning } from '../../modules/Toast';
import { AppThunk } from '..'
import { filterToParams, Filter } from '../../utils/filter';
import { mediaFieldUploader, reverseGeocode } from '../../utils/fields';
import { initAxiosCancelToken } from '../../utils/validators';
import axios, { CancelTokenSource} from 'axios';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import find from 'lodash/find';
const API_URL = process.env.REACT_APP_API_URL;
let cancellableRequest: CancelTokenSource | null = null;

export const setCustomerState = (data: CustomerStateInput): CustomerAction => ({
    type: SET_CUSTOMER_STATE,
    payload: data
});

export const deleteContact = (contactId: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_CUSTOMER_STATE,
            payload: { contactLoading: true, customerListLoading: true }
        });

        try {
            const deleteRes = await axios.delete(`${API_URL}/customer-contact/${contactId}`)
            if (deleteRes.status === 200 || deleteRes.status === 204) {
                await new Promise(resolve => setTimeout(resolve, 100));
                const { activeCustomerId, activeCustomer } = getState().customer;
                dispatch(getSalesCustomerContacts(activeCustomer && activeCustomer.id ? activeCustomer.id : activeCustomerId));
                toastSuccess("Contact successfully deleted");
            }
        }
        catch (e) {
            console.log(e);
            toastError(e.response.data && e.response.data.error ? e.response.data.error.message : 'There was an issue deleting the data')
        }
        finally {
            dispatch({
                type: SET_CUSTOMER_STATE,
                payload: { contactLoading: false, customerListLoading: false, customerViewActiveTab: 'Contact Information' }
            });
        }
    }
}

export const loadCustomerContactFields = (isCreateNewContact: boolean): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_CUSTOMER_STATE,
            payload: { customerViewLoading: true }
        });

        try {
             // load fields
             const res = await axios.get(`${API_URL}/basic-module-fields/customer_contact`)
             const createNewContact = (isCreateNewContact)? true: false;
             //console.log(res.data);
             if (res.status === 200) {
                dispatch({
                    type: SET_CUSTOMER_STATE,
                    payload: { 
                       activeContactFields: filter(sortBy(res.data, ['section', 'row'], ['asc', 'asc']), (field) => field.type !== 'View'),
                       activeContact: {
                            id: '',
                            name: '',
                            isPrimary: '',
                            email: '',
                            avatar: '',
                            position: '',
                            address: '',
                            note: '',
                        },
                        showContactForm: createNewContact
                    }
                    
                })
             }
        }
        catch (e) {
            console.log(e)
            toastError('There was an issue fetching the contacts fields');
        }
        finally {
            dispatch({
                type: SET_CUSTOMER_STATE,
                payload: { customerViewLoading: false }
            });
        }
    }
}

// revamped process
export const getSalesCustomer = (active = true, filter?: Partial<Filter>, id?: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_CUSTOMER_STATE,
            payload: { customerListLoading: true, customerViewLoading: true, activeCustomer: undefined}
        });

        try {
            if (id) {
                // return single customer
                cancellableRequest = initAxiosCancelToken(cancellableRequest);
                const cusRes = await axios.get(`${API_URL}/customer?id=${id}`, { cancelToken: cancellableRequest.token });
                const fieldsRes = await axios.get(`${API_URL}/basic-module-fields/customer`, { cancelToken: cancellableRequest.token });
                const contactFieldsRes = await axios.get(`${API_URL}/basic-module-fields/customer_contact`, { cancelToken: cancellableRequest.token });
                if (cusRes.status === 200) {
                    const srRes = await axios.get(`${API_URL}/user/salesperson?view=list`);
                    if (srRes.status === 200) {
                        dispatch({
                            type: SET_CUSTOMER_STATE,
                            payload: { 
                                activeCustomer: cusRes.data[0],
                                fields: fieldsRes.data.assignedFields,
                                sections: fieldsRes.data.sections,
                                contactFields: contactFieldsRes.data.assignedFields,
                                contactSections: contactFieldsRes.data.sections
                            }
                        });
                        dispatch({
                            type: SET_SALESPERSON_STATE,
                            payload: { salespersons: srRes.data }
                        });
                    }
                }
            }
            else {
                // return list of customers in view=list
                const cusRes = await axios.get(`${API_URL}/customer?view=list&isActive=${active}${filter ? filterToParams(filter, true) : ''}`);
                const srRes = await axios.get(`${API_URL}/user/salesperson`);
                if (cusRes.status === 200) {
                    dispatch({
                        type: SET_CUSTOMER_STATE,
                        payload: { customerList: cusRes.data }
                    });
                    dispatch({
                        type: SET_SALESPERSON_STATE,
                        payload: { salespersons: srRes.data }
                    });
                }
            }
        }
        catch (e) {
            
        }
        finally {
            dispatch({
                type: SET_CUSTOMER_STATE,
                payload: { customerListLoading: false, customerViewLoading: false }
            });
        }
    }
}
export const uploadLogo = (file: File): AppThunk => {
    return async (dispatch, getState) => {
        const { activeCustomer } = getState().customer;
        if (activeCustomer) {
            dispatch({
                type: SET_CUSTOMER_STATE,
                payload: { 
                    activeCustomer: {
                        ...activeCustomer,
                        logo: {
                            loading: true,
                            name: file.name,
                            path: '',
                            type: file.type,
                            size: file.size / 1000000, // convert Bytes to MB
                        },
                    }
                }
            });

            // upload media then update local
            try {
                const mediaForm = new FormData();
                mediaForm.append('media', file);
                const upRes = await axios.post(`${API_URL}/media/basic/upload/customer-logo`, mediaForm); 
                if (upRes.status === 200) {
                    dispatch({
                        type: SET_CUSTOMER_STATE,
                        payload: { 
                            activeCustomer: { 
                                ...activeCustomer,
                                logo: upRes.data.logo
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

// save sales customer
export const saveSalesCustomer = (): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_CUSTOMER_STATE,
            payload: { customerViewLoading: true }
        });

        const { activeCustomer, activeContact } = getState().customer;
        if (activeCustomer) {
            try {
                const sr = find(getState().salesperson.salespersons, { id: activeCustomer.salespersonId });
                let data: { [name: string]: string | [number, number] | number | boolean | undefined | object } = {
                   name: activeCustomer.name,
                   isActive: activeCustomer.isActive,
                   salespersonId: activeCustomer.salespersonId,
                   email: activeCustomer.email,
                   contactNumber: activeCustomer.contactNumber,
                   logo: activeCustomer.logo,
                   gps: activeCustomer.gps,
                   salespersonDisplayId: sr ? sr.displayId : activeCustomer.salespersonId
                };

                // update using module fields
                for (const field of getState().customer.fields) {
                    if (typeof activeCustomer[field.name] !== 'undefined') {
                        if (field.type === 'Image' || field.type === 'Multimedia') {
                            // do upload
                            data = await mediaFieldUploader(`${API_URL}/media/basic/upload/customer-logo`, field, activeCustomer, data);
                        }
                        else if (field.type === 'Geolocation') {
                            data = await reverseGeocode(field, activeCustomer);
                        }
                        else {
                            data = { ...data, [field.name]: field.type.toLowerCase().indexOf('number') > -1 ? parseInt(activeCustomer[field.name] as string) : activeCustomer[field.name] }
                        }
                    }
                }

                if (typeof activeCustomer.id !== 'undefined') {
                    // simple customer update
                    const updateRes = await axios.put(`${API_URL}/customer/${activeCustomer.id}`, data);
                    if (updateRes.status === 200 || updateRes.status === 204) {
                        toastSuccess('Customer successfully updated');
                        dispatch(getSalesCustomer(activeCustomer.isActive, {}, activeCustomer.id));
                    }
                }
                else {
                    // new customer with contact
                    if (activeContact) {
                        let contactData: { [name: string]: DynamicBasicCustomerInput } = { };
                        for (const field of getState().customer.contactFields) {
                            if ((field.type === 'Image' || field.type === 'Multimedia')) {
                                // do upload
                                contactData = await mediaFieldUploader(`${API_URL}/media/basic/upload/user-avatar`, field, activeContact, contactData);
                            }
                            else if (field.type === 'Geolocation') {
                                data = await reverseGeocode(field, activeCustomer);
                            }
                            else {
                                contactData = { ...contactData, [field.name]: field.type.toLowerCase().indexOf('number') > -1 ? parseInt(activeContact[field.name]) : activeContact[field.name] }
                            }
                        }
                        
                        data = { ...data, contact: contactData }; // update post data
                    }

                    const saveRes = await axios.post(`${API_URL}/customer`, data);
                    if (saveRes.status === 200 || saveRes.status === 204) {
                        dispatch({
                            type: SET_SYSTEM_STATE,
                            payload: {
                                shallRedirect: true,
                                redirectTo: '/sales/customer'
                            } 
                        });
                        toastSuccess('Customer successfully created');
                    }
                }
            }
            catch (e) {
                console.log(e.response)
                if (e.message) {
                    toastWarning(e.message);
                }
                else {
                    toastError("Something went wrong. Please contact the administrator");
                }
            }
            finally {
                dispatch({
                    type: SET_CUSTOMER_STATE,
                    payload: { customerViewLoading: false }
                });
            }
        }
    }
}   

export const deleteSalesCustomer = (customerId: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_CUSTOMER_STATE,
            payload: { customerViewLoading: true }
        });

        try {
            const deleteRes = await axios.delete(`${API_URL}/customer/${customerId}`)
            if (deleteRes.status === 200 || deleteRes.status === 204) {
                dispatch({
                    type: SET_SYSTEM_STATE,
                    payload: {
                        shallRedirect: true,
                        redirectTo: '/sales/customer'
                    } 
                });
                toastSuccess("Customer successfully deleted");
            }
        }
        catch (e) {
            console.log(e);
            toastError(e.response.data && e.response.data.error ? e.response.data.error.message : 'There was an issue deleting the data')
        }
        finally {
            dispatch({
                type: SET_CUSTOMER_STATE,
                payload: { customerViewLoading: false }
            });
        }
    }
}

export const getSalesCustomerContacts = (id: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_CUSTOMER_STATE,
            payload: { customerContactLoading: true, activeContact: undefined }
        });

        try {
            const contactRes = await axios.get(`${API_URL}/customer-contact?id=${id}`);
            if (contactRes.status === 200) {
                dispatch({
                    type: SET_CUSTOMER_STATE,
                    payload: { customerContacts: contactRes.data }
                });
            }
        }
        catch (e) {

        }
        finally {
            dispatch({
                type: SET_CUSTOMER_STATE,
                payload: { customerContactLoading: false }
            });
        }
    }
}


// save sales customer
export const saveSalesCustomerContact = (): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_CUSTOMER_STATE,
            payload: { customerContactLoading: true }
        });

        const { activeContact, activeCustomer } = getState().customer;
        if (activeContact && activeCustomer) {
            try {
                let data: { [name: string]: DynamicBasicCustomerInput } = {
                   name: activeContact.name,
                   position: activeContact.position,
                   email: activeContact.email,
                   phoneNumber: activeContact.phoneNumber,
                   note: activeContact.notes,
                   notes: activeContact.notes,
                   isPrimary: activeContact.isPrimary
                };

                for (const field of getState().customer.contactFields) {
                    if ((field.type === 'Image' || field.type === 'Multimedia')) {
                        // do upload
                        data = await mediaFieldUploader(`${API_URL}/media/basic/upload/user-avatar`, field, activeContact, data);
                    }
                    else if (field.type === 'Geolocation') {
                        data = await reverseGeocode(field, activeCustomer);
                    }
                    else {
                        data = { 
                            ...data, 
                            [field.name]: field.type.toLowerCase().indexOf('number') > -1 && !['phonenumber', 'contactnumber'].includes(field.name.toLowerCase()) ? parseInt(activeContact[field.name]) : activeContact[field.name] 
                        }
                    }
                }

                if (activeContact.id.length > 0) {
                    // simple update
                    let updateRes = await axios.put(`${API_URL}/customer-contact/${activeContact.id}`, data);
                    if (updateRes.status === 200 || updateRes.status === 204) {
                        toastSuccess('Contact successfully updated');
                    }
                }
                else {
                    delete data.id; // remove id property from post data
                    // create new contact
                    let saveRes = await axios.post(`${API_URL}/customer-contact`, { 
                            ...data, 
                            customerId: activeCustomer.id, 
                            salespersonId: activeCustomer.salespersonId
                        }
                    );

                    if (saveRes.status === 200 || saveRes.status === 204) {
                        toastSuccess('Contact successfully created');
                    }
                }
                
                if (activeCustomer.id) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    dispatch(getSalesCustomerContacts(activeCustomer.id))
                }
            }
            catch (e) {
                if (e.message) {
                    toastWarning(e.message);
                }
                else {
                    toastError("Something went wrong. Please contact the administrator");
                }
            }
            finally {
                dispatch({
                    type: SET_CUSTOMER_STATE,
                    payload: { customerContactLoading: false }
                });
            }
        }
    }
}   

// save sales customer
export const loadSalesCustomerModuleFields = (): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_CUSTOMER_STATE,
            payload: { customerViewLoading: true }
        });

        try {
            const fieldsRes = await axios.get(`${API_URL}/basic-module-fields/customer`);
            const contactFieldsRes = await axios.get(`${API_URL}/basic-module-fields/customer_contact`);
            dispatch({
                type: SET_CUSTOMER_STATE,
                payload: { 
                    fields: fieldsRes.data.assignedFields,
                    sections: fieldsRes.data.sections,
                    contactFields: contactFieldsRes.data.assignedFields,
                    contactSections: contactFieldsRes.data.sections
                }
            });
        }
        catch (e) {
            console.log(e)
        }
        finally {
            dispatch({
                type: SET_CUSTOMER_STATE,
                payload: { customerViewLoading: false }
            });
        }
    }
}