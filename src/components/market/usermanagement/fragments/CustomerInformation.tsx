import React from 'react';
import { Address, Customer } from '../../../../store/usermanagement/types';

import '../userManagement.css';


// symphony components
import {
    SymphonyViewTabs,
    SymphonyViewTab,
    SymphonyViewTabsContainer,
    SymphonyViewContentContainer,
    SymphonyViewCommonInfoContainer,
    SymphonyViewInputContainer,
    SymphonySectionHeaderContainer,
    SymphonySectionHeaderTitleContainer
} from '../../../symphony/SymphonyCommonComponents'
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';
import SymphonyInput from '../../../symphony/SymphonyInput';

// hooks
import useScrollableTabs from '../../../symphony/hooks/useScrollableTabs';

interface CustomerInformationProps {
    customer: Customer;
    homeAddress?: Address;
    officeAddress?: Address
}

const CustomerInformation = (props: CustomerInformationProps) => {
    type CommonInfoTab = 'Customer Information' | 'Home Address' | 'Office Address';
    const cRef = React.useRef<HTMLElement>(null);
    const haRef = React.useRef<HTMLElement>(null);
    const oaRef = React.useRef<HTMLElement>(null);
    const [tab, setTab] = React.useState<CommonInfoTab>('Customer Information');
    const [onTabClick, onScroll] = useScrollableTabs([cRef, haRef, oaRef], (target: string) => {
        setTab(target as CommonInfoTab);
    });
    // vars
    const { customer, homeAddress, officeAddress } = props;
    console.log(customer)
    return (
        <SymphonyViewContentContainer height="calc(100vh - 130px)!important">
            <SymphonyViewTabsContainer width="172px!important">
                <SymphonyViewTabs
                    orientation="vertical"
                    value={tab}
                    TabIndicatorProps={{ style: { width: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                >
                    <SymphonyViewTab
                        label="Customer Information"
                        value="Customer Information"
                        onClick={onTabClick}
                        id="customer-view-information"
                    />
                    {
                        homeAddress &&
                            <SymphonyViewTab
                                label="Home Address"
                                value="Home Address"
                                onClick={onTabClick}
                                id="customer-view-home-address"
                            />
                    }
                    
                    {
                        officeAddress &&
                            <SymphonyViewTab
                                label="Office Address"
                                value="Office Address"
                                onClick={onTabClick}
                                id="customer-view-office-address"
                            />
                    }
                    
                </SymphonyViewTabs>
            </SymphonyViewTabsContainer>
            <SymphonyViewCommonInfoContainer onScroll={onScroll}>
                <SymphonySectionHeaderContainer style={{ justifyContent: 'space-between' }} innerRef={cRef}>
                    <SymphonySectionHeaderTitleContainer>
                        Customer Information
                    </SymphonySectionHeaderTitleContainer>
                </SymphonySectionHeaderContainer>
                {/* Inputs */}
                <SymphonyViewInputContainer>
                    <SymphonyInput
                        id="customer-firstname-input"
                        type="text"
                        label="First Name"
                        value={customer.firstName}
                        disabled={true}
                    />
                    <SymphonyInput
                        id="customer-lastname-input"
                        type="text"
                        label="Last Name"
                        value={customer.lastName}
                        disabled={true}
                    />
                    <SymphonyInput
                        id="customer-mobilenumber-input"
                        type="decoratedtext"
                        label="Mobile Number"
                        value={customer.mobileNumber}
                        disabled={true}
                        inputAdornment={customer.countryNumber}
                    />
                    <SymphonyInput
                        id="customer-landlinenumber-input"
                        type="text"
                        label="Landline Number"
                        value={`${typeof customer.areaCode === 'undefined' ? '' : customer.areaCode}${typeof customer.landlineNumber === 'undefined' ? '' : customer.landlineNumber}`}
                        disabled={true}
                    />
                    <SymphonyInput
                        id="customer-email-input"
                        type="text"
                        label="Email"
                        value={customer.email}
                        disabled={true}
                    />
                </SymphonyViewInputContainer>
                {
                    homeAddress &&
                        <>
                            <SymphonySectionHeaderContainer style={{ justifyContent: 'space-between' }} innerRef={haRef}>
                                <SymphonySectionHeaderTitleContainer>
                                    Home Address
                                </SymphonySectionHeaderTitleContainer>
                            </SymphonySectionHeaderContainer>
                            <SymphonyViewInputContainer>
                                <SymphonyInput
                                    id="customer-home-addressline-input"
                                    type="text"
                                    label="Street Address"
                                    value={homeAddress.addressLine}
                                    disabled={true}
                                />
                                <SymphonyInput
                                    id="customer-home-postalcode-input"
                                    type="text"
                                    label="Postal Code"
                                    value={homeAddress.postalCode.toString()}
                                    disabled={true}
                                />
                                <SymphonyInput
                                    id="customer-home-city-input"
                                    type="text"
                                    label="City"
                                    value={homeAddress.city}
                                    disabled={true}
                                />
                                <SymphonyInput
                                    id="customer-home-mobilenumber-input"
                                    type="text"
                                    label="Province"
                                    value={homeAddress.province}
                                    disabled={true}
                                />
                                <SymphonyInput
                                    id="customer-home-landlinenumber-input"
                                    type="text"
                                    label="Country"
                                    value={homeAddress.country}
                                    disabled={true}
                                />
                            </SymphonyViewInputContainer>
                        </>
                }
                    
                {
                    officeAddress &&
                        <>
                            <SymphonySectionHeaderContainer style={{ justifyContent: 'space-between' }} innerRef={oaRef}>
                                <SymphonySectionHeaderTitleContainer>
                                    Office Address
                                </SymphonySectionHeaderTitleContainer>
                            </SymphonySectionHeaderContainer>
                            <SymphonyViewInputContainer>
                                <SymphonyInput
                                    id="customer-office-addressline-input"
                                    type="text"
                                    label="Street Address"
                                    value={officeAddress.addressLine}
                                    disabled={true}
                                />
                                <SymphonyInput
                                    id="customer-office-postalcode-input"
                                    type="text"
                                    label="Postal Code"
                                    value={officeAddress.postalCode.toString()}
                                    disabled={true}
                                />
                                <SymphonyInput
                                    id="customer-office-city-input"
                                    type="text"
                                    label="City"
                                    value={officeAddress.city}
                                    disabled={true}
                                />
                                <SymphonyInput
                                    id="customer-office-mobilenumber-input"
                                    type="text"
                                    label="Province"
                                    value={officeAddress.province}
                                    disabled={true}
                                />
                                <SymphonyInput
                                    id="customer-office-landlinenumber-input"
                                    type="text"
                                    label="Country"
                                    value={officeAddress.country}
                                    disabled={true}
                                />
                            </SymphonyViewInputContainer>
                        </>
                }
            </SymphonyViewCommonInfoContainer>
        </SymphonyViewContentContainer>
    )
}

export default CustomerInformation;