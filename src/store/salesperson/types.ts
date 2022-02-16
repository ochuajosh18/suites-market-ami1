import { Filter } from '../../utils/filter';
import { Geolocation } from '../customer/types';
import { Field } from '../fields/types';
import { GenericMedia } from '../system/types';
export type DynamicSalesSalespersonInput = 
number |
string | 
boolean |
Array<string> | 
Array<Salesperson> |
ContactNumber |
Array<number> |
GenericMedia |
Partial<Filter> |
Geolocation |
undefined;

export interface SalesSalespersonType<T> {
    [key: string]: T;
}

export interface SalespersonFilter extends Filter {
    name: Array<string>;
    search: string;
}

export interface ContactNumber extends SalesSalespersonType<DynamicSalesSalespersonInput> {
    primary: string;
    secondary: string;
    other: Array<string>;
}

export interface Salesperson extends SalesSalespersonType<DynamicSalesSalespersonInput>{
    id: string;
    displayId: string;
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: ContactNumber;
    address: string;
    salespersonType: string;
    isTestAccount: boolean;
    isActive: boolean;
    countryId?: string;
    countryCode?: string;
    organizationId?: string;
    password: string;
    confirmedPassword: string;
    avatar?: GenericMedia;
}

export interface SalespersonState {
    salespersonSearch: string;
    salespersons: Array<Salesperson>;
    activeSalesperson: string;
    salespersonListLoading: boolean;
    activeSalespersonDetail?: Salesperson;
    salespersonDetailLoading: boolean;
    SalespersonCreateLoading: boolean;
    salespersonListTab: string;
    fields: Array<Field>;
    sections: Array<string>;
    filters: Partial<SalespersonFilter>;
    activeFilters: Partial<SalespersonFilter>;
};

export const SALESPERSON_CLICK = "salesperson_click";

export interface SalespersonClickAction {
    type: typeof SALESPERSON_CLICK;
    payload: string;
}

export const LOAD_SALESPERSON_LIST = 'load_salesperson_list';
export const TOGGLE_SALESPERSON_LIST_LOADING = 'toggle_salesperson_list_loading';
export const LOAD_SALESPERSON_DETAILS = 'load_salesperson_details';
export const TOGGLE_SALESPERSON_DETAILS_LOADING = 'toggle_salesperson_details_loading';
export const UPDATE_ACTIVE_SALESPERSON = 'update_active_salesperson';
export const SET_SALESPERSON_STATE = 'set_salesperson_state';
export const SET_NEW_ACTIVE_SALESPERSON_DETAILS = 'set_new_active_salesperson_details';
export const TOGGLE_NEW_ACTIVE_SALESPERSON_DETAILS_LOADING = 'toggle_new_active_salesperson_details_loading';
export const APPEND_SALESPERSON_DATA = 'append_salesperson_data';



export interface SalespersonStateInput {
    [name: string]: string | Array<string> | Salesperson | Array<Salesperson> | DynamicSalesSalespersonInput;
}

export interface SalespersonContactInput {
    primary: string;
    secondary: string;
    other: Array<string>;
}

export type ActiveSalespersonInputData = string | boolean | SalespersonContactInput | Salesperson | Array<Salesperson> | DynamicSalesSalespersonInput;
export interface ActiveSalespersonInput {
    field: string;
    text: ActiveSalespersonInputData;
}

export interface LoadSalespersonListAction  {
    type: typeof LOAD_SALESPERSON_LIST;
    payload: Array<Salesperson>;
}

export interface ToggleSalespersonListLoadingAction  {
    type: typeof TOGGLE_SALESPERSON_LIST_LOADING;
    payload: boolean;
}

export interface LoadSalespersonDetailsAction  {
    type: typeof LOAD_SALESPERSON_DETAILS;
    payload: Salesperson;
}

export interface ToggleSalespersonDetailsLoadingAction  {
    type: typeof TOGGLE_SALESPERSON_DETAILS_LOADING;
    payload: boolean;
}

export interface UpdateActiveSalespersonAction {
    type: typeof UPDATE_ACTIVE_SALESPERSON;
    payload: ActiveSalespersonInput;
}

export interface SetSalespersonStateAction {
    type: typeof SET_SALESPERSON_STATE;
    payload: SalespersonStateInput;
}

export interface SetNewActiveSalespersondetails  {
    type: typeof SET_NEW_ACTIVE_SALESPERSON_DETAILS;
    payload: Salesperson;
}

export interface ToggleNewActiveSalespersonDetailsLoadingAction  {
    type: typeof TOGGLE_NEW_ACTIVE_SALESPERSON_DETAILS_LOADING;
    payload: boolean;
}



export type SalespersonAction = SalespersonClickAction | LoadSalespersonListAction | ToggleSalespersonListLoadingAction | LoadSalespersonDetailsAction | ToggleSalespersonDetailsLoadingAction | UpdateActiveSalespersonAction | SetSalespersonStateAction | SetNewActiveSalespersondetails| ToggleNewActiveSalespersonDetailsLoadingAction;