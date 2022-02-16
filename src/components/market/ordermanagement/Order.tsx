import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { OrderManagementState, OrderManagementInputType, SortOrder, OrderManagementFilter } from '../../../store/ordermanagement/types';
import { LoginState } from '../../../store/login/types';
import { setOrderManagementState, getOrders, updateOrder } from '../../../store/ordermanagement/actions';

import { setSystemState, resetSystemDialog } from '../../../store/system/actions';
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

interface OrderProps {
    updateOrder: typeof updateOrder;
    getOrders: typeof getOrders;
    setOrderManagementState: typeof setOrderManagementState;
    resetSystemDialog: typeof resetSystemDialog;
    setSystemState: typeof setSystemState;
    ordermanagement: OrderManagementState;
    login: LoginState;
}

class Order extends React.Component<OrderProps> {
    searchRef = React.createRef<HTMLInputElement>();
    _search = debounce((searchString: string) => {
        this.props.getOrders({
            ...this.props.ordermanagement.activeFilters,
            keyword: searchString
        }, false);
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

        this.props.getOrders();
        this.props.setOrderManagementState({ filters: {}, activeFilters: {} })
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
        this.props.setOrderManagementState({ activeFilters: this.props.ordermanagement.filters });
        this.props.getOrders(this.props.ordermanagement.filters);
    }

    _onFilterRemove = (key: string, filter: string | number | undefined) => {
        const { activeFilters } = this.props.ordermanagement;
        if (Array.isArray(activeFilters[key])) {
            const newFilter = { ...activeFilters, [key]: lFilter(activeFilters[key] as Array<string>, (f: string) => f !== filter) }
            this.props.setOrderManagementState({ activeFilters: newFilter, filters: newFilter });
            this.props.getOrders(newFilter);
        }
        else {
            let dF = activeFilters;
            delete dF[key];
            this.props.setOrderManagementState({ activeFilters: dF, filters: dF });
            this.props.getOrders(dF);
        }
    }

    _onFilterReset = () => {
        this.props.setOrderManagementState({ activeFilters: {}, filters: {} });
        this.props.getOrders({});
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
            });
        }
        else {
            this.props.getOrders(query);
        }
    }

    _onOrderUpdate = (id: string, status: string) => {
        this.props.setSystemState({
            systemDialogOpen: true,
            systemDialogMaxWidth: 'xs',
            systemDialogTitle: 'Confirm Status Update',
            systemOverrideTitle: 'Update',
            systemDialogContent: 'Updating the order status will make permanent changes. Please click update to continue.',
            systemDialogSimple: true,
            systemDialogConfirm: true,
            systemDialogConfirmAction: () => {
                this.props.updateOrder(id, status);
                this.props.resetSystemDialog();
            }
        })
    }

    render() {
        const { orders, orderLoading, activeSort, activeSortOrder, filterMinPrice, filterMaxPrice, filters, activeFilters } = this.props.ordermanagement;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyTabsContainer padding="8px 0!important" />
                    <SymphonyContentContainer flexDirection="column" height="calc(100vh - 260px)!important">
                            <Filter 
                                filters={filters} 
                                activeFilters={activeFilters}
                                onFilterInput={this._onFilterInput.bind(this)}
                                onOrderInput={this._onOrderInput.bind(this)}
                                onRemoveFilter={this._onFilterRemove.bind(this)}
                                onReset={this._onFilterReset.bind(this)}
                                onFilterApply={this._onFilterApply.bind(this)}
                                isHistory={false}
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
                                isHistory={false}
                                onOrderUpdate={this._onOrderUpdate.bind(this)}
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
    updateOrder,
    getOrders,
    setOrderManagementState,
    resetSystemDialog,
    setSystemState
})(Order);