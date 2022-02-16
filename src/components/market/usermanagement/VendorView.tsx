import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, match } from 'react-router';
import { AppState } from '../../../store';
import { SystemState } from '../../../store/system/types';
import { setSystemState } from '../../../store/system/actions';
import { UserManagementState } from '../../../store/usermanagement/types';
import { loadVendor, loadVendorList, setUserManagementState, updateVendorStatus } from '../../../store/usermanagement/actions';

// local
import VendorInformation from './fragments/VendorInformation';
import VendorApprovalDialog from './fragments/VendorApprovalDialog';

// common components
import {
    SymphonyContainer,
    SymphonyViewContainer,
    SymphonyTabsContainer,
    SymphonyTabs,
    SymphonyTab
}  from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout  from '../../symphony/SymphonyLayout';
import BackButton  from '../../symphony/SymphonyBackButton';
import SymphonyContentLoading from '../../symphony/SymphonyContentLoading';
import { toastError } from '../../../modules/Toast';

// material
import Box from '@material-ui/core/Box';

// util
import find from 'lodash/find';
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';

interface MatchParams {
    params: { vendorId: string; };
}

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

interface VendorViewProps {
    setSystemState: typeof setSystemState;
    setUserManagementState: typeof setUserManagementState;
    loadVendorList: typeof loadVendorList;
    loadVendor: typeof loadVendor;
    updateVendorStatus: typeof updateVendorStatus;
    usermanagement: UserManagementState;
    system: SystemState;
}


class VendorView extends React.Component<VendorViewProps & RouteParams> {
    componentDidMount = () => {
        const { vendorId } = this.props.match.params;
        const vendor = find(this.props.usermanagement.vendors, { id: vendorId });
        this.props.setSystemState({
            header: <Box display="flex">
                <BackButton to="/market/vendor" />
                <Box fontSize="36px">
                    {vendor ?
                        <>{vendor.companyName}</>
                    :
                        <>{'Loading Vendor...'}</>
                    }
                </Box>
            </Box>,
            shallRedirect: false,
            redirectTo: ''
        });
        if (this.props.usermanagement.vendorDetails) {
            this.props.loadVendorList("", this.props.usermanagement.vendorDetails.status);
        }
        this.props.loadVendor(vendorId);
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined });

    _setVendorStatusUpdate = (status: string) => {
        this._onToggleModal(true)
        this.props.setUserManagementState({ vendorStatusUpdate: status as string })
    }

    _onChangeStatusField = (remarks: string) => {
        this.props.setUserManagementState({ vendorRemarksUpdate: remarks as string})
    }

    _onToggleModal = (open: boolean) => {
        this.props.setUserManagementState({ modalVisible: open as boolean, vendorRemarksUpdate: '' })
    };

    _onStatusUpdateSave = () => {
        const { vendorStatusUpdate, vendorRemarksUpdate, vendorDetails } = this.props.usermanagement;
        if(!vendorRemarksUpdate || vendorStatusUpdate === "") {
            toastError('Remarks is required')
        }
        else {
            if(vendorDetails) {
                this._onToggleModal(false);
                this.props.updateVendorStatus(vendorStatusUpdate, vendorRemarksUpdate, vendorDetails);
            }
        }
    }

    render() {
        const { vendorDetails, userDetailLoading, modalVisible, vendorStatusUpdate, vendorRemarksUpdate, statusLoading } = this.props.usermanagement;
        return (
            <SymphonyLayout>
                <Box height="10px" bgcolor="rgb(244, 246, 249)" />
                <SymphonyContainer height="calc(100vh - 130px)">
                    <SymphonyTabsContainer>
                        <SymphonyTabs 
                            value="Vendor Information"
                            TabIndicatorProps={{ style: { height: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                        >
                            <SymphonyTab
                                id="vendor-information-tab"
                                label="Vendor Information"
                                value="Vendor Information"
                            />
                        </SymphonyTabs>
                    </SymphonyTabsContainer>
                    {userDetailLoading ? <SymphonyContentLoading overrideHeight="calc(100vh - 130px)!important" /> : 
                        <SymphonyViewContainer height="calc(100vh - 130px)!important">
                            <SymphonyViewContainer height="calc(100vh - 130px)!important">
                                {vendorDetails &&
                                    <VendorInformation
                                        vendor={vendorDetails}
                                        setVendorStatusUpdate={this._setVendorStatusUpdate.bind(this)}
                                    />
                                }
                            </SymphonyViewContainer>
                        </SymphonyViewContainer>
                    }
                    {vendorDetails &&
                        <VendorApprovalDialog
                            open={modalVisible}
                            vendor={vendorDetails}
                            onClose={this._onToggleModal.bind(this, false)}
                            statusUpdate={vendorStatusUpdate}
                            vendorRemarksUpdate={vendorRemarksUpdate}
                            onChangeStatusField={this._onChangeStatusField.bind(this)}
                            statusUpdateSave={this._onStatusUpdateSave.bind(this)}
                            statusLoading={statusLoading}
                        />
                    }
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    usermanagement: state.usermanagement,
    system: state.system
});

export default withRouter(connect(mapStateToProps, {
    setSystemState,
    setUserManagementState,
    updateVendorStatus,
    loadVendorList,
    loadVendor
})(VendorView));