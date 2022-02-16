import { 
    SET_CALL_TYPE_SETTINGS_STATE,
    CallTypeSettingsInput,
    CallTypeSettingsAction, 
    Iphone,
    Ipad
} from '../../store/calltypesettings/types';
import axios from 'axios';
import { AppThunk } from '..'
import { toastSuccess, toastError } from '../../modules/Toast';
const API_URL = process.env.REACT_APP_API_URL;

export const setCallTypeState = (state: CallTypeSettingsInput): CallTypeSettingsAction => ({
    type: SET_CALL_TYPE_SETTINGS_STATE,
    payload: state
});

export const loadCallTypeElements = (searchCallType: string, displayScreen: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_CALL_TYPE_SETTINGS_STATE,
            payload: { callTypeElementsLoading: true }
        });
        try {
            let callTypeValue ="";
            if(searchCallType){
                callTypeValue = (searchCallType === "Meeting" ) ? "meeting": "customerProfiling";
            }
            let url = searchCallType ? `${API_URL}/call/settings?device=${displayScreen}&callType=${callTypeValue}` : `${API_URL}/call/settings?device=${displayScreen}`;
            const res = await axios.get(url); 
            if (res.data) {
                dispatch({
                    type: SET_CALL_TYPE_SETTINGS_STATE,
                    payload: res.data
                });
            }
        } 
        catch (e) {
            console.log(e)
            toastError('There was an issue fetching the call elements');
        }
        finally {
            dispatch({
                type: SET_CALL_TYPE_SETTINGS_STATE,
                payload: { callTypeElementsLoading: false }
            });
        }
    }
}

export const loadAllCallTypeElements = (): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_CALL_TYPE_SETTINGS_STATE,
            payload: { callTypeElementsLoading: true }
        });
        try {
            const url =  `${API_URL}/call/settings`;
            const res = await axios.get(url); 
            if (res.data) {
                console.log(res.data);
                dispatch({
                    type: SET_CALL_TYPE_SETTINGS_STATE,
                    payload: res.data
                });
            }
        } 
        catch (e) {
            console.log(e)
            toastError('There was an issue fetching the call elements');
        }
        finally {
            dispatch({
                type: SET_CALL_TYPE_SETTINGS_STATE,
                payload: { callTypeElementsLoading: false }
            });
        }
    }
}
export const updateCallElements = (iphone: Iphone, ipad: Ipad): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_CALL_TYPE_SETTINGS_STATE,
            payload: { callTypeElementsLoading: true }
        });

        try {
            const updateRes = await axios.put(`${API_URL}/call/settings`, {
                iphone: {
                    meeting:{
                        title: iphone.meeting.title,
                        elements: iphone.meeting.elements
                    },
                    customerProfiling: {
                        title: iphone.customerProfiling.title,
                        elements: iphone.customerProfiling.elements
                    }
                },
                ipad: {
                    meeting:{
                        title: ipad.meeting.title,
                        elements: ipad.meeting.elements
                    },
                    customerProfiling: {
                        title: ipad.customerProfiling.title,
                        elements: ipad.customerProfiling.elements
                    }
                }

            });

            if (updateRes.status === 200 || updateRes.status === 204) {
                toastSuccess('Call Type Elements are successfully updated');
            }
        }
        catch (e) {
            console.log(e.response)
            if (e.response.data && e.response.data.error.message) {
                toastError(e.response.data.error.message)
            }
        }
        finally {
            dispatch({
                type: SET_CALL_TYPE_SETTINGS_STATE,
                payload: { callTypeElementsLoading: false }
            });
        }
    }
}   


