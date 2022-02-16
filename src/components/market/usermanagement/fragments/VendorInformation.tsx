import React from 'react';
import { Vendor } from '../../../../store/usermanagement/types';

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
    SymphonySectionHeaderTitleContainer,
    SymphonyInputGridContainer,
    SymphonyInputLabelGridContainer
} from '../../../symphony/SymphonyCommonComponents'
import {
    StatusApprovedOptionButton,
    StatusPendingOptionButton,
    StatusDisapprovedOptionButton,
    MenuItemText
} from './UserManagementComponents';

import SymphonyInput from '../../../symphony/SymphonyInput';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

// material
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import CirclePendingImage from '../../../../assets/images/status/circlePending.png';
import CircleDispprovedImage from '../../../../assets/images/status/circleDisapproved.png';
import PendingImage from '../../../../assets/images/status/pending.png';
import ApprovedImage from '../../../../assets/images/status/approved.png';
import DispprovedImage from '../../../../assets/images/status/disapproved.png';

// hooks
import useScrollableTabs from '../../../symphony/hooks/useScrollableTabs';

interface VendorInformationProps {
    vendor: Vendor;
    setVendorStatusUpdate: (status: string) => void;
}

const VendorInformation = (props: VendorInformationProps) => {
    const { vendor, setVendorStatusUpdate } = props;

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (status: string) => {
        if(status === "Approved" || status === "Rejected") {
            setVendorStatusUpdate(status)
        };
        setAnchorEl(null);
    };

    type CommonInfoTab = 'Vendor Information' | 'Address';
    const vRef = React.useRef<HTMLElement>(null);
    const aRef = React.useRef<HTMLElement>(null);
    const [tab, setTab] = React.useState<CommonInfoTab>('Vendor Information');
    const [onTabClick, onScroll] = useScrollableTabs([vRef, aRef], (target: string) => {
        setTab(target as CommonInfoTab);
    });
    // vars
    

    return (
        <SymphonyViewContentContainer height="calc(100vh - 130px)!important">
            <SymphonyViewTabsContainer width="172px!important">
                <SymphonyViewTabs
                    orientation="vertical"
                    value={tab}
                    TabIndicatorProps={{ style: { width: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                >
                    <SymphonyViewTab
                        label="Vendor Information"
                        value="Vendor Information"
                        onClick={onTabClick}
                        id="vendor-view-information"
                    />
                    <SymphonyViewTab
                        label="Address"
                        value="Address"
                        onClick={onTabClick}
                        id="vendor-view-address"
                    />
                </SymphonyViewTabs>
            </SymphonyViewTabsContainer>
            <SymphonyViewCommonInfoContainer onScroll={onScroll}>
                <SymphonySectionHeaderContainer style={{ justifyContent: 'space-between' }} innerRef={vRef}>
                    <SymphonySectionHeaderTitleContainer>
                        Vendor Information
                    </SymphonySectionHeaderTitleContainer>
                </SymphonySectionHeaderContainer>
                {/* Inputs */}
                <SymphonyViewInputContainer>
                    <SymphonyInput
                        id="vendor-firstname-input"
                        type="text"
                        label="First Name"
                        value={vendor.firstName}
                        disabled={true}
                    />
                    <SymphonyInput
                        id="vendor-lastname-input"
                        type="text"
                        label="Last Name"
                        value={vendor.lastName}
                        disabled={true}
                    />
                    <SymphonyInput
                        id="vendor-companyname-input"
                        type="text"
                        label="Company Name"
                        value={vendor.companyName}
                        disabled={true}
                    />
                    <SymphonyInput
                        id="vendor-email-input"
                        type="text"
                        label="Email"
                        value={vendor.email}
                        disabled={true}
                    />
                    <SymphonyInput
                        id="vendor-mobilenumber-input"
                        type="decoratedtext"
                        label="Mobile Number"
                        value={vendor.mobileNumber}
                        disabled={true}
                        inputAdornment={vendor.countryNumber}
                    />
                    <SymphonyInput
                        id="vendor-landlinenumber-input"
                        type="text"
                        label="Landline Number"
                        value={`${typeof vendor.areaCode === 'undefined' ? '' : vendor.areaCode}${typeof vendor.landlineNumber === 'undefined' ? '' : vendor.landlineNumber}`}
                        disabled={true}
                    />
                    <SymphonyInputGridContainer container={true}>
                        <SymphonyInputLabelGridContainer item={true} xs={12}>
                            Approval Status
                        </SymphonyInputLabelGridContainer>

                        {
                            vendor.status === "Pending" &&
                                <StatusPendingOptionButton
                                    aria-controls="fade-menu" 
                                    aria-haspopup="true" 
                                    onClick={handleClick}
                                >
                                    <Grid container={true}>
                                        <img
                                            src={CirclePendingImage}
                                            className="status-img-size"
                                            alt=""
                                        />
                                        Pending
                                    </Grid>
                                    <ExpandMore style={{ color: '#96989e' }}/>
                                </StatusPendingOptionButton>
                        }
                        {
                            vendor.status === "Approved" &&
                                <StatusApprovedOptionButton
                                    disabled={true}
                                >
                                    <CheckCircleIcon 
                                        className="check-cicle-icon"
                                    />
                                    Approved
                                </StatusApprovedOptionButton>
                        }
                        {
                            vendor.status === "Rejected" &&
                                <StatusDisapprovedOptionButton
                                    disabled={true}
                                >
                                    <img
                                        src={CircleDispprovedImage}
                                        className="status-img-size"
                                        alt=""
                                    />
                                    Rejected
                                </StatusDisapprovedOptionButton>
                        }

                        <Menu
                            id="fade-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={() => {
                                handleClose('');
                            }}
                            getContentAnchorEl={null}
                            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                            transformOrigin={{vertical: 'top', horizontal: 'center'}}
                            PaperProps={{
                                style: {
                                    width: 150,
                                    borderRadius: 20
                                }
                            }}
                        >
                            <MenuItem 
                                onClick={() => {
                                    handleClose('Pending');
                                }} 
                                style={{ justifyContent: 'space-between' }}
                            >
                                <Grid container={true}>
                                    <img
                                        src={PendingImage}
                                        className="status-img-size"
                                        alt=""
                                    />
                                    <MenuItemText>PENDING</MenuItemText>
                                </Grid>
                                <ExpandLess style={{ color: '#96989e' }}/>
                            </MenuItem>
                            <MenuItem 
                                id="approve-vendor-menu-item"
                                onClick={() => {
                                    handleClose('Approved');
                                }}
                            >
                                <img
                                    src={ApprovedImage}
                                    className="status-img-size"
                                    alt=""
                                />
                                <MenuItemText>APPROVE</MenuItemText>
                            </MenuItem>
                            <MenuItem 
                                id="reject-vendor-menu-item"
                                onClick={() => {
                                    handleClose('Rejected');
                                }}
                            >
                                <img
                                    src={DispprovedImage}
                                    className="status-img-size"
                                    alt=""
                                />
                                <MenuItemText>DISSAPPROVE</MenuItemText>
                            </MenuItem>
                        </Menu>
                    </SymphonyInputGridContainer>
                    <Box marginTop="20px">
                        {
                            vendor.status !== "Pending" &&
                                <SymphonyInput
                                    id="vendor-remarks-input"
                                    type="multiline"
                                    label="Remarks"
                                    value={vendor.remarks}
                                    disabled={true}
                                />
                        }
                    </Box>
                </SymphonyViewInputContainer>
                <SymphonySectionHeaderContainer style={{ justifyContent: 'space-between' }} innerRef={aRef}>
                    <SymphonySectionHeaderTitleContainer>
                        Address
                    </SymphonySectionHeaderTitleContainer>
                </SymphonySectionHeaderContainer>
                <SymphonyViewInputContainer>
                    <SymphonyInput
                        id="vendor-addressline-input"
                        type="text"
                        label="Street Address"
                        value={vendor.addressLine}
                        disabled={true}
                    />
                    <SymphonyInput
                        id="vendor-postalcode-input"
                        type="text"
                        label="Postal Code"
                        value={vendor.postalCode.toString()}
                        disabled={true}
                    />
                    <SymphonyInput
                        id="vendor-city-input"
                        type="text"
                        label="City"
                        value={vendor.city}
                        disabled={true}
                    />
                    <SymphonyInput
                        id="vendor-mobilenumber-input"
                        type="text"
                        label="Province"
                        value={vendor.province}
                        disabled={true}
                    />
                    <SymphonyInput
                        id="vendor-landlinenumber-input"
                        type="text"
                        label="Country"
                        value={vendor.country}
                        disabled={true}
                    />
                </SymphonyViewInputContainer>
            </SymphonyViewCommonInfoContainer>
        </SymphonyViewContentContainer>
    )
}

export default VendorInformation;