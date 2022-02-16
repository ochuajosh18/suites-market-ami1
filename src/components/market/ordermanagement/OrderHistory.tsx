import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { OrderManagementState, OrderManagementInputType, SortOrder, OrderManagementFilter } from '../../../store/ordermanagement/types';
import { setOrderManagementState, getOrders } from '../../../store/ordermanagement/actions';

import { setSystemState } from '../../../store/system/actions';
import { LoginState } from '../../../store/login/types';
// import SalespersonCardList from './fragments/SalespersonCardList';

// local
import Filter from './fragments/Filter';
import OrderCardList from './fragments/OrderCardList';

// symphony components
import {
    SymphonyContainer,
    SymphonyContentContainer,
    SymphonyTabsContainer,
    SymphonyField,
    SymphonyTabs,
    SymphonyTab
    // SymphonyContentLoadingContainer,
} from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout from '../../symphony/SymphonyLayout';

// material
import Box from '@material-ui/core/Box';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

// util
import lFilter from 'lodash/filter';
import debounce from 'lodash/debounce';
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';

interface OrderHistoryProps {
    getOrders: typeof getOrders;
    setOrderManagementState: typeof setOrderManagementState;
    setSystemState: typeof setSystemState;
    ordermanagement: OrderManagementState;
    login: LoginState;
}

class OrderHistory extends React.Component<OrderHistoryProps> {
    searchRef = React.createRef<HTMLInputElement>();
    _search = debounce((searchString: string) => {
        this.props.getOrders({
            ...this.props.ordermanagement.activeFilters,
            keyword: searchString
        }, true);
    }, 300, { leading: false });

    componentDidMount = () => {
        this.props.setSystemState({
            headerEndButton: (
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <SymphonyField 
                        id="order-search-fld"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <Search htmlColor={SYMPHONY_PRIMARY_COLOR} />
                            </InputAdornment>
                        }}
                        inputProps={{ ref: this.searchRef }}
                        onChange={this._onSearch.bind(this)}
                        placeholder="Search"
                    />
                </Box>
            ),
            shallRedirect: false,
            redirectTo: ''
        });

        this.props.getOrders(undefined, true);
        this.props.setOrderManagementState({ filters: {}, activeFilters: {}, orderHistoryTab: 'All' })
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined });

    _onAddClick = () => this.props.setSystemState({
        shallRedirect: true,
        redirectTo: '/sales/salesperson/new'
    });

    _onSearch = (e: React.ChangeEvent<HTMLInputElement>) => this._search(e.target.value);

    _onOrderInput = (key: string, value: OrderManagementInputType) => {
        this.props.setOrderManagementState({ [key]: value });
    }

    _onFilterInput = (key: string, value: OrderManagementInputType) => {
        this.props.setOrderManagementState({
            filters: { ...this.props.ordermanagement.filters, [key]: value }
        });
    }

    _onFilterApply = () => {
        let f: Partial<OrderManagementFilter> = { ...this.props.ordermanagement.filters };
        this.props.setOrderManagementState({ activeFilters: f });
        if (this.props.ordermanagement.orderHistoryTab !== 'All') {
            this.props.getOrders({ ...f, status: [this.props.ordermanagement.orderHistoryTab.toUpperCase().replace(/ +/g, '_')]})
        }
        else {
            this.props.getOrders(f, true);
        }
    }

    _onFilterRemove = (key: string, filter: string | number | undefined) => {
        const { activeFilters } = this.props.ordermanagement;
        if (Array.isArray(activeFilters[key])) {
            const newFilter = { ...activeFilters, [key]: lFilter(activeFilters[key] as Array<string>, (f: string) => f !== filter) }
            this.props.setOrderManagementState({ activeFilters: newFilter, filters: newFilter });
            this.props.getOrders(newFilter, true);
        }
        else {
            let dF = activeFilters;
            delete dF[key];
            this.props.setOrderManagementState({ activeFilters: dF, filters: dF });
            this.props.getOrders(dF, true);
        }
    }

    _onFilterReset = () => {
        this.props.setOrderManagementState({ activeFilters: {}, filters: {} });
        this.props.getOrders(undefined, true);
    }

    _onSortClick = (sort: string, order: SortOrder) => {
        let query: Partial<OrderManagementFilter> = { ...this.props.ordermanagement.activeFilters };
        const activeSort = !order ? '' : sort;
        this.props.setOrderManagementState({ activeSort, activeSortOrder: order as string });
        if (activeSort && order) { 
            this.props.getOrders({ 
                ...this.props.ordermanagement.activeFilters, 
                orderBy: sort,
                order: order as string
            }, true);
        }
        else {
            this.props.getOrders(query, true);
        }
    }

    _onTabChange = (tab: string) => {
        this.props.setOrderManagementState({ orderHistoryTab: tab, filters: { }, activeFilters: { } });
        if (tab === 'All') this.props.getOrders(this.props.ordermanagement.activeFilters, true);
        else {
            this.props.getOrders({ ...this.props.ordermanagement.activeFilters, status: [tab.toUpperCase().replace(/ +/g, '_')]}, true)
        }
    }

    render() {
        const { orders, orderLoading, activeSort, activeSortOrder, orderHistoryTab, filterMinPrice, filterMaxPrice, filters, activeFilters } = this.props.ordermanagement;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyTabsContainer>
                        <SymphonyTabs 
                            value={orderHistoryTab}
                            TabIndicatorProps={{ style: { height: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                        >
                            <SymphonyTab 
                                id="order-history-all-tab"
                                label="All" 
                                value="All" 
                                onClick={this._onTabChange.bind(this, 'All')}
                            />
                            <SymphonyTab 
                                id="order-history-received-tab"
                                label="Received" 
                                value="Received"
                                onClick={this._onTabChange.bind(this, 'Received')}
                            />
                            <SymphonyTab 
                                id="order-history-cancelled-tab"
                                label="Cancelled" 
                                value="Cancelled"
                                onClick={this._onTabChange.bind(this, 'Cancelled')}
                            />
                            <SymphonyTab 
                                 id="order-history-faileddelivery-tab"
                                label="Failed Delivery" 
                                value="Failed Delivery"
                                onClick={this._onTabChange.bind(this, 'Failed Delivery')}
                            />
                        </SymphonyTabs>
                    </SymphonyTabsContainer>
                    <SymphonyContentContainer flexDirection="column" height="calc(100vh - 260px)!important">
                        <Filter 
                            filters={filters} 
                            activeFilters={activeFilters}
                            onFilterInput={this._onFilterInput.bind(this)}
                            onOrderInput={this._onOrderInput.bind(this)}
                            onRemoveFilter={this._onFilterRemove.bind(this)}
                            onReset={this._onFilterReset.bind(this)}
                            onFilterApply={this._onFilterApply.bind(this)}
                            isHistory={true}
                            priceMin={filterMinPrice}
                            priceMax={filterMaxPrice}
                            currency={this.props.login.user.currencySign ? this.props.login.user.currencySign : ''}
                        />
                        <OrderCardList 
                            orders={orders}
                            activeSort={activeSort}
                            activeSortOrder={activeSortOrder}
                            onSortClick={this._onSortClick.bind(this)}
                            loading={orderLoading}
                            onOrderUpdate={() => {}}
                            isHistory={true}
                            currency={this.props.login.user.currencySign ? this.props.login.user.currencySign : ''}
                        />
                    </SymphonyContentContainer>
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    ordermanagement: state.ordermanagement,
    system: state.system,
    login: state.login
});

export default connect(mapStateToProps, {
    getOrders,
    setOrderManagementState,
    setSystemState
})(OrderHistory);