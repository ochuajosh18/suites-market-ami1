import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store/';
import { CustomerState, DynamicBasicCustomerInput, CustomerFilter } from '../../../store/customer/types';
import { SalespersonState } from '../../../store/salesperson/types';
import { setCustomerState, getSalesCustomer } from '../../../store/customer/actions';
import { AutocompleteKeyPair, SymphonyEntityListTab, SystemState } from '../../../store/system/types';
import { setSystemState } from '../../../store/system/actions';

// local
import CustomerCardList from './fragments/CustomerCardList';
import CustomerFilters from './fragments/CustomerFilters';

// symphony components
import {
    SymphonyHeaderButton,
    SymphonyContainer,
    SymphonyTabsContainer,
    SymphonyContentContainer,
    SymphonyTabs,
    SymphonyTab,
    SymphonyField,
    SymphonyContentLoadingContainer
} from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import SymphonyContentLoading from '../../symphony/SymphonyContentLoading';
import SymphonyFilter from '../../symphony/SymphonyFilter';
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';

// material
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';

// util
import debounce from 'lodash/debounce';
import lFilter from 'lodash/filter';
import map from 'lodash/map';

interface CustomerProps {
    getSalesCustomer: typeof getSalesCustomer;
    setCustomerState: typeof setCustomerState;
    setSystemState: typeof setSystemState;
    salesperson: SalespersonState;
    customer: CustomerState;
    system: SystemState
}

class Customer extends React.Component<CustomerProps> {
    searchRef = React.createRef<HTMLInputElement>();
    _search = debounce((searchString: string) => {
        this.props.getSalesCustomer(
            this.props.customer.customerListActiveTab === 'Active', 
            {
                ...this.props.customer.activeFilters,
                search: searchString
            }
        );
    }, 300, { leading: false });

    componentDidMount = () => {
        // set header
        this.props.setSystemState({
            headerEndButton: () => (
                <div>
                    <SymphonyHeaderButton 
                        id="add-customer-btn"
                        startIcon={<AddIcon />}
                        onClick={this._onAddClick.bind(this)}
                    >
                        Add New
                    </SymphonyHeaderButton>
                </div>
            ),
            shallRedirect: false,
            redirectTo: ''
        });
        // fetch customer list
        this.props.getSalesCustomer();
        this.props.setCustomerState({ activeFilters: {}, filters: {} });
    }

    componentWillUnmount = () => {
        this.props.setSystemState({ header: undefined, headerEndButton: undefined });
        this.props.setCustomerState({ activeFilters: {}, filters: {} });
    }

    _onTabChange = (tab: SymphonyEntityListTab) => {
        const { current } = this.searchRef;
        this.props.setCustomerState({ customerListActiveTab: tab as string });
        this.props.getSalesCustomer(tab === 'Active');
        
        // reset search value when changing tabs
        if (current) {
            current.value = '';
        }
    }

    _onSearch = (e: React.ChangeEvent<HTMLInputElement>) => this._search(e.target.value);

    _onAddClick = () => this.props.setSystemState({
        shallRedirect: true,
        redirectTo: '/sales/customer/new'
    });

    _onFilterInput = (key: string, value: DynamicBasicCustomerInput) => {
        this.props.setCustomerState({
            filters: { ...this.props.customer.filters, [key]: value } as Partial<CustomerFilter>
        });
    }

    _onFilterApply = () => {
        const { filters, searchString } = this.props.customer;
        this.props.setCustomerState({ activeFilters: filters });
        this.props.getSalesCustomer(
            this.props.customer.customerListActiveTab === 'Active', 
            {
                ...this.props.customer.filters,
                search: searchString
            }
        );
    }

    _onFilterRemove = (key: string, filter: string | Array<string> | number | AutocompleteKeyPair | undefined) => {
        const { activeFilters, searchString } = this.props.customer;
        if (Array.isArray(activeFilters[key])) {
            let newFilter: typeof activeFilters = { };
            if (activeFilters[key] && typeof activeFilters[key]![0] === 'object') {
                // keypair
                newFilter = { ...activeFilters, [key]: lFilter(activeFilters[key] as Array<AutocompleteKeyPair>, (f) => f.value !== (filter as AutocompleteKeyPair).value) }
            }
            else {
                newFilter = { ...activeFilters, [key]: lFilter(activeFilters[key] as Array<string>, (f: string) => f !== filter) }
            }
            this.props.setCustomerState({ activeFilters: newFilter, filters: newFilter });
            this.props.getSalesCustomer(
                this.props.customer.customerListActiveTab === 'Active', 
                {
                    ...newFilter,
                    search: searchString
                }
            );
        }
        else {
            let dF = activeFilters;
            delete dF[key];
            this.props.setCustomerState({ activeFilters: dF, filters: dF });
            this.props.getSalesCustomer(
                this.props.customer.customerListActiveTab === 'Active', 
                {
                    ...dF,
                    search: searchString
                }
            );
        }
    }

    _onFilterReset = () => {
        this.props.setCustomerState({ activeFilters: {}, filters: {} });
        this.props.getSalesCustomer(this.props.customer.customerListActiveTab === 'Active');
    }

    render () {
        const { customerList, customerListActiveTab, customerListLoading, filters, activeFilters } = this.props.customer;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyTabsContainer>
                        <SymphonyTabs 
                            value={customerListActiveTab}
                            TabIndicatorProps={{ style: { height: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                        >
                            <SymphonyTab 
                                id="customer-active-tab"
                                label="Active" 
                                value="Active" 
                                onClick={this._onTabChange.bind(this, 'Active')} 
                            />
                            <SymphonyTab 
                                id="customer-inactive-tab"
                                label="Inactive" 
                                value="Inactive" 
                                onClick={this._onTabChange.bind(this, 'Inactive')} 
                            />
                        </SymphonyTabs>
                        <SymphonyField 
                            id="customer-search-fld"
                            style={{ marginBottom: 8, width: 300 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    <Search htmlColor={SYMPHONY_PRIMARY_COLOR} />
                                </InputAdornment>
                            }}
                            inputProps={{ ref: this.searchRef }}
                            onChange={this._onSearch.bind(this)}
                            placeholder="Search"
                        />
                    </SymphonyTabsContainer>
                    <SymphonyContentContainer flexDirection="column">
                        <SymphonyFilter
                            filters={filters}
                            activeFilters={activeFilters}
                            dataLength={customerList.length}
                            onFilterApply={this._onFilterApply.bind(this)}
                            onRemoveFilter={this._onFilterRemove.bind(this)}
                            onReset={this._onFilterReset.bind(this)}
                        >
                            <CustomerFilters 
                                filter={filters}
                                onFilterInput={this._onFilterInput.bind(this)}
                                channels={map(customerList, (c) => ({ label: c.channel, value: c.channel }))}
                                salespersons={map(this.props.salesperson.salespersons, (s) => ({ label: `${s.firstName} ${s.lastName}`, value: s.id }))}
                            />
                        </SymphonyFilter>
                        {customerListLoading ? <SymphonyContentLoading /> :
                            <>
                                {customerList.length > 0 ?
                                    <>
                                        <CustomerCardList
                                            customers={customerList}
                                        />  
                                    </>
                                :
                                    <SymphonyContentLoadingContainer>No Customer Found</SymphonyContentLoadingContainer>
                                }
                            </>
                        }
                    </SymphonyContentContainer>
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    customer: state.customer,
    salesperson: state.salesperson,
    system: state.system
});

export default connect(mapStateToProps, {
    setCustomerState,
    setSystemState,
    getSalesCustomer
})(Customer);