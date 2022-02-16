import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { OrderManagementState, OrderManagementInputType, SortOrder, OrderManagementFilter } from '../../../store/ordermanagement/types';
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
    SymphonyTabs,
    SymphonyTab,
    SymphonyField,
    // SymphonyContentLoadingContainer,
} from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';

// material
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

// util
import lFilter from 'lodash/filter';
import debounce from 'lodash/debounce';

// temp for front end
import tempOrders from './tempOrders.json';

interface OrderProps {
    updateOrder: typeof updateOrder;
    getOrders: typeof getOrders;
    setOrderManagementState: typeof setOrderManagementState;
    resetSystemDialog: typeof resetSystemDialog;
    setSystemState: typeof setSystemState;
    ordermanagement: OrderManagementState;
}

class Order extends React.Component<OrderProps> {
    searchRef = React.createRef<HTMLInputElement>();
    _search = debounce((searchString: string) => {
        this.props.getOrders({
            ...this.props.ordermanagement.activeFilters,
            keyword: searchString,
            assigned: this.props.ordermanagement.salesOrderTab === 'Assigned'
        }, false);
        this.props.setOrderManagementState({ search: searchString });
    }, 300, { leading: false });

    componentDidMount = () => {
        this.props.setSystemState({
            shallRedirect: false,
            redirectTo: ''
        });

        this.props.getOrders({ assigned: false }); 
        this.props.setOrderManagementState({ 
            filters: {}, 
            activeFilters: {},
            filterMinPrice: 1,
            filterMaxPrice: 400,
            orders: tempOrders
        });
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

    _onTabChange = (tab: string) => {
        this.props.setOrderManagementState({ salesOrderTab: tab });
        this.props.getOrders({
            ...this.props.ordermanagement.activeFilters,
            assigned: tab === 'Assigned'
        }, false);
    }

    render() {
        const { orders, salesOrderTab, orderLoading, activeSort, activeSortOrder, filterMinPrice, filterMaxPrice, filters, activeFilters } = this.props.ordermanagement;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyTabsContainer>
                        <SymphonyTabs 
                            value={salesOrderTab}
                            TabIndicatorProps={{ style: { height: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                        >
                            <SymphonyTab 
                                label="Unassigned" 
                                value="Unassigned" 
                                onClick={this._onTabChange.bind(this, 'Unassigned')}
                            />
                            <SymphonyTab 
                                label="Assigned" 
                                value="Assigned"
                                onClick={this._onTabChange.bind(this, 'Assigned')}
                            />
                        </SymphonyTabs>
                        <SymphonyField 
                            id="order-search-fld"
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
                        />
                        <OrderCardList 
                            orders={orders}
                            activeSort={activeSort}
                            activeSortOrder={activeSortOrder}
                            onSortClick={this._onSortClick.bind(this)}
                            loading={orderLoading}
                            isHistory={false}
                            onOrderUpdate={this._onOrderUpdate.bind(this)}
                        />
                    </SymphonyContentContainer>
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    ordermanagement: state.ordermanagement,
    system: state.system
});

export default connect(mapStateToProps, {
    updateOrder,
    getOrders,
    setOrderManagementState,
    resetSystemDialog,
    setSystemState
})(Order);