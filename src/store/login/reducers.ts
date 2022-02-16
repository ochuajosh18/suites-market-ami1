import {
    LoginAction,
    LoginState,
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
    FORGOT_PASSWORD,
    SET_USER,
    CHANGE_LOGIN_LOADER,
    CHANGE_FORGOT_PASSWORD_LOADER,
    CHANGE_NEW_PASSWORD_LOADER,
    SET_FORGOT_PASSWORD_ID,
    RESET_STATE,
    REFRESH_TOKEN,
    CHANGE_NEW_PASSWORD_REQUEST_LOADING,
    SET_LOGIN_STATE,
} from './types';

import moment from 'moment';

const INITIAL_STATE: LoginState = {
    username: '',
    password: '',
    rememberMe: false,
    isForgotPassword: false,
    email: '',
    newPassword: '',
    confirmPassword: '',
    emailError: false,
    emailHelperText: '',
    token: {},
    userNameError: false,
    userNameHelperText: '',
    passwordError: false,
    passwordHelperText: '',
    isLoggedIn: false,
    uuid: '',
    forgotPasswordAt: '',
    user: {
        firstName: '',
        lastName: '',
    },
    loginLoading: false,
    forgotPasswordLoading: false,
    newPasswordLoading: false,
    forgotPasswordId: '',
    newPasswordRequestLoading: false,
    basicUsername: '',
    basicPassword: '',
    basicRememberMe: false,
    platform: 'Symphony Market',
    forgotPasswordSuccess: false,
    newPasswordSuccess: false,
    newPasswordStrengthValid: false
};

export default (
    state = INITIAL_STATE,
    action: LoginAction,
): LoginState => {
    switch (action.type) {
        case CHANGE_USERNAME:
            return { ...state, username: action.payload };
        case CHANGE_PASSWORD:
            return { ...state, password: action.payload };
        case CHANGE_REMEMBER_ME:
            return { ...state, rememberMe: action.payload };
        case CHANGE_FORGOT_PASSWORD:
            return { ...state, isForgotPassword: action.payload };
        case CHANGE_EMAIL:
            return { ...state, email: action.payload };
        case CHANGE_EMAIL_VALID:
            return {
                ...state,
                emailError: action.payload.emailError,
                emailHelperText: action.payload.emailHelperText,
            };
        case CHANGE_NEW_PASSWORD:
            return { ...state, newPassword: action.payload };
        case CHANGE_CONFIRM_PASSWORD:
            return { ...state, confirmPassword: action.payload };
        case IS_EMAIL_EMPTY:
            return {
                ...state,
                emailError: action.payload.emailError,
                emailHelperText: action.payload.emailHelperText,
            };
        case AUTHENTICATE_WITHOUTH_REMEMBER_ME:
            return {
                ...state,
                token: action.payload,
                username: '',
                password: '',
                rememberMe: false,
                isLoggedIn: true,
                user: action.payload.userDetails
            };
        case AUTHENTICATE:
            return { ...state, token: action.payload, isLoggedIn: true, user: action.payload.userDetails};
        case IS_USERNAME_EMPTY:
            return {
                ...state,
                userNameError: action.payload.userNameError,
                userNameHelperText: action.payload.userNameHelperText,
            };
        case IS_PASSWORD_EMPTY:
            return {
                ...state,
                passwordError: action.payload.passwordError,
                passwordHelperText: action.payload.passwordHelperText,
            };
        case IS_USERNAME_VALID:
            const { userNameError, userNameHelperText } = action.payload;
            return { ...state, userNameError, userNameHelperText };
        case FORGOT_PASSWORD:
            return {
                ...state,
                uuid: action.payload,
                forgotPasswordAt: moment().toISOString(),
            };
        case SET_USER:
            return { ...state, user: action.payload };
        case CHANGE_LOGIN_LOADER:
            return { ...state, loginLoading: action.payload };
        case CHANGE_FORGOT_PASSWORD_LOADER:
            return { ...state, forgotPasswordLoading: action.payload };
        case CHANGE_NEW_PASSWORD_LOADER:
            return { ...state, newPasswordLoading: action.payload };
        case SET_FORGOT_PASSWORD_ID:
            return { ...state, forgotPasswordId: action.payload };
        case RESET_STATE:
            return { 
                ...INITIAL_STATE, 
                basicUsername: state.basicRememberMe ? state.basicUsername : '', 
                rememberMe: state.rememberMe, 
                basicRememberMe: state.basicRememberMe,
                platform: state.platform
            };
        case REFRESH_TOKEN: {
            return {
                ...state,
                token: { ...state.token, token: { token: action.payload } },
            };
        }
        case CHANGE_NEW_PASSWORD_REQUEST_LOADING:
            return { ...state, newPasswordLoading: action.payload };
        case SET_LOGIN_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}
