import { AnyAction } from 'redux';


export interface LoginState {
    username: string;
    password: string;
    rememberMe: boolean;
    isForgotPassword: boolean;
    email: string;
    newPassword: string;
    confirmPassword: string;
    emailError: boolean;
    emailHelperText: string;
    token: any;
    userNameError: boolean;
    userNameHelperText: string;
    passwordError: boolean;
    passwordHelperText: string;
    isLoggedIn: boolean;
    uuid: string;
    forgotPasswordAt: string;
    user: any;
    loginLoading: boolean;
    forgotPasswordLoading: boolean;
    newPasswordLoading: boolean;
    forgotPasswordId: string;
    newPasswordRequestLoading: boolean;
    basicUsername: string;
    basicPassword: string;
    basicRememberMe: boolean;
    platform: string;
    forgotPasswordSuccess: boolean;
    newPasswordSuccess: boolean;
    newPasswordStrengthValid: boolean;
}

export const CHANGE_USERNAME = 'change_username';
export const CHANGE_PASSWORD = 'change_password';
export const CHANGE_REMEMBER_ME = 'change_remember_me';
export const CHANGE_FORGOT_PASSWORD = 'change_forgot_password';
export const CHANGE_EMAIL = 'change_email';
export const CHANGE_EMAIL_VALID = 'change_email_valid';
export const CHANGE_NEW_PASSWORD = 'change_new_password';
export const CHANGE_CONFIRM_PASSWORD = 'change_confirm_password';

export const IS_NEW_PASSWORD_EMPTY = 'is_new_password_empty';
export const IS_CONFIRM_PASSWORD_EMPTY = 'is_confirm_password_empty';
export const IS_EMAIL_EMPTY = 'is_email_empty';
export const IS_USERNAME_EMPTY = 'is_username_empty';
export const IS_PASSWORD_EMPTY = 'is_password_empty';
export const IS_USERNAME_VALID = 'is_username_valid';

export const AUTHENTICATE = 'authenticate';
export const AUTHENTICATE_WITHOUTH_REMEMBER_ME =
    'authenticate_withouth_remember_me';
export const FORGOT_PASSWORD = 'forgot_password';

export const RESET_STATE = 'reset_login_state';
export const REFRESH_TOKEN = 'refresh_token';
export const PASSWORD_EMPTY = 'password_empty';
export const CHANGE_NEW_PASSWORD_HELPER_TEXT = 'change_password_helper_text';
export const CHANGE_CONFIRM_PASSWORD_HELPER_TEXT =
    'change_confirm_password_helper_text';
export const CHANGE_NEW_PASSWORD_ERROR = 'change_new_password_error';
export const CHANGE_CONFIRM_PASSWORD_ERROR = 'change_confirm_password_error';

export const CHANGE_LOGIN_LOADER = 'change_login_loader';
export const CHANGE_FORGOT_PASSWORD_LOADER = 'change_forgot_password_loader';
export const CHANGE_NEW_PASSWORD_LOADER = 'change_new_password_loader';
export const SET_FORGOT_PASSWORD_ID = 'set_forgot_password_id';
export const CHANGE_NEW_PASSWORD_REQUEST_LOADING =
    'change_new_password_request_loading';

export const SET_USER = 'set_user';
export const SET_LOGIN_STATE = 'set_login_state';

export interface LoginStateInput {
    [name: string]: string | Array<string> | Boolean;
}

export interface inputEmailAction {
    type: typeof CHANGE_USERNAME;
    payload: string;
}

export interface inputPasswordAction {
    type: typeof CHANGE_PASSWORD;
    payload: string;
}

export interface changeRememberMeAction {
    type: typeof CHANGE_REMEMBER_ME;
    payload: boolean;
}

export interface onForgotPasswordClickAction {
    type: typeof CHANGE_FORGOT_PASSWORD;
    payload: boolean;
}

export interface onChangeEmailAction {
    type: typeof CHANGE_EMAIL;
    payload: string;
}

export interface onChangeNewPassword {
    type: typeof CHANGE_NEW_PASSWORD;
    payload: string;
}

export interface onChangeConfirmPassword {
    type: typeof CHANGE_CONFIRM_PASSWORD;
    payload: string;
}

export interface newPasswordEmptyAction {
    type: typeof IS_NEW_PASSWORD_EMPTY;
    payload: object;
}

export interface confirmPasswordEmptyAction {
    type: typeof IS_CONFIRM_PASSWORD_EMPTY;
    payload: object;
}

export interface emailEmptyAction {
    type: typeof IS_EMAIL_EMPTY;
    payload: object;
}

export interface authenticateAction {
    type: typeof AUTHENTICATE;
    payload: string;
}

export interface usernameEmptyAction {
    type: typeof IS_USERNAME_EMPTY;
    payload: object;
}

export interface passwordEmptyAction {
    type: typeof IS_PASSWORD_EMPTY;
    payload: object;
}

export interface isUserNameValidAction {
    type: typeof IS_USERNAME_VALID;
    payload: object;
}

export interface ResetLoginState {
    type: typeof RESET_STATE;
    payload: object;
}

export interface RefeshTokenAction {
    type: typeof REFRESH_TOKEN;
    payload: object;
}

export interface PasswordEmptyAction {
    type: typeof PASSWORD_EMPTY;
    payload: null;
}

export interface setUserAction {
    type: typeof SET_USER;
    payload: object;
}

export interface LoginStateInputAction {
    type: typeof SET_LOGIN_STATE;
    payload: LoginStateInput
}

export type LoginAction =
    | AnyAction
    | inputEmailAction
    | inputPasswordAction
    | changeRememberMeAction
    | onForgotPasswordClickAction
    | onChangeEmailAction
    | onChangeNewPassword
    | onChangeConfirmPassword
    | newPasswordEmptyAction
    | confirmPasswordEmptyAction
    | emailEmptyAction
    | authenticateAction
    | usernameEmptyAction
    | passwordEmptyAction
    | ResetLoginState
    | RefeshTokenAction
    | ResetLoginState
    | PasswordEmptyAction
    | setUserAction
    | LoginStateInputAction;
