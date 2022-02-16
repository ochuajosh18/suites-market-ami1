import React from 'react';
import { Order } from '../../../../store/ordermanagement/types';

// local
import OrderItemList from './OrderItemList';

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
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

// material
import Box from '@material-ui/core/Box';

// hooks
import useScrollableTabs from '../../../symphony/hooks/useScrollableTabs';

// util
import moment from 'moment';
import map from 'lodash/map';
// import find from 'lodash/find';

interface SalespersonInformationProps {
    order: Order;
    onOrderUpdate: (id: string, status: string) => void;
    isHistory: boolean;
}


const OrderViewInformation = (props: SalespersonInformationProps) => {
    const { order } = props;
    const sections = ['Order Information', 'Billing Address', 'Shipping Address', 'Item List'];
    const refs = sections.map(() => React.createRef<HTMLElement>());
    // const cRef = React.useRef<HTMLElement>(null);
    const [tab, setTab] = React.useState(sections[0]);
    const [onTabClick, onScroll] = useScrollableTabs(refs, (target: string) => {
        if (target && sections.includes(target)) {
            setTab(target);
        }
    });

    const {
        dateCreated,
        customerName,
        mobileNumber,
        landlineNumber,
        paymentMethod,
        items,
        billingAddress,
        shippingAddress
    } = order;

    return (
        <SymphonyViewContentContainer>
            <SymphonyViewTabsContainer>
                <SymphonyViewTabs
                    id="salesperson-common-information-tabs"
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
            <SymphonyViewCommonInfoContainer onScroll={onScroll} height="calc(100vh - 178px)!important">
                <SymphonySectionHeaderContainer style={{ justifyContent: 'space-between' }} innerRef={refs[0]} id="Order Information">
                    <SymphonySectionHeaderTitleContainer>
                        Order Information
                        <SymphonySectionHeaderSubTitleContainer>
                            Placed on {moment(dateCreated as string).format('DD/MM/YYYY [at] hh:mmA')}
                        </SymphonySectionHeaderSubTitleContainer>
                    </SymphonySectionHeaderTitleContainer>
                    {/* {!order.salespersonName ?
                        <Box width="20%" height="54px">
                            <SymphonyInput
                                type="searchabledropdown"
                                label="Assigned To"
                                placeholder="Select Salesperson"
                                value=""
                                onChange={() => {}}
                            />
                        </Box>
                    : */}
                        <Box display="flex" fontSize="13px">
                            <Box display="flex" color="#000" fontWeight="bold" marginRight="8px">Assigned To: </Box>
                            <Box>{order.salespersonName || '-'}</Box>
                        </Box>
                    {/* } */}
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
                <SymphonySectionHeaderContainer innerRef={refs[1]} id="Billing Address">
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
                <SymphonySectionHeaderContainer innerRef={refs[2]}  id="Shipping Address">
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
                <SymphonySectionHeaderContainer innerRef={refs[3]} id="Item List">
                    <SymphonySectionHeaderTitleContainer>
                        Item List
                    </SymphonySectionHeaderTitleContainer>
                </SymphonySectionHeaderContainer>
                {/* Item List */}
                <OrderItemList items={items} />
            </SymphonyViewCommonInfoContainer>
        </SymphonyViewContentContainer>
    )
}

export default OrderViewInformation;