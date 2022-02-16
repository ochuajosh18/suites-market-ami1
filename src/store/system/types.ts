import { AnyAction } from 'redux';
import { BasicProductMedia } from '../basicproduct/types';
import { BasicPromotionMedia } from '../promotion/types';
import { BasicNewsMedia } from '../news/types';
export type MediaInputType = BasicNewsMedia | BasicProductMedia | BasicPromotionMedia;
export type UserType = 'Marketplace' | 'Basic';
export type SymphonyEntityListTab = 'Active' | 'Inactive';
export type SortOrder = 'ASC' | 'DESC' | '';

export interface GenericMedia {
    id?: string;
    name: string;
    path: string;
    size: number;
    type: string;
    loading?: boolean;
    file?: File;
}

export interface Session {
    iat: number;
    exp: number;
    token: string;
    refreshToken: string;
}

export interface HeaderText {
    main: string;
    sub: string;
}

export interface HeaderEndButton {
    title: string;
    action: () => void;
}

export interface AutocompleteKeyPair { 
    label: string; 
    value: string 
};

export interface SystemState {
    session: Session | null | undefined;
    userType: UserType | undefined;
    headerText?: HeaderText | null | undefined;
    header?: JSX.Element | JSX.Element[] | undefined;
    sidebarTabValue: string;
    headerEndButton?: HeaderEndButton | JSX.Element | JSX.Element[];
    interceptors: { requestId: number; responseId: number; } | null;
    route: string;
    expandedNavigation: string;
    systemDialogOpen: boolean;
    systemDialogMaxWidth: 'lg' | 'md' | 'sm' | 'xl' | 'xs' | false;
    systemDialogTitle: string;
    systemDialogContent: JSX.Element | JSX.Element[] | string;
    systemDialogActions: JSX.Element | JSX.Element[] | undefined;
    systemDialogSimple: boolean;
    systemDialogConfirm: boolean;
    systemOverrideTitle: string;
    systemConfirmOnly: boolean;
    shallRedirect: boolean;
    redirectTo: string;
    systemDialogConfirmAction: () => void;
}

export const SET_SESSION = 'set_session';
export const SET_HEADER_TEXT = 'set_header_text';
export const SELECT_SIDEBAR_TAB = 'select_sidebar_tab';
export const SET_HEADER_END_BUTTON = 'set_header_end_button';
export const SET_INTERCEPTOR = 'set_interceptor';
export const SET_SYSTEM_STATE = 'set_system_state';
export const EJECT_INTERCEPTOR = 'eject_interceptor';

export interface SystemStateInput {
    [name: string]: string | Array<string> | Boolean | undefined | JSX.Element | JSX.Element[] | (() => void) | HeaderText | null;
}

export interface SetSessionAction {
    type: typeof SET_SESSION;
    payload: Session;
}

export interface SetHeaderTextAction {
    type: typeof SET_HEADER_TEXT;
    payload: object;
}

export interface SelectSidebarTab {
    type: typeof SELECT_SIDEBAR_TAB;
    payload: string;
}

export interface SetHeaderEndButtonAction {
    type: typeof SET_HEADER_END_BUTTON;
    payload: HeaderEndButton;
}

export interface SetInterceptorAction {
    type: typeof SET_INTERCEPTOR;
    payload: { requestId: number; responseId: number; }
}

export interface EjectInterceptorAction {
    type: typeof EJECT_INTERCEPTOR;
    payload: undefined | null;
}

export interface SystemStateInputAction {
    type: typeof SET_SYSTEM_STATE;
    payload: SystemStateInput
}

export type SystemAction =
    | SetSessionAction
    | SetHeaderTextAction
    | SelectSidebarTab
    | SetInterceptorAction
    | EjectInterceptorAction
    | SystemStateInputAction
    | AnyAction;
