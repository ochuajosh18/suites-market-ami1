import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, match } from 'react-router';
import { AppState } from '../../../store';
import { DistributorState, Distributor as DistributorType, DynamicDistributorType } from '../../../store/distributor/types';
import { 
    setDistributorState,
    getDistributors,
    saveDistributor,
    loadTaggedCustomers,
    tagCustomerToDistributor,
    removeCustomerTag,
    deleteDistributor,
    loadDistributorField
} from '../../../store/distributor/actions';
import { loadSalespersonList } from '../../../store/salesperson/actions';
import { SalespersonState } from '../../../store/salesperson/types';
import { GenericMedia, SystemState } from '../../../store/system/types';
import { setSystemState, resetSystemDialog } from '../../../store/system/actions';

// local
import CommonInformation from './fragments/CommonInformation';
// import DistributorContacts from './fragments/DistributorContacts';
import DistributorCustomers from './fragments/DistributorCustomers';
import DistributorCustomerDialog from './fragments/DistributorCustomerDialog';

// common components
import {
    SymphonyTabs,
    SymphonyTab,
    SymphonyContainer,
    SymphonyTabsContainer,
    SymphonyViewContainer,
    SymphonyHeaderButton
}  from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout  from '../../symphony/SymphonyLayout';
import BackButton  from '../../symphony/SymphonyBackButton';
import SymphonyContentLoading from '../../symphony/SymphonyContentLoading';
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';

// material
import Box from '@material-ui/core/Box';

// util
import find from 'lodash/find';
import { fieldsValid } from '../../../utils/fields';

interface MatchParams {
    params: { distributorId: string; };
}

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

interface DistributorViewProps {
    loadDistributorField: typeof loadDistributorField;
    removeCustomerTag: typeof removeCustomerTag;
    deleteDistributor: typeof deleteDistributor;
    tagCustomerToDistributor: typeof tagCustomerToDistributor;
    loadTaggedCustomers: typeof loadTaggedCustomers;
    saveDistributor: typeof saveDistributor;
    getDistributors: typeof getDistributors;
    setDistributorState: typeof setDistributorState;
    setSystemState: typeof setSystemState;
    resetSystemDialog: typeof resetSystemDialog;
    distributor: DistributorState;
    salesperson: SalespersonState;
    system: SystemState;
}

const EMPTY_DISTRIBUTOR = {
    name: '',
    salespersonId: '',
    displayId: '',
    contactNumber: '',
    address: '',
    country: '',
    email: '',
    status: '',
    channel: '',
    dateCreated: '',
    dateUpdated: '',
    isActive: true,
    isDeleted: false,
    organizationId: '',
    countryCode: '',
    countryId: '',
    logo: {
        path: '',
        name: '',
        type: '',
        size: 0
    },
    numberOfContacts: 0
} as DistributorType;

class DistributorView extends React.Component<DistributorViewProps & RouteParams> {

    _headerEndButton = () => (
        <Box>
            <SymphonyHeaderButton onClick={this._onSaveClick.bind(this)}>
                Save
            </SymphonyHeaderButton>
        </Box>
    )

    componentDidMount = () => {
        const { distributorId } = this.props.match.params;
        const distributor = find(this.props.distributor.distributors, { id: distributorId });
        this.props.setSystemState({
            header: <Box display="flex">
                <BackButton to="/sales/distributor" />
                <Box fontSize="36px">
                    {distributor ?
                        <>{distributor.name}</>
                    :
                        <>{distributorId !== 'new' ? 'Loading Distributor...' : 'New Distributor'}</>
                    }
                </Box>
            </Box>,
            headerEndButton: this._headerEndButton,
            shallRedirect: false,
            redirectTo: ''
        });

        // this.props.loadSalespersonList();
        if (distributorId !== 'new') {
            this.props.setDistributorState({ distributorViewActiveTab: 'Common Information' });
            this.props.getDistributors(distributorId)
        }
        else {
            // load module fields
            this.props.loadDistributorField();
            this.props.setDistributorState({ activeDistributor: EMPTY_DISTRIBUTOR });
        }
    }

    componentWillUnmount = () => {
        this.props.setSystemState({ header: undefined, headerEndButton: undefined });
        this.props.setDistributorState({ distributorViewActiveTab: 'Common Information' });
    }

    _onTabChange = (tab: string) => {
        const { activeDistributor } = this.props.distributor;
        this.props.setDistributorState({ distributorViewActiveTab: tab as string });
        this.props.setSystemState({
            headerEndButton: tab !== 'Common Information' ? undefined : this._headerEndButton
        });

        if (tab === 'Customer List' && activeDistributor) {
            // load list
            this.props.loadTaggedCustomers(activeDistributor.id);
        }
    }

    _onActiveCustomerInput = (field: string, value: string | number | boolean | [number, number] | GenericMedia | Array<GenericMedia> | DynamicDistributorType | undefined) => {
        const { activeDistributor } = this.props.distributor;
        if (activeDistributor) {
            const newDistributor = { ...activeDistributor, [field]: value }; // update a single field whenever the user types
            this.props.setDistributorState({ activeDistributor: newDistributor as DistributorType });
        }
    }

    _onSaveClick = () => {
        const { activeDistributor, fields } = this.props.distributor;
        if (activeDistributor) {
            if (!fieldsValid('', fields, activeDistributor)) { 
                this.props.setDistributorState({ distributorViewActiveTab: 'Common Information' });
                return; 
            }
            
            this._triggerDialog(
                'Confirm Save', 
                'Please note that any changes are permanent. To continue, please click the save button.',
                async () => {
                    this.props.resetSystemDialog();
                    await this.props.saveDistributor();
                    if (typeof activeDistributor.id !== 'undefined') {
                        this.props.setSystemState({
                            header: <Box display="flex">
                                <BackButton to="/sales/distributor" />
                                <Box fontSize="36px">
                                    {activeDistributor.name}
                                </Box>
                            </Box>
                        });
                    }
                }
            )
        }
    }

    _onDeleteClick = (id: string) => {
        this._triggerDialog(
            'Confirm Delete', 
            'Deleting this distributor is permanent. Please click confirm to continue',
            () => {
                this.props.deleteDistributor(id);
                this.props.resetSystemDialog();
            },
            'Confirm'
        );
    }

    _triggerDialog = (title: string, content: string, action: () => void, overrideTitle?: string) => {
        this.props.setSystemState({
            systemDialogOpen: true,
            systemDialogMaxWidth: 'xs',
            systemDialogTitle: title,
            systemOverrideTitle: overrideTitle,
            systemDialogContent: content,
            systemDialogSimple: true,
            systemDialogConfirm: true,
            systemDialogConfirmAction: action
        })
    }

    _onToggleDialog = (open: boolean) => this.props.setDistributorState({ activeDistributorModalOpen: open });

    _onCustomerTagToDistributor = (customerId: string) => {
        const { activeDistributor } = this.props.distributor;
        if (activeDistributor && activeDistributor.id) {
            this.props.tagCustomerToDistributor(activeDistributor.id, customerId);
        }
    }

    _onCustomerRemoveClick = (customerId: string) => {
        this.props.removeCustomerTag(customerId);
    }

    render() {
        const { customerList, activeDistributor, distributorViewActiveTab, distributorViewLoading, activeDistributorCustomers, fields, sections, activeDistributorModalOpen, activeDistributorCustomerListLoading } = this.props.distributor;
        const { salespersons } = this.props.salesperson;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyTabsContainer>
                        <SymphonyTabs 
                            value={distributorViewActiveTab}
                            TabIndicatorProps={{ style: { height: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                        >
                            <SymphonyTab 
                                label="Common Information" 
                                value="Common Information" 
                                onClick={this._onTabChange.bind(this, 'Common Information')}
                            />
                            {activeDistributor && activeDistributor.id && 
                                <SymphonyTab 
                                    label="Customer List" 
                                    value="Customer List"
                                    onClick={this._onTabChange.bind(this, 'Customer List')}
                                />
                            }
                        </SymphonyTabs>
                    </SymphonyTabsContainer>
                    {distributorViewLoading ? <SymphonyContentLoading /> : 
                        <SymphonyViewContainer>
                            {distributorViewActiveTab === 'Common Information' && activeDistributor &&
                                <CommonInformation 
                                    distributor={activeDistributor}
                                    salespersons={salespersons}
                                    fields={fields}
                                    sections={sections}
                                    onCommonInformationInput={this._onActiveCustomerInput.bind(this)}
                                    onDeleteClick={this._onDeleteClick.bind(this)}
                                />
                            }
                            {distributorViewActiveTab === 'Customer List' &&
                                <DistributorCustomers
                                    customerListLoading={activeDistributorCustomerListLoading}
                                    distributorCustomers={activeDistributorCustomers}
                                    onToggleModal={this._onToggleDialog.bind(this, true)}
                                    onRemoveTagClick={this._onCustomerRemoveClick.bind(this)}
                                />
                            }
                            <DistributorCustomerDialog
                                customers={customerList}
                                salespersons={salespersons}
                                onTagClick={this._onCustomerTagToDistributor.bind(this)}
                                open={activeDistributorModalOpen}
                                onClose={this._onToggleDialog.bind(this, false)}
                            />
                        </SymphonyViewContainer>
                    }
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    distributor: state.distributor,
    salesperson: state.salesperson,
    system: state.system
});

export default withRouter(connect(mapStateToProps, {
    setDistributorState,
    loadSalespersonList,
    setSystemState,
    resetSystemDialog,
    getDistributors,
    saveDistributor,
    loadTaggedCustomers,
    tagCustomerToDistributor,
    deleteDistributor,
    removeCustomerTag,
    loadDistributorField
})(DistributorView));