import React from 'react';
import { OrderItem } from '../../../../store/ordermanagement/types';

import {
    OrderItemListContainer,
    OrderItemListHeaderGrid,
    OrderItemListRowGrid,
    OrderItemImageContainer
} from './OrderManagementComponents';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import map from 'lodash/map';
import sumBy from 'lodash/sumBy';

interface OrderItemListProps {
    items: Array<OrderItem>;
}

const OrderItemList = ({ items }: OrderItemListProps ) => {
    const discounts = sumBy(items, (i) => (i.price - i.discountPrice) || 0);
    const subtotal = sumBy(items, (i) => i.price || 0);
    const total = sumBy(items, (i) => i.totalAmount || 0);
    return (
        <OrderItemListContainer>
            <Grid container={true}>
                <OrderItemListHeaderGrid item={true} xs={5}>
                    SKU
                </OrderItemListHeaderGrid>
                <OrderItemListHeaderGrid item={true} xs={1} className="centered-column">
                    Size
                </OrderItemListHeaderGrid>
                <OrderItemListHeaderGrid item={true} xs={1} className="centered-column">
                    Color
                </OrderItemListHeaderGrid>
                <OrderItemListHeaderGrid item={true} xs={1} className="centered-column">
                    Price
                </OrderItemListHeaderGrid>
                <OrderItemListHeaderGrid item={true} xs={1} className="centered-column">
                    Qty
                </OrderItemListHeaderGrid>
                <OrderItemListHeaderGrid item={true} xs={1} className="centered-column">
                    Discount
                </OrderItemListHeaderGrid>
                <OrderItemListHeaderGrid item={true} xs={2} className="centered-column">
                    Total
                </OrderItemListHeaderGrid>
            </Grid>
            {map(items, (i) => (
                <OrderItemListRowGrid container={true} key={i.productSkuId}>
                    <Grid item={true} xs={5}>
                        <OrderItemImageContainer>
                            <img src={i.image} alt="" />
                        </OrderItemImageContainer>
                        <Box display="flex" flexDirection="column" marginLeft="8px">
                            <Box>{i.name}</Box>
                            <Box color="#959595">-</Box>
                        </Box>
                    </Grid>
                    <Grid item={true} xs={1} className="centered-column">
                        {i.size || '-'}
                    </Grid>
                    <Grid item={true} xs={1} className="centered-column">
                        {i.color || '-'}
                    </Grid>
                    <Grid item={true} xs={1} className="centered-column">
                        Php {i.price.toFixed(2)}
                    </Grid>
                    <Grid item={true} xs={1} className="centered-column">
                        x{i.qty}
                    </Grid>
                    <Grid item={true} xs={1} className="centered-column">
                        {i.discountPrice ? `Php ${(i.price - i.discountPrice).toFixed(2)}` : '-'}
                    </Grid>
                    <Grid item={true} xs={2} className="centered-column">
                        Php {i.totalAmount.toFixed(2)}
                    </Grid>
                </OrderItemListRowGrid>
            ))}
            <Box width="100%" display="flex" alignItems="flex-end" flexDirection="column" fontSize="12px" margin="16px 0 32px" paddingRight="16px" boxSizing="border-box">
                <Box display="flex" justifyContent="space-between" width="200px" flexWrap="wrap" marginBottom="8px">
                    <Box color="#959595">Subtotal</Box>
                    <Box fontWeight="bold">Php {(subtotal).toFixed(2)}</Box>
                </Box>
                <Box display="flex" justifyContent="space-between" width="200px" flexWrap="wrap" marginBottom="8px">
                    <Box color="#959595">Discount</Box>
                    <Box fontWeight="bold">Php {(discounts).toFixed(2)}</Box>
                </Box>
                <Box display="flex" justifyContent="space-between" width="200px" flexWrap="wrap">
                    <Box color="#959595">Total</Box>
                    <Box fontWeight="bold">Php {(total).toFixed(2)}</Box>
                </Box>
            </Box>
        </OrderItemListContainer>
    )
}

export default OrderItemList;