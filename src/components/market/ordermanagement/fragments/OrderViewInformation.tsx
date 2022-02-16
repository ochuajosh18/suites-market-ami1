import React from 'react';
import { Order } from '../../../../store/ordermanagement/types';

// symphony components
import {
    SymphonyViewTabs,
    SymphonyViewTab,
    SymphonyViewTabsContainer,
    SymphonyViewContentContainer,
    SymphonyViewCommonInfoContainer,
    SymphonyViewInputContainer,
    SymphonySectionHeaderContainer,
    SymphonySectionHeaderTitleContainer,
    SymphonySectionHeaderSubTitleContainer
} from '../../../symphony/SymphonyCommonComponents'

import SymphonyInput from '../../../symphony/SymphonyInput';

// local
import { 
    OrderStatusSelect, 
    OrderStatusSelectContainer, 
    OrderJourneyIconContainer, 
    OrderJourneyContainer,
    OrderJourneyInformationItem
} from './OrderManagementComponents';
import OrderItemList from './OrderItemList';
import ColoredTag from './ColoredTag';

// material
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

// hooks
import useScrollableTabs from '../../../symphony/hooks/useScrollableTabs';

// util
import moment from 'moment';
import map from 'lodash/map';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';
import { Button } from '@material-ui/core';
// import find from 'lodash/find';

interface SalespersonInformationProps {
    order: Order;
    onOrderUpdate: (id: string, status: string) => void;
    isHistory: boolean;
    historyOpen: boolean;
    onHistoryButtonClick: () => void;
    currency: string;
}


const OrderViewInformation = (props: SalespersonInformationProps) => {
    const { order, onOrderUpdate, isHistory, historyOpen, onHistoryButtonClick } = props;
    const sections = ['Order Status', 'Updates', 'Order Information', 'Billing Address', 'Shipping Address', 'Item List'];
    const refs = sections.map(() => React.createRef<HTMLElement>());
    // const cRef = React.useRef<HTMLElement>(null);
    const [tab, setTab] = React.useState(sections[0]);
    const [onTabClick, onScroll] = useScrollableTabs(refs, (target: string) => {
        if (target && sections.includes(target)) {
            setTab(target);
        }
    });

    const {
        id,
        dateCreated,
        customerName,
        mobileNumber,
        landlineNumber,
        paymentMethod,
        items,
        status,
        billingAddress,
        shippingAddress,
        history
    } = order;

    const statusList = {
        UNPAID: ['Paid', 'Cancelled'],
        PAID: ['Pending', 'Cancelled'],
        PENDING: ['Ready To Ship', 'Cancelled'],
        READY_TO_SHIP: ['Shipped']
    }
    const readOnlyStatusList = ['Cancelled', 'Delivered', 'Shipped', 'Received']
    const stat = status as string;
    const orderStatus = stat.indexOf('_') > -1 ? stat.split('_').map((s) => `${s[0]}${s.substr(1).toLowerCase()} `).join('').trim() : `${stat[0]}${stat.substr(1).toLowerCase()}`;
    const orderReceived = stat === 'RECEIVED'
    const orderCancelled = stat === 'CANCELLED'
    const orderFailed = stat === 'FAILED_DELIVERY'
    const first = ['UNPAID', 'PAID', 'PENDING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'RECEIVED', 'CANCELLED', 'FAILED_DELIVERY'];
    const second = ['PENDING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'RECEIVED', 'CANCELLED', 'FAILED_DELIVERY'];
    const third = ['READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'RECEIVED',  'CANCELLED', 'FAILED_DELIVERY'];
    const fourth = ['SHIPPED', 'DELIVERED', 'RECEIVED', 'FAILED_DELIVERY'];
    const fifth = ['DELIVERED', 'RECEIVED', 'FAILED_DELIVERY'];
    const activeBackgroundWidth = () => {
        let counter = -1;
        counter += Number(first.includes(stat));
        counter += Number(second.includes(stat));
        counter += Number(third.includes(stat));
        counter += Number(fourth.includes(stat));
        counter += Number(fifth.includes(stat));
        if(orderCancelled) {
            return history.length > 3 ? `calc(50% + 24px)` : history.length === 3 ? `calc(25% + 32px)` : '0%';
        }
        return Boolean(counter) ? `calc(${counter * 25}% + ${40-(8 * counter)}px)` : '0%'; //determines the width of active background color
    };

    return (
        <SymphonyViewContentContainer height="calc(100vh - 130px)!important">
            <SymphonyViewTabsContainer>
                <SymphonyViewTabs
                    id="orderview-information-tabs"
                    orientation="vertical"
                    value={tab}
                    TabIndicatorProps={{ style: { width: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                >
                    {map(sections, (s) => {
                        return (
                            <SymphonyViewTab
                                key={s}
                                label={s}
                                value={s}
                                onClick={onTabClick}
                                id={`${s}-tab`}
                            />
                        )
                    })}
                </SymphonyViewTabs>
            </SymphonyViewTabsContainer>
            <SymphonyViewCommonInfoContainer onScroll={onScroll} height="calc(100vh - 176px)!important">
                <SymphonySectionHeaderContainer innerRef={refs[0]}>
                    <SymphonySectionHeaderTitleContainer>
                        Order Status
                    </SymphonySectionHeaderTitleContainer>
                </SymphonySectionHeaderContainer>
                <OrderJourneyContainer>
                    <Box height="34px" width={activeBackgroundWidth()} position="relative" top="-4px" left="-4px" borderRadius="20px" style={{backgroundColor: "#4C89F5"}}/>
                    <Box display="flex" justifyContent="space-between" padding="0 8px" boxSizing="border-box" position="relative" top="-32px" >
                        <OrderJourneyIconContainer style={{ backgroundColor: history.length > 2 ? "#FFFFFF" : orderCancelled ? "#FF4D4D" : "#4C89F5", color: history.length > 2 ? "#4C89F5" : "#FFFFFF" }}>
                            {orderCancelled && history.length <= 2 ? 
                                <ClearIcon style={{width: 15, height: 15}}/> 
                            :   <DoneIcon style={{width: 15, height: 15}}/>}
                            
                            <OrderJourneyInformationItem left="0px" bottom="-54px">
                                <Box>{orderCancelled && history.length <= 2 ? "Order Cancelled" : "Order Created"}</Box>
                                {
                                    history.length > 1 ?
                                        <>
                                            <Box color="#959595">{moment(history[1].date as string).format("DD.MM.YYYY")}</Box>
                                            <Box color="#959595">{moment(history[1].date as string).format("hh:mmA")}</Box>
                                        </>
                                    :
                                        <>
                                            <Box color="#959595">{moment(history[history.length - 1].date as string).format("DD.MM.YYYY")}</Box>
                                            <Box color="#959595">{moment(history[history.length - 1].date as string).format("hh:mmA")}</Box>
                                        </>
                                }
                            </OrderJourneyInformationItem>
                        </OrderJourneyIconContainer>
                        {
                            history.length >= 3 ?
                                <OrderJourneyIconContainer style={{ 
                                    backgroundColor: orderCancelled && history.length === 3 ? "#FF4D4D" : "#FFFFFF", 
                                    color: orderCancelled && history.length === 3 ? "#FFFFFF" : "#4C89F5"
                                }}>
                                    {orderCancelled && history.length <= 3 ? <ClearIcon style={{width: 15, height: 15}}/>  :   <DoneIcon style={{width: 15, height: 15}}/>}
                                    <OrderJourneyInformationItem left="0px" bottom="-54px">
                                        <>
                                            <Box>{stat === "CANCELLED" && history.length === 3 ? "Order Cancelled" : "Pending"}</Box>
                                            <Box color="#959595">{moment(history[2].date as string).format("DD.MM.YYYY")}</Box>
                                            <Box color="#959595">{moment(history[2].date as string).format("hh:mmA")}</Box>
                                        </>
                                    </OrderJourneyInformationItem>
                                </OrderJourneyIconContainer>
                            :
                                <Box style={{ borderRadius: "100%", width: 20, height: 20, backgroundColor: "#959595" }} />
                        }
                        {
                            history.length >= 4 ?
                                <OrderJourneyIconContainer style={{ backgroundColor: orderCancelled ? "#FF4D4D" : "#FFFFFF", color: orderCancelled ? "#FFFFFF" : "#4C89F5"}}>
                                    {orderCancelled ? <ClearIcon style={{width: 15, height: 15}}/>  :   <DoneIcon style={{width: 15, height: 15}}/>}
                                    <OrderJourneyInformationItem left="0px" bottom="-54px">
                                        <>
                                            <Box>{stat === "CANCELLED" && history.length === 4 ? "Order Cancelled" : "Ready To Ship"}</Box>
                                            <Box color="#959595">{moment(history[3].date as string).format("DD.MM.YYYY")}</Box>
                                            <Box color="#959595">{moment(history[3].date as string).format("hh:mmA")}</Box>
                                        </>
                                    </OrderJourneyInformationItem>
                                </OrderJourneyIconContainer>
                            :
                                <Box style={{ borderRadius: "100%", width: 20, height: 20, backgroundColor: "#959595" }} />
                        }
                        {
                            history.length >= 5 ?
                                <OrderJourneyIconContainer style={{ backgroundColor: "#FFFFFF", color: "#4C89F5" }}>
                                    <DoneIcon style={{width: 15, height: 15}}/>
                                    <OrderJourneyInformationItem left="0px" bottom="-54px">
                                        <>
                                            <Box>Shipped</Box>
                                            <Box color="#959595">{moment(history[4].date as string).format("DD.MM.YYYY")}</Box>
                                            <Box color="#959595">{moment(history[4].date as string).format("hh:mmA")}</Box>
                                        </>
                                    </OrderJourneyInformationItem>
                                </OrderJourneyIconContainer>
                            :
                                <Box style={{ borderRadius: "100%", width: 20, height: 20, backgroundColor: "#959595" }} />
                        }
                        {
                            history.length >= 6 ?
                                <OrderJourneyIconContainer style={{ backgroundColor: orderFailed ? "#edb869" : "#FFFFFF", color: orderFailed ? "#FFFFFF" : "#4C89F5"}}>
                                    {orderFailed ? <PriorityHighIcon style={{width: 15, height: 15}}/> :   <DoneIcon style={{width: 15, height: 15}}/>}
                                    <Box position="absolute" minWidth="100px" color="black" display={orderReceived ? "block" : "flex"} flexDirection="column" alignItems="flex-end" fontSize="12px" 
                                        right={orderReceived ? "unset" : "0px"} left={orderReceived ? "0px" : "unset"} bottom="-54px"
                                    >
                                        <Box>{orderFailed ? "Failed Delivery" : "Delivered"}</Box>
                                        <Box color="#959595">{moment(history[5].date as string).format("DD.MM.YYYY")}</Box>
                                        <Box color="#959595">{moment(history[5].date as string).format("hh:mmA")}</Box>
                                    </Box>
                                </OrderJourneyIconContainer>
                            :
                                orderCancelled ? 
                                    <Box style={{ borderRadius: "100%", width: 20, height: 20, backgroundColor: "#959595" }} /> 
                                : 
                                    <OrderJourneyIconContainer style={{ border: "2px solid #4C89F5", backgroundColor: "#FFFFFF"}}/>
                        }
                        {
                            orderReceived &&
                                <OrderJourneyIconContainer style={{ backgroundColor: "#01ad4d", color: "#FFFFFF" }}>
                                    <DoneIcon style={{width: 15, height: 15}}/>
                                    <Box position="absolute" minWidth="100px" color="black" display="flex" flexDirection="column" alignItems="flex-end" fontSize="12px" right="0px" bottom="-54px">
                                        {
                                            history.length >= 6 &&
                                                <>
                                                    <Box>Received</Box>
                                                    <Box color="#959595">{moment(history[5].date as string).format("DD.MM.YYYY")}</Box>
                                                    <Box color="#959595">{moment(history[5].date as string).format("hh:mmA")}</Box>
                                                </>
                                        }
                                    </Box>
                                </OrderJourneyIconContainer>
                        }
                    </Box>
                </OrderJourneyContainer>
                <SymphonySectionHeaderContainer innerRef={refs[1]}>
                    <SymphonySectionHeaderTitleContainer>
                        Updates
                    </SymphonySectionHeaderTitleContainer>
                </SymphonySectionHeaderContainer>
                <Box marginTop={2} marginBottom={5}>
                    <Grid container={true} style={{color: "#959595", fontSize: 12, height: "25px", borderBottom: "1px solid #EDEDED"}}>
                        <Grid item={true} xs={3}>
                            Date & Time
                        </Grid>
                        <Grid item={true} xs={7}>
                            Description
                        </Grid>
                        {history.length > 3 &&
                            <Grid item={true} xs={2}>
                                <Button onClick={onHistoryButtonClick} style={{top: "-12px", float: "right", color: "#959595", fontSize: "10px"}}>
                                    {historyOpen ?
                                        <>Hide Details <ExpandLess/></>
                                    :
                                        <>Show Full Details <ExpandMore/></>
                                    }
                                </Button>
                            </Grid>
                        }
                        
                    </Grid>
                    <Collapse in={historyOpen} collapsedHeight={170} timeout="auto">
                        {map(history, (i, index) => (
                            <Grid key={`order-update-item-${index}`} className="order-update-item" container={true} style={{fontSize: 12, paddingTop: 20, paddingBottom: 20, borderBottom: "1px solid #EDEDED"}}>
                                <Grid item={true} xs={3}>
                                    {moment(i.date as string).format("DD.MM.YYYY hh:mmA")}
                                </Grid>
                                <Grid item={true} xs={9}>
                                    {i.update}
                                </Grid>
                            </Grid>
                        ))}
                    </Collapse>
                </Box>
                <SymphonySectionHeaderContainer style={{ justifyContent: 'space-between' }} innerRef={refs[2]}>
                    <SymphonySectionHeaderTitleContainer>
                        Order Information
                        <SymphonySectionHeaderSubTitleContainer>
                            Placed on {moment(dateCreated as string).format('DD/MM/YYYY [at] hh:mmA')}
                        </SymphonySectionHeaderSubTitleContainer>
                    </SymphonySectionHeaderTitleContainer>
                    {!isHistory && 
                        <OrderStatusSelectContainer>
                            <OrderStatusSelect
                                id={`order-${id.toLowerCase().replace(/ +/g, '_')}-status-update-select`}
                                disabled={readOnlyStatusList.includes(orderStatus)}
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
                        </OrderStatusSelectContainer>
                    }
                </SymphonySectionHeaderContainer>
                <SymphonyViewInputContainer>
                    <SymphonyInput
                        id="order-customer-name-input"
                        type="text"
                        disabled={true}
                        label="Customer Name"
                        value={customerName || ''}
                    />
                    <SymphonyInput
                        id="order-customer-mobile-input"
                        type="text"
                        disabled={true}
                        label="Mobile Number"
                        value={mobileNumber || ''}
                    />
                    <SymphonyInput
                        id="order-customer-landline-input"
                        type="text"
                        disabled={true}
                        label="Landline Number"
                        value={landlineNumber || ''}
                    />
                    <SymphonyInput
                        id="order-datecreated-input"
                        type="text"
                        disabled={true}
                        label="Order Date & Time"
                        value={moment(dateCreated as string).format('DD/MM/YYYY [at] hh:mmA')}
                    />
                    <SymphonyInput
                        id="order-payment-method-input"
                        type="text"
                        disabled={true}
                        label="Payment Method"
                        value={paymentMethod || ''}
                    />
                </SymphonyViewInputContainer>
                <SymphonySectionHeaderContainer innerRef={refs[3]}>
                    <SymphonySectionHeaderTitleContainer>
                        Billing Address
                    </SymphonySectionHeaderTitleContainer>
                </SymphonySectionHeaderContainer>
                {/* Billing Address Inputs */}
                <SymphonyViewInputContainer>
                    <SymphonyInput
                        id="order-billing-addressline-input"
                        type="text"
                        disabled={true}
                        label="Address"
                        value={billingAddress ? billingAddress.addressLine : ''}
                    />
                    <SymphonyInput
                        id="order-billing-city-input"
                        type="text"
                        disabled={true}
                        label="City"
                        value={billingAddress ? billingAddress.city : ''}
                    />
                    <SymphonyInput
                        id="order-billing-province-input"
                        type="text"
                        disabled={true}
                        label="Province"
                        value={billingAddress ? billingAddress.province : ''}
                    />
                    <SymphonyInput
                        id="order-billing-country-input"
                        type="text"
                        disabled={true}
                        label="Country"
                        value={billingAddress ? billingAddress.country : ''}
                    />
                </SymphonyViewInputContainer>
                <SymphonySectionHeaderContainer innerRef={refs[4]}>
                    <SymphonySectionHeaderTitleContainer>
                        Shipping Address
                    </SymphonySectionHeaderTitleContainer>
                </SymphonySectionHeaderContainer>
                {/* Shipping Address Inputs */}
                <SymphonyViewInputContainer>
                    <SymphonyInput
                        id="order-shipping-billing-addressline-input"
                        type="text"
                        disabled={true}
                        label="Address"
                        value={shippingAddress ? shippingAddress.addressLine : ''}
                    />
                    <SymphonyInput
                        id="order-shipping-city-input"
                        type="text"
                        disabled={true}
                        label="City"
                        value={shippingAddress ? shippingAddress.city : ''}
                    />
                    <SymphonyInput
                        id="order-shipping-province-input"
                        type="text"
                        disabled={true}
                        label="Province"
                        value={shippingAddress ? shippingAddress.province : ''}
                    />
                    <SymphonyInput
                        id="order-shipping=country-input"
                        type="text"
                        disabled={true}
                        label="Country"
                        value={shippingAddress ? shippingAddress.country : ''}
                    />
                </SymphonyViewInputContainer>
                <SymphonySectionHeaderContainer innerRef={refs[5]}>
                    <SymphonySectionHeaderTitleContainer>
                        Item List
                    </SymphonySectionHeaderTitleContainer>
                </SymphonySectionHeaderContainer>
                {/* Item List */}
                <OrderItemList items={items} currency={props.currency}/>
            </SymphonyViewCommonInfoContainer>
        </SymphonyViewContentContainer>
    )
}

export default OrderViewInformation;