import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, match } from 'react-router';
import { AppState } from '../../../store';
import { setOrderManagementState, getOrder, updateOrder } from '../../../store/ordermanagement/actions';
import { OrderManagementState } from '../../../store/ordermanagement/types';
import { LoginState } from '../../../store/login/types';
import { SystemState } from '../../../store/system/types';
import { setSystemState, resetSystemDialog } from '../../../store/system/actions';

// local
import OrderViewInformation from './fragments/OrderViewInformation';

// common components
import {
    SymphonyContainer,
    SymphonyContentContainer,
    SymphonyViewContainer,
}  from '../../symphony/SymphonyCommonComponents';
import BackButton  from '../../symphony/SymphonyBackButton';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import SymphonyContentLoading from '../../symphony/SymphonyContentLoading';

// material
import Box from '@material-ui/core/Box';

interface MatchParams {
    params: { orderId: string; };
}

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

interface OrderViewProps {
    getOrder: typeof getOrder;
    updateOrder: typeof updateOrder;
    setSystemState: typeof setSystemState;
    resetSystemDialog: typeof resetSystemDialog;
    setOrderManagementState: typeof setOrderManagementState;
    ordermanagement: OrderManagementState;
    system: SystemState;
    login: LoginState;
}

class OrderView extends React.Component<OrderViewProps & RouteParams> {

    componentDidMount = () => {
        const { orderId } = this.props.match.params;
        this.props.setSystemState({
            header: (
                <Box display="flex">
                    <BackButton to="/market/order" overrideClick={() => this.props.history.goBack()} />
                    <Box fontSize="36px">
                        #{orderId}
                    </Box>
                </Box>
            ),
            // headerEndButton: <Box>
            //     <SymphonyHeaderButton onClick={this._onSaveClick.bind(this)}>
            //         Save
            //     </SymphonyHeaderButton>
            // </Box>,
            shallRedirect: false,
            redirectTo: ''
        });
        this.props.getOrder(orderId);
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined });

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

    _onHistorybuttonClick = () => {
        this.props.setOrderManagementState({historyOpen: !this.props.ordermanagement.historyOpen})
    }

    render() {
        const { activeOrder, activeOrderLoading, historyOpen } = this.props.ordermanagement; 
        return (
            <SymphonyLayout>
                <Box height="8px" bgcolor="rgb(244, 246, 249)" />
                <SymphonyContainer>
                    <SymphonyContentContainer flexDirection="column" height="calc(100vh - 260px)!important">
                        {activeOrderLoading ? <SymphonyContentLoading overrideHeight="calc(100vh - 260px)!important" /> :
                            <SymphonyViewContainer>
                                {activeOrder && 
                                    <OrderViewInformation
                                        order={{ ...activeOrder, id: this.props.match.params.orderId }}
                                        onOrderUpdate={this._onOrderUpdate.bind(this)}
                                        onHistoryButtonClick={this._onHistorybuttonClick.bind(this)}
                                        historyOpen={historyOpen}
                                        isHistory={false}
                                        currency={this.props.login.user ? this.props.login.user.currencySign : ''}
                                    />
                                }
                            </SymphonyViewContainer>
                        }
                    </SymphonyContentContainer>
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    ordermanagement: state.ordermanagement,
    system: state.system,
    login: state.login
});

export default withRouter(connect(mapStateToProps, {
    updateOrder,
    getOrder,
    setSystemState,
    setOrderManagementState,
    resetSystemDialog,
})(OrderView));