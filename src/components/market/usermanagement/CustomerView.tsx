import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, match } from 'react-router';
import { AppState } from '../../../store';
import { SystemState } from '../../../store/system/types';
import { setSystemState } from '../../../store/system/actions';
import { UserManagementState } from '../../../store/usermanagement/types';
import { loadCustomer, loadCustomerAddress, loadCustomerList } from '../../../store/usermanagement/actions';

// local
import CustomerInformation from './fragments/CustomerInformation';

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
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';

// material
import Box from '@material-ui/core/Box';

// util
import find from 'lodash/find';

interface MatchParams {
    params: { customerId: string; };
}

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

interface CustomerViewProps {
    setSystemState: typeof setSystemState;
    loadCustomerList: typeof loadCustomerList;
    loadCustomer: typeof loadCustomer;
    loadCustomerAddress: typeof loadCustomerAddress;
    usermanagement: UserManagementState;
    system: SystemState;
}


class CustomerView extends React.Component<CustomerViewProps & RouteParams> {
    componentDidMount = () => {
        const { customerId } = this.props.match.params;
        const customer = find(this.props.usermanagement.customers, { id: customerId });
        this.props.setSystemState({
            header: <Box display="flex">
                <BackButton to="/market/customer" />
                <Box fontSize="36px">
                    {customer ?
                        <>{`${customer.firstName} ${customer.lastName}`}</>
                    :
                        <>{'Loading Customer...'}</>
                    }
                </Box>
            </Box>,
            shallRedirect: false,
            redirectTo: ''
        });
        this.props.loadCustomerList("");
        this.props.loadCustomer(customerId);
        this.props.loadCustomerAddress(customerId);
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined });

    render() {
        const { 
            customerDetails, 
            userDetailLoading, 
            customerHomeAddress, 
            customerOfficeAddress 
        } = this.props.usermanagement;
        return (
            <SymphonyLayout>
                <Box height="10px" bgcolor="rgb(244, 246, 249)" />
                <SymphonyContainer height="calc(100vh - 130px)">
                    <SymphonyTabsContainer>
                        <SymphonyTabs 
                            value="Customer Information"
                            TabIndicatorProps={{ style: { height: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                        >
                            <SymphonyTab
                                id="customer-information-tab"
                                label="Customer Information"
                                value="Customer Information"
                            />
                        </SymphonyTabs>
                    </SymphonyTabsContainer>
                    {userDetailLoading ? <SymphonyContentLoading overrideHeight="calc(100vh - 130px)!important" /> : 
                        <SymphonyViewContainer height="calc(100vh - 130px)!important">
                            <SymphonyViewContainer height="calc(100vh - 130px)!important">
                                {customerDetails &&
                                    <CustomerInformation
                                        customer={customerDetails}
                                        homeAddress={customerHomeAddress}
                                        officeAddress={customerOfficeAddress}
                                    />
                                }
                            </SymphonyViewContainer>
                        </SymphonyViewContainer>
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
    loadCustomerList,
    loadCustomer,
    loadCustomerAddress
})(CustomerView));