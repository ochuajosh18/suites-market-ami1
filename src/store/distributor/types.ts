import { Field } from "../fields/types";
import { SymphonyEntityListTab, GenericMedia } from '../system/types';
import { ICustomer, CustomerContact, Geolocation } from "../customer/types";
import { Filter } from '../../utils/filter';
export type DynamicDistributorType = File | string | Array<string> |  Geolocation | number | Array<number> | GenericMedia | Array<GenericMedia> | boolean | SymphonyEntityListTab | Date | Distributor | Array<Distributor> | CustomerContact | undefined | null;
export interface DynamicDistributorInput<T> {
    [key: string]: T;
}
export interface DistributorFilter extends Filter { 
    search: string;
} 

export interface Distributor extends DynamicDistributorInput<DynamicDistributorType> {
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
    gps: [number, number];
    isActive: boolean;
    isDeleted: boolean;
    organizationId: string;
    countryCode: string;
    countryId: string;
    logo: GenericMedia;
    numberOfContacts?: number;
}

export interface DistributorState {
    distributors: Array<Distributor>;
    activeDistributor?: Distributor;
    activeDistributorCustomers: Array<ICustomer>;
    activeDistributorCustomerListLoading: boolean;
    activeDistributorModalOpen: boolean;
    activeContacts: Array<CustomerContact>;
    activeContact?: CustomerContact;
    activeTab: SymphonyEntityListTab,
    distributorViewActiveTab: string;
    distributorViewLoading: boolean;
    filters: Partial<DistributorFilter>;
    activeFilters: Partial<DistributorFilter>;
    search: string;
    distributorListLoading: boolean;
    distributorContactLoading: boolean;
    fields: Array<Field>;
    sections: Array<string>;
    contactFields: Array<Field>;
    contactSections: Array<string>;
    customerList: Array<ICustomer>;
}

export const SET_DISTRIBUTOR_STATE = 'set_distributor_state';

export interface SetDistributorStateAction {
    type: typeof SET_DISTRIBUTOR_STATE;
    payload: DynamicDistributorInput<DynamicDistributorType>;
}

export type DistributorAction = SetDistributorStateAction;