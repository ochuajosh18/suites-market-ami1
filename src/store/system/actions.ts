import {
    SET_SESSION,
    SET_HEADER_TEXT,
    SELECT_SIDEBAR_TAB,
    SET_HEADER_END_BUTTON,
    SET_INTERCEPTOR,
    Session,
    SystemAction,
    HeaderEndButton,
    SystemStateInput,
    SET_SYSTEM_STATE,
} from './types';
import { RESET_STATE, SET_LOGIN_STATE } from '../login/types';
import { AppThunk } from '..';
import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { toastWarning } from '../../modules/Toast';
import { resetLoginState } from '../login/actions';
const API_URL = process.env.REACT_APP_API_URL;

export function setSession(session: Session): SystemAction {
    return {
        type: SET_SESSION,
        payload: session,
    };
}

export function setSystemState(state: SystemStateInput): SystemAction {
    return {
        type: SET_SYSTEM_STATE,
        payload: state,
    };
}

export function setHeaderText(mainText: string, subText: string): SystemAction {
    return {
        type: SET_HEADER_TEXT,
        payload: { mainText, subText },
    };
}

export function selectSidebarTab(value: string): SystemAction {
    return { type: SELECT_SIDEBAR_TAB, payload: value };
}

export const setHeaderEndButton = (buttonDetails: HeaderEndButton | JSX.Element | JSX.Element[] | undefined): SystemAction => {
    return {
        type: SET_HEADER_END_BUTTON,
        payload: buttonDetails
    }
}

export const setInterceptor = (updatedToken?: string): AppThunk => {
    return async (dispatch, getState) => {
        const { system, login } = getState();
        const reqInterceptor = axios.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                const { session } = system;
                if (session && !updatedToken) {
                    config.headers['Authorization'] = `Bearer ${session.token}`;
                    return config;
                }

                config.headers['Authorization'] = `Bearer ${updatedToken}`;
                return config;
            }
        );
    
        const resInterceptor = axios.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            async (error: AxiosError) => {
                const origReq: any = error.config;
                const { session } = getState().system;
                if (error.response?.status === 401 && origReq.url === `${API_URL}/user/requestAccessToken`) {
                    dispatch({
                        type: RESET_STATE,
                        payload: {}
                    });
                    return Promise.reject(error);
                }
    
                if (error.response?.status === 401 && !origReq.retry && session) {
                    origReq.retry = true;
                    const instance = axios.create({
                        headers: {
                            Authorization: `Bearer ${session.refreshToken}`
                        }
                    });
                    return instance.post(`${API_URL}/user/requestAccessToken`, {
                        userId: getState().login.user?.id,
                        accessToken: updatedToken ? updatedToken : login.token.token,
                        refreshToken: getState().login.token.refreshToken
                    })
                    .then((res: AxiosResponse) => {
                        if (res.status === 201 || res.status === 200) {
                            dispatch({
                                type: SET_SYSTEM_STATE,
                                session: { ...session, token: res.data.newAccessToken }
                            });
                            dispatch({
                                type: SET_LOGIN_STATE,
                                session: { token: { ...getState().login.token, token: res.data.newAccessToken } }
                            })
                            dispatch(resetAxiosInterceptors(res.data.newAccessToken));
                            console.log("Refreshed session")
                        }
                        return axios(origReq);
                    })
                    .catch(() => {
                        dispatch(resetLoginState());
                        toastWarning("Session expired. Please login again");
                    });
                }
                return Promise.reject(error);
            }
        )

        dispatch({ 
            type: SET_INTERCEPTOR, 
            payload: {
                requestId: reqInterceptor,
                responseId: resInterceptor
            }
        });
    
    }
};

export const resetSystemDialog = (): AppThunk => {
    return async (dispatch) => { 
        dispatch({
            type: SET_SYSTEM_STATE, 
            payload: { systemDialogOpen: false }
        })
        
        setTimeout(() => {
            dispatch({
                type: SET_SYSTEM_STATE, 
                payload: {
                    systemDialogMaxWidth: false,
                    systemDialogTitle: '',
                    systemDialogContent: '',
                    systemDialogActions: undefined,
                    systemOverrideTitle: '',
                    systemDialogSimple: true,
                    systemDialogConfirm: false,
                    systemConfirmOnly: false,
                }
            })
        }, 1000)
    };
}

export const resetAxiosInterceptors = (updatedToken?: string): AppThunk => {
    return async (dispatch, getState) => {
        const { interceptors }  = getState().system;
        if (interceptors) {
            axios.interceptors.request.eject(interceptors.requestId);
            axios.interceptors.response.eject(interceptors.responseId);
            console.log("Cleared axios interceptors", interceptors, axios.interceptors);
        }
        dispatch(setInterceptor(updatedToken));
    }
}