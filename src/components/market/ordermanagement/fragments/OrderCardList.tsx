import React from 'react';
import { Link } from 'react-router-dom';
import { Order, SortOrder} from '../../../../store/ordermanagement/types';
import { 
    OrderListContainer,
    OrderRowContainer,
    OrderGrid,
    OrderHeaderGrid,
    OrderHeaderGridContainer,
    OrderHeaderItem,
    OrderStatusSelect
} from './OrderManagementComponents';
import { SymphonyContentLoadingContainer } from '../../../symphony/SymphonyCommonComponents';
import SymphonyContentLoading from '../../../symphony/SymphonyContentLoading';

import ColoredTag from './ColoredTag'

// material
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

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
    currency: string;
}

const statusList = {
    UNPAID: ['Paid', 'Cancelled'],
    PAID: ['Pending', 'Cancelled'],
    PENDING: ['Ready To Ship', 'Cancelled'],
    READY_TO_SHIP: ['Shipped']
}
const readOnlyStatusList = ['Cancelled', 'Delivered', 'Shipped', 'Received']

const OrderCardList = ({ orders, activeSort, activeSortOrder, onSortClick, onOrderUpdate, loading, isHistory, currency}: OrderCardListProps) => {
    const RenderSortHeader = ({ headerTitle, headerValue }: { headerTitle: string, headerValue: string }) => {
        return (
            <OrderHeaderItem onClick={() => onSortClick(headerValue, !activeSortOrder ||  headerValue !== activeSort ? 'ASC' : activeSortOrder === 'ASC'? 'DESC' : '')  }>
                {headerTitle}
                {activeSort ?
                    <>
                        {(activeSort === headerValue) &&
                            <>
                                {activeSortOrder === 'ASC' ? 
                                    <KeyboardArrowDownIcon />
                                :
                                    <KeyboardArrowUpIcon />
                                }
                            </>
                        }
                    </>
                :
                    <KeyboardArrowDownIcon />
                }
            </OrderHeaderItem>
        )
    }

    return (
        <OrderListContainer>
            {/* Cards here */}
            <OrderHeaderGridContainer container={true}>
                <OrderHeaderGrid item={true} xs={3}>
                    <RenderSortHeader
                        headerTitle="Order Number"
                        headerValue="id"
                    />
                </OrderHeaderGrid>
                <OrderHeaderGrid item={true} xs={2}>
                    <RenderSortHeader
                        headerTitle="Payment"
                        headerValue="paymentMethod"
                    />
                </OrderHeaderGrid>
                <OrderHeaderGrid item={true} xs={2}>
                <RenderSortHeader
                        headerTitle="Price"
                        headerValue="totalAmount"
                    />
                </OrderHeaderGrid>
                <OrderHeaderGrid item={true} xs={2}>
                    <RenderSortHeader
                        headerTitle="Last Updated"
                        headerValue="dateUpdated"
                    />
                </OrderHeaderGrid>
                <OrderHeaderGrid item={true} xs={3}>
                    <RenderSortHeader
                        headerTitle="Order Status"
                        headerValue="status"
                    />
                </OrderHeaderGrid>
            </OrderHeaderGridContainer>
            {loading ? <SymphonyContentLoading overrideHeight="calc(100vh - 314px)!important" /> :
                <>
                    {orders.length === 0 &&
                        <SymphonyContentLoadingContainer height="calc(100vh - 314px)!important">
                            No Order Found
                        </SymphonyContentLoadingContainer>
                    }
                    {map(orders, ({ id, orderNumber, dateCreated, paymentMethod, totalAmount, dateUpdated, status  }) => {
                        const stat = status as string;
                        const orderStatus = stat.indexOf('_') > -1 ? stat.split('_').map((s) => `${s[0]}${s.substr(1).toLowerCase()} `).join('').trim() : `${stat[0]}${stat.substr(1).toLowerCase()}`;
                        return (
                            <Link 
                                id={`order-view-${id}`}
                                key={id} 
                                to={`/market/order/${id}`} 
                                style={{ display: 'flex', textDecoration: 'none', color: 'unset' }}
                            > 
                                <OrderRowContainer>
                                    <Grid container={true}>
                                        <OrderGrid item={true} xs={3}>
                                            {`#${id}`}
                                            <Box color="#A2A2A2">
                                                {`Ordered on ${moment(dateCreated).format('DD/MM/YYYY')}`}
                                            </Box>
                                        </OrderGrid>
                                        <OrderGrid item={true} xs={2} color="#A2A2A2">
                                            {paymentMethod}
                                        </OrderGrid>
                                        <OrderGrid item={true} xs={2}>
                                            {currency} {totalAmount.toFixed(2)}
                                        </OrderGrid>
                                        <OrderGrid item={true} xs={2}>
                                            {moment(dateUpdated).format('DD/MM/YYYY')}
                                        </OrderGrid>
                                        <OrderGrid item={true} xs={3}>
                                            <OrderStatusSelect
                                                id={`order-${id.toLowerCase().replace(/ +/g, '_')}-status-update-select`}
                                                disabled={isHistory || readOnlyStatusList.includes(orderStatus)}
                                                onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                                    onOrderUpdate(id, e.target.value as string);
                                                }}
                                                MenuProps={{
                                                    anchorOrigin: {
                                                        vertical: 'bottom',
                                                        horizontal: 'center',
                                                    },
                                                    transformOrigin: {
                                                        vertical: 'top',
                                                        horizontal: 'center',
                                                    }
                                                }}
                                                IconComponent={KeyboardArrowDownIcon}
                                                value={orderStatus}
                                                renderValue={(v) => (
                                                    <Box fontSize="12px" paddingLeft="8px" display="flex" alignItems="center">
                                                        <ColoredTag value={v as string} />
                                                        {v as string}
                                                    </Box>
                                                )}
                                            >
                                                {map(statusList[stat], (s) => (
                                                    <MenuItem key={s} value={s} style={{ fontSize: 12 }}>
                                                        <ColoredTag value={s} />
                                                        {s}
                                                    </MenuItem>
                                                ))}
                                            </OrderStatusSelect>
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