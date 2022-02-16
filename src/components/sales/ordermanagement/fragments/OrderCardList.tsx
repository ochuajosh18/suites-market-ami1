import React from 'react';
import { Link } from 'react-router-dom';
import { Order, SortOrder} from '../../../../store/ordermanagement/types';
import { 
    OrderListContainer,
    OrderRowContainer,
    OrderGrid,
} from './OrderManagementComponents';
import { 
    SymphonyContentLoadingContainer,
    SymphonySortableHeaderGridContainer,
    SymphonySortableHeaderGrid
} from '../../../symphony/SymphonyCommonComponents';
import SymphonyContentLoading from '../../../symphony/SymphonyContentLoading';
import SymphonySortableHeader from '../../../symphony/SymphonySortableHeader';
// import SymphonyInput from '../../../symphony/SymphonyInput';


// material
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

// util
import moment from 'moment';
import map from 'lodash/map';

interface OrderCardListProps {
    orders: Array<Order>;
    activeSort: string;
    activeSortOrder: SortOrder;
    onSortClick: (sort: string, order: SortOrder) => void;
    onOrderUpdate: (id: string, status: string) => void;
    loading: boolean;
    isHistory: boolean;
}

const OrderCardList = ({ orders, activeSort, activeSortOrder, onSortClick, onOrderUpdate, loading, isHistory}: OrderCardListProps) => {
    return (
        <OrderListContainer>
            {/* Cards here */}
            <SymphonySortableHeaderGridContainer container={true}>
                <SymphonySortableHeaderGrid item={true} xs={3}>
                    <SymphonySortableHeader
                        headerTitle="Order Number"
                        headerValue="name"
                        onSortClick={() => {}}
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true} xs={2}>
                    <SymphonySortableHeader
                        headerTitle="Order Date"
                        headerValue="dateCreated"
                        onSortClick={() => {}}
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true} xs={2}>
                    <SymphonySortableHeader
                        headerTitle="Payment"
                        headerValue="paymentMethod"
                        onSortClick={() => {}}
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true} xs={2}>
                    <SymphonySortableHeader
                        headerTitle="Price"
                        headerValue="totalAmount"
                        onSortClick={() => {}}
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true} xs={3}>
                    <SymphonySortableHeader
                        headerTitle="Assigned To"
                        headerValue=""
                    />
                </SymphonySortableHeaderGrid>
            </SymphonySortableHeaderGridContainer>
            {loading ? <SymphonyContentLoading overrideHeight="calc(100vh - 324px)!important" /> :
                <>
                    {orders.length === 0 &&
                        <SymphonyContentLoadingContainer height="calc(100vh - 324px)!important">
                            No Order Found
                        </SymphonyContentLoadingContainer>
                    }
                    {map(orders, ({ id, salespersonName, paymentMethod, totalAmount, salespersonId, status  }) => {
                       return (
                            <Link 
                                id={`order-view-${id}`}
                                key={id} 
                                to={`/sales/order/${id}`} 
                                style={{ display: 'flex', textDecoration: 'none', color: '#A2A2A2' }}
                            > 
                                <OrderRowContainer>
                                    <Grid container={true}>
                                        <OrderGrid item={true} xs={3}>
                                            <Box color="#000">{`#${id}`}</Box>
                                        </OrderGrid>
                                        <OrderGrid item={true} xs={2}>
                                            {moment().format('DD/MM/YYYY')}
                                        </OrderGrid>
                                        <OrderGrid item={true} xs={2}>
                                            {paymentMethod}
                                        </OrderGrid>
                                        <OrderGrid item={true} xs={2}>
                                            Php {totalAmount.toFixed(2)}
                                        </OrderGrid>
                                        <OrderGrid 
                                            item={true} 
                                            xs={3} 
                                            onClick={(e) => {
                                                if (!salespersonId) {
                                                    e.preventDefault(); 
                                                    e.stopPropagation(); 
                                                }
                                            }}
                                        >
                                            {/* {salespersonName ?  */}
                                                <Box height="50px" display="flex" alignItems="center">{salespersonName || '-'}</Box>
                                            {/* :
                                                <SymphonyInput
                                                    type="searchabledropdown"
                                                    label=""
                                                    placeholder="Select Salesperson"
                                                    value=""
                                                    onChange={() => {}}
                                                />
                                            } */}
                                        </OrderGrid>
                                    </Grid>
                                </OrderRowContainer>
                            </Link>
                        )
                    })}
                </>
            }
        </OrderListContainer>
    )
}

export default OrderCardList;