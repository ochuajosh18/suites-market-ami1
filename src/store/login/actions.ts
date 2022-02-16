import {
    LoginAction,
    CHANGE_USERNAME,
    CHANGE_PASSWORD,
    CHANGE_REMEMBER_ME,
    CHANGE_FORGOT_PASSWORD,
    CHANGE_EMAIL,
    CHANGE_EMAIL_VALID,
    CHANGE_NEW_PASSWORD,
    CHANGE_CONFIRM_PASSWORD,
    IS_EMAIL_EMPTY,
    AUTHENTICATE,
    IS_USERNAME_EMPTY,
    IS_PASSWORD_EMPTY,
    IS_USERNAME_VALID,
    AUTHENTICATE_WITHOUTH_REMEMBER_ME,
    RESET_STATE,
    REFRESH_TOKEN,
    FORGOT_PASSWORD,
    SET_USER,
    CHANGE_LOGIN_LOADER,
    CHANGE_FORGOT_PASSWORD_LOADER,
    CHANGE_NEW_PASSWORD_LOADER,
    SET_FORGOT_PASSWORD_ID,
    CHANGE_NEW_PASSWORD_REQUEST_LOADING,
    SET_LOGIN_STATE,
    LoginStateInput,
} from './types';
import { SET_SYSTEM_STATE } from '../system/types';
import { setInterceptor } from '../system/actions';
import { v4 as uuidv4 } from 'uuid';
import {  toast } from 'react-toastify';
import { toastError, toastWarning } from '../../modules/Toast';
import { AppThunk } from '..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

const authenticateError = (e) => {
    if(e.message === 'Network Error') {
        toast.error('Network Error!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    } if(e.message === 'Request failed with status code 404') {
        toastError("User not found")
    } else {
        if (e.response.data.status === 500) {
            toastError('There was an issue fetching the data. Please contact your administrator');
        } else {
            switch (e.response.data.error.message) {
                case 'Login: User was not found':
                    toastWarning('User not found');
                    break;
                case 'Login: Incorrect Password':
                    toastWarning('Invalid password');
                    break;
                case 'Login: Missing username or password':
                    toastWarning('Missing username or password');
                    break;
                default:
                    toastWarning("Please check your internet connection")
                    break;
            }
        }
    }
}

export function inputUsername(username: string): LoginAction {
    return {
        type: CHANGE_USERNAME,
        payload: username,
    };
}

export function inputPassword(password: string): LoginAction {
    return {
        type: CHANGE_PASSWORD,
        payload: password,
    };
}

export function changeRememberMe(active: boolean): LoginAction {
    return {
        type: CHANGE_REMEMBER_ME,
        payload: active,
    };
}

export function changeForgotPassword(isClick: boolean): LoginAction {
    return {
        type: CHANGE_FORGOT_PASSWORD,
        payload: isClick,
    };
}

export function inputEmail(email: string): LoginAction {
    return {
        type: CHANGE_EMAIL,
        payload: email,
    };
}

export function isEmailValid(
    emailError: boolean,
    emailHelperText: string,
): LoginAction {
    return {
        type: CHANGE_EMAIL_VALID,
        payload: { emailError, emailHelperText },
    };
}

export function onChangeNewPassword(newPassword: string): LoginAction {
    return {
        type: CHANGE_NEW_PASSWORD,
        payload: newPassword,
    };
}

export function onChangeConfirmPassword(confirmPassword: string): LoginAction {
    return {
        type: CHANGE_CONFIRM_PASSWORD,
        payload: confirmPassword,
    };
}

export function emailEmpty(isEmpty: boolean): LoginAction {
    let emailHelperText = '';
    let emailError = false;
    if (isEmpty) {
        emailHelperText = 'Please fill Email';
        emailError = true;
    } else {
        emailHelperText = '';
        emailError = false;
    }

    return {
        type: IS_EMAIL_EMPTY,
        payload: { emailError, emailHelperText },
    };
}

export const authenticate = (
    userName: string,
    password: string,
    rememberMe: boolean,
): AppThunk => {
    return async (dispatch, getState) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        dispatch({ type: CHANGE_LOGIN_LOADER, payload: true });
        try {
            const { login : { isLoggedIn }, system: { interceptors }  } = getState();
            if (isLoggedIn) {
                if (interceptors) {
                    axios.interceptors.request.eject(interceptors.requestId);
                    axios.interceptors.response.eject(interceptors.responseId);
                    dispatch({ type: SET_SYSTEM_STATE, payload: { interceptors: null }});
                }
            }
            
            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.REACT_APP_MARKETPLACE_LOGIN_TOKEN}`
            }

            let result = await axios.post(`${apiUrl}/user/login`, {
                username: userName,
                password: password,
            }, { headers });

            if (result.data) {
                if (rememberMe) {
                    dispatch({
                        type: AUTHENTICATE,
                        payload: result.data,
                    });
                } else {
                    dispatch({
                        type: AUTHENTICATE_WITHOUTH_REMEMBER_ME,
                        payload: result.data,
                    });
                }

                // set token interceptor
                dispatch(setInterceptor(result.data.token));

                dispatch({
                    type: SET_SYSTEM_STATE,
                    payload: { 
                        userType: 'Marketplace', 
                        session: { token: result.data.token, refreshToken: result.data.refreshToken },
                        route: '/home',
                        headerText: {
                            main: 'Home',
                            sub: ''
                        },
                        redirectTo: '/Home',
                        shallRedirect: true
                    }
                })

                document.title = "Symphony Market AMI";
            }
        } catch (e) {
            authenticateError(e)
        } finally {
            dispatch({ type: CHANGE_LOGIN_LOADER, payload: false });
        }
    };
};

export function usernameEmpty(isEmpty: boolean): LoginAction {
    let userNameHelperText = '';
    let userNameError = false;
    if (isEmpty) {
        userNameHelperText = 'Please fill username';
        userNameError = true;
    } else {
        userNameHelperText = '';
        userNameError = false;
    }

    return {
        type: IS_USERNAME_EMPTY,
        payload: { userNameError, userNameHelperText },
    };
}

export function passwordEmpty(isEmpty: boolean): LoginAction {
    let passwordHelperText = '';
    let passwordError = false;
    if (isEmpty) {
        passwordHelperText = 'Please fill password';
        passwordError = true;
    } else {
        passwordHelperText = '';
        passwordError = false;
    }

    return {
        type: IS_PASSWORD_EMPTY,
        payload: { passwordError, passwordHelperText },
    };
}

export function resetLoginState(): AppThunk {
    return async (dispatch, getState) => {
        const { interceptors}  = getState().system;
        if (interceptors) {
            axios.interceptors.request.eject(interceptors.requestId);
            axios.interceptors.response.eject(interceptors.responseId);
        }

        // clean store
        dispatch({
            type: 'reset_global_state',
            payload: null
        });

        dispatch({
            type: 'clear_route_settings',
            payload: null
        });

        dispatch({
            type: RESET_STATE,
            payload: {},
        })

        document.title = 'Symphony AMI';
    }
}

export const refreshToken = (data): any => {
    return async (dispatch, getState) => {
        dispatch({
            type: REFRESH_TOKEN,
            payload: data
        })
        const state = getState();
        const apiUrl = process.env.REACT_APP_API_URL;

        try {
            // console.log({
            //     userId: state.login.token.userDetails.id,
            //     refreshToken: state.login.token.refreshToken,
            //     accessToken: state.login.token.token,
            // });

            let result: any = await axios.post(
                `${apiUrl}/user/requestAccessToken`,
                {
                    userId: state.login.token.userDetails.id,
                    refreshToken: state.login.token.refreshToken,
                    accessToken: state.login.token.token,
                },
                {
                    headers: {
                        Authorization: `Bearer ${state.login.token.refreshToken}`,
                    },
                },
            );

            dispatch({
                type: REFRESH_TOKEN,
                payload: result.data,
            });
        } catch (e) {
            // alert(e);
            console.log(e);
        }
    };
};
export function isUserNameValid(
    userNameError: boolean,
    userNameHelperText: string,
): LoginAction {
    return {
        type: IS_USERNAME_VALID,
        payload: { userNameError, userNameHelperText },
    };
}

export const forgotPassword = (email: string): AppThunk => {
    return async (dispatch) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        let uuid = uuidv4();
        dispatch({ type: CHANGE_FORGOT_PASSWORD_LOADER, payload: true });
        dispatch({ type: CHANGE_NEW_PASSWORD_REQUEST_LOADING, payload: true });
        try {
            let result = await axios.post(`${apiUrl}/user/forgotPassword`, {
                email,
                uuid,
            });

            console.log(result);

            if (result && result.status === 204) {
                dispatch({
                    type: FORGOT_PASSWORD,
                    payload: uuid,
                });
                dispatch({
                    type: SET_LOGIN_STATE,
                    payload: { forgotPasswordSuccess: true },
                });
            }
        } catch (e) {
            if (e.response && e.response.data.status === 500) {
                toastError('Couchbase Error!');
            } else {
                if (e.response && e.response.data.error.message) {
                    switch (e.response.data.error.message) {
                        case 'Forgot Password: User was not found':
                            toastError('No account is associated with the email address');
                            break;
                        case 'Forgot Password: Missing email':
                            toastError('Missing Email');
                            break;
                        default:
                            toastError(e);
                            break;
                    }
                }
                else {
                    toastError('Please check your internet connection and try again');
                }
            }
        } finally {
            dispatch({ type: CHANGE_FORGOT_PASSWORD_LOADER, payload: false });
            dispatch({
                type: CHANGE_NEW_PASSWORD_REQUEST_LOADING,
                payload: false,
            });
        }
    };
};

export const newPassword = (
    id: string,
    newPassword: string,
    confirmedPassword: string,
    token: string,
): AppThunk => {
    return async (dispatch) => {
        const apiUrl = process.env.REACT_APP_API_URL;

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };

        dispatch({ type: CHANGE_NEW_PASSWORD_LOADER, payload: true });

        try {
            let result = await axios.post(
                `${apiUrl}/user/changePassword/forgot`,
                {
                    id,
                    password: newPassword,
                    confirmedPassword,
                },
                { headers },
            );

            if (result.status === 200 || result.status === 204) {
                dispatch({ 
                    type: SET_LOGIN_STATE, 
                    payload: { newPasswordSuccess: true } 
                });
            }
        } catch (e) {
            if (e.response && e.response.data.status === 500) {
                alert('Couchbase Error!');
            } else {
                if (e.response) {
                    switch (e.response.data.error.message) {
                        case 'Change Password: Invalid password':
                            alert('Invalid Password');
                            break;
                        case 'Change Password: Missing user ID':
                            alert('Missing User Id');
                            break;
                        case 'Change password token is required':
                            alert('Change password token is required');
                            break;
                        case 'Invalid change password token':
                            alert('Invalid change password token');
                            break;
                        default:
                            alert(e);
                            break;
                    }
                }
                else {
                    toastError('Please check your internet connection and try again');
                }
            }
        } 
        finally {
            dispatch({ type: CHANGE_NEW_PASSWORD_LOADER, payload: false });
        }
    };
};

export const setUser = (user: object): LoginAction => {
    return {
        type: SET_USER,
        payload: user,
    };
};

export const getForgotPasswordId = (id: string, token): AppThunk => {
    return async (dispatch) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };

        try {
            let result = await axios.get(
                `${apiUrl}/user/forgotPasswordId/${id}`,
                { headers },
            );

            if (result.data.forgotPasswordId) {
                dispatch({
                    type: SET_FORGOT_PASSWORD_ID,
                    payload: result.data.forgotPasswordId,
                });
            } else {
                dispatch({ type: SET_FORGOT_PASSWORD_ID, payload: '' });
            }
        } catch (e) {
            dispatch({
                type: SET_SYSTEM_STATE,
                payload: { shallRedirect: true, redirectTo: '/login' }
            });
            toastError('Password request does not exist. Redirecting to login')
        }
    };
};

export const setLoginState = (state: LoginStateInput): LoginAction => ({
    type: SET_LOGIN_STATE,
    payload: state
})

// Basic Login Actions
export const basicLogin = (username: string, password: string, rememberMe: boolean): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_LOGIN_STATE,
            payload: { loginLoading: true }
        })

        try {
            let res = await axios.post(`${API_URL}/user/login`, { username, password }, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_BASIC_LOGIN_TOKEN}`
                }
            })

            if (res.data) {
                // set token interceptor
                dispatch({
                    type: rememberMe ? AUTHENTICATE : AUTHENTICATE_WITHOUTH_REMEMBER_ME,
                    payload: res.data,
                });
                
                dispatch(setInterceptor(res.data.token));
                
                const { iat, exp } = res.data.token;

                dispatch({
                    type: SET_SYSTEM_STATE,
                    payload: { 
                        userType: 'Basic', 
                        session: { iat, exp, token: res.data.token, refreshToken: res.data.refreshToken },
                        route: '/home',
                        headerText: {
                            main: 'Home',
                            sub: ''
                        }
                    }
                })

                dispatch({
                    type: SET_LOGIN_STATE,
                    payload: { basicUsername: rememberMe ? username : '', basicPassword: '', basicRememberMe: rememberMe, isLoggedIn: true }
                });
                
                document.title = "Symphony Sales AMI";
            }
        }
        catch (e) {
            // console.log(e)
            authenticateError(e);
        }
        finally {
            dispatch({
                type: SET_LOGIN_STATE,
                payload: { loginLoading: false }
            })
        }
    }
}