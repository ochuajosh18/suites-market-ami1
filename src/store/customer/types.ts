import { Field } from "../fields/types";
import { SymphonyEntityListTab, GenericMedia } from '../system/types';
import { Filter } from '../../utils/filter';
export type CustomerTab = 'INFO' | 'CONTACT';
export type CustomerViewActiveTab = 'Common Information' | 'Contact Information';
export type CustomerMode = 'CREATE' | 'UPDATE';
export type DynamicBasicCustomerInput = 
File |
string | 
Array<string> | 
ICustomer | 
CustomerTab | 
CustomerContact | 
boolean | 
Date | 
number |
[number, number] |
Array<number> |
GenericMedia |
Array<GenericMedia> |
Geolocation |
Partial<CustomerFilter> |
undefined; 

export interface Geolocation {
    longitude: number;
    latitude: number;
    address: string;
}

export interface CustomerFilter extends Filter {
    salespersonId: Array<string>;
    channel: Array<string>;
    orderBy: string;
    order: string;
    keyword: string;
}

export interface CustomerContact {
    id: string;
    name: string;
    isPrimary: boolean | string;
    email: string;
    phoneNumber: string;
    avatar: GenericMedia;
    position: string;
    address: string;
    note?: string;
    notes?: string;
}

export interface BasicCustomerType<T> {
    [key: string]: T;
}

export interface ICustomer extends BasicCustomerType<DynamicBasicCustomerInput> {
    name: string;
    salespersonId: string;
    salespersonName?: string;
    id: string;
    displayId: string;
    contactNumber: string;
    mobileNumber?: string;
    address: string;
    country: string;
    email: string;
    status: string;
    channel: string;
    dateCreated: string | Date;
    dateUpdated: string | Date;
    gps: Geolocation;
    isActive: boolean;
    isDeleted: boolean;
    organizationId: string;
    countryCode: string;
    countryId: string;
    logo: GenericMedia;
    numberOfContacts?: number;
}

export interface CustomerState {
    customerSearch: string;
    customerList: Array<ICustomer>;
    activeCustomerId: string;
    activeCustomer?: ICustomer;
    activeFields: Array<Field>;
    customerListLoading: boolean;
    customerViewLoading: boolean;
    customerCreateLoading: boolean;
    activeTab: CustomerTab;
    showContactForm: boolean;
    activeContact?: CustomerContact
    activeContacts: Array<CustomerContact>;
    customerAction: CustomerMode;
    contactLoading: boolean;
    activeContactFields: Array<Field>;
    customerListActiveTab: SymphonyEntityListTab;
    customerViewActiveTab: CustomerViewActiveTab;
    customerContactLoading: boolean;
    customerContacts: Array<CustomerContact>;
    fields: Array<Field>;
    sections: Array<string>;
    contactFields: Array<Field>;
    contactSections: Array<string>;
    filters: Partial<CustomerFilter>;
    activeFilters: Partial<CustomerFilter>;
    searchString: string;
}

export const SET_CUSTOMER_STATE = 'set_customer_state';
export const UPDATE_ACTIVE_CUSTOMER = 'update_active_customer';
export const UPDATE_ACTIVE_CONTACT = 'update_active_contact';

export interface CustomerStateInput {
    [name: string]: string | Array<string> | ICustomer | CustomerTab | CustomerContact | boolean | undefined | [number, number] | Array<ICustomer> | Array<CustomerContact> | DynamicBasicCustomerInput;
}

export type ActiveCustomerInputData = string | [number, number] | boolean;
export type ActiveCustomerContactData = string | boolean;

export interface ActiveCustomerInput {
    field: string;
    text: ActiveCustomerInputData;
}

export interface ActiveContactInput {
    field: string;
    value: ActiveCustomerContactData;
}

export interface SetCustomerStateAction {
    type: typeof SET_CUSTOMER_STATE;
    payload: CustomerStateInput;
}

export interface UpdateActiveCustomerAction {
    type: typeof UPDATE_ACTIVE_CUSTOMER;
    payload: ActiveCustomerInput;
}

export interface UpdateActiveContactAction {
    type: typeof UPDATE_ACTIVE_CONTACT;
    payload: ActiveContactInput;
}

export type CustomerAction = SetCustomerStateAction | UpdateActiveCustomerAction | UpdateActiveContactAction;