import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, match } from 'react-router';
import { AppState } from '../../../store';
import { CustomerState, ICustomer as Customer, CustomerViewActiveTab, DynamicBasicCustomerInput } from '../../../store/customer/types';
import { 
    setCustomerState,
    getSalesCustomer,
    uploadLogo,
    saveSalesCustomer,
    deleteSalesCustomer,
    loadSalesCustomerModuleFields
} from '../../../store/customer/actions';
import { SalespersonState } from '../../../store/salesperson/types';
import { loadSalespersonList } from '../../../store/salesperson/actions';
import { GenericMedia, SystemState } from '../../../store/system/types';
import { setSystemState, resetSystemDialog } from '../../../store/system/actions';
import { toastWarning } from '../../../modules/Toast';

// local
import CommonInformation from './fragments/CommonInformation';
import CustomerContacts from './CustomerContacts';

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

interface MatchParams {
    params: { customerId: string; };
}

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

interface CustomerViewProps {
    loadSalesCustomerModuleFields: typeof loadSalesCustomerModuleFields;
    getSalesCustomer: typeof getSalesCustomer;
    setCustomerState: typeof setCustomerState;
    uploadLogo: typeof uploadLogo;
    saveSalesCustomer: typeof saveSalesCustomer;
    deleteSalesCustomer: typeof deleteSalesCustomer;
    loadSalespersonList: typeof loadSalespersonList;
    setSystemState: typeof setSystemState;
    resetSystemDialog: typeof resetSystemDialog;
    customer: CustomerState;
    salesperson: SalespersonState;
    system: SystemState;
}

const EMPTY_CUSTOMER = {
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
} as Customer

class CustomerView extends React.Component<CustomerViewProps & RouteParams> {

    componentDidMount = () => {
        const { customerId } = this.props.match.params;
        const customer = find(this.props.customer.customerList, { id: customerId });
        this.props.setSystemState({
            header: <Box display="flex">
                <BackButton to="/sales/customer" />
                <Box fontSize="36px">
                    {customer ?
                        <>{customer.name}</>
                    :
                        <>{customerId !== 'new' ? 'Loading Customer...' : 'New Customer'}</>
                    }
                </Box>
            </Box>,
            headerEndButton: <Box>
                <SymphonyHeaderButton onClick={this._onSaveClick.bind(this)}>
                    Save
                </SymphonyHeaderButton>
            </Box>,
            shallRedirect: false,
            redirectTo: ''
        });

        this.props.loadSalespersonList();
        if (customerId !== 'new') {
            this.props.setCustomerState({ customerViewActiveTab: 'Common Information' });
            this.props.getSalesCustomer(true, {}, customerId); // get active product
        }
        else {
            // load module fields
            this.props.loadSalesCustomerModuleFields();
            this.props.setCustomerState({ activeCustomer: EMPTY_CUSTOMER });
        }
    }

    componentWillUnmount = () => {
        this.props.setSystemState({ header: undefined, headerEndButton: undefined });
        this.props.setCustomerState({ customerViewActiveTab: 'Common Information' });
    }

    _onTabChange = (tab: CustomerViewActiveTab) => {
        this.props.setCustomerState({ customerViewActiveTab: tab as string });
        this.props.setSystemState({
            headerEndButton: (tab === 'Common Information' || this.props.match.params.customerId === 'new') ? 
            (
                <Box>
                    <SymphonyHeaderButton onClick={this._onSaveClick.bind(this)}>
                        Save
                    </SymphonyHeaderButton>
                </Box>
            ) : undefined
        });
    }

    _onActiveCustomerInput = (field: string, value: string | number | boolean | [number, number] | GenericMedia | Array<GenericMedia> | DynamicBasicCustomerInput | undefined ) => {
        const { activeCustomer } = this.props.customer;
        if (activeCustomer) {
            const newCustomer = { ...activeCustomer, [field]: value }; // update a single field whenever the user types
            this.props.setCustomerState({ activeCustomer: newCustomer as typeof activeCustomer });
        }
    }

    _onSaveClick = () => {
        const { activeCustomer, activeContact, fields, contactFields } = this.props.customer;
        if (activeCustomer) {
            for (const f of fields) {
                if (f.isRequired && f.type !== 'View' && !activeCustomer[f.name]) { 
                    toastWarning(`Missing ${f.title.toLowerCase()}`); 
                    this.props.setCustomerState({ customerViewActiveTab: 'Common Information' });
                    return; 
                }
            }
            if (typeof activeCustomer.id === 'undefined' && activeContact) {
                // new contact validation
                for (const f of contactFields) {
                    if (f.isRequired && f.type !== 'View' && !activeContact[f.name]) { 
                        toastWarning(`Missing contact ${f.title.toLowerCase()}`); 
                        this.props.setCustomerState({ customerViewActiveTab: 'Contact Information' });
                        return false; 
                    }
                }
            } 

            this._triggerDialog(
                'Confirm Save', 
                'Please note that any changes are permanent. To continue, please click the save button.',
                async () => {
                    this.props.resetSystemDialog();
                    await this.props.saveSalesCustomer();
                    if (typeof activeCustomer.id !== 'undefined') {
                        this.props.setSystemState({
                            header: <Box display="flex">
                                <BackButton to="/sales/customer" />
                                <Box fontSize="36px">
                                    {activeCustomer.name}
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
            'Deleting this customer is permanent. Please click confirm to continue',
            () => {
                this.props.deleteSalesCustomer(id);
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

    render() {
        const { activeCustomer, customerViewActiveTab, customerViewLoading, fields, sections } = this.props.customer;
        const { salespersons } = this.props.salesperson;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyTabsContainer>
                        <SymphonyTabs 
                            value={customerViewActiveTab}
                            TabIndicatorProps={{ style: { height: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                        >
                            <SymphonyTab 
                                label="Common Information" 
                                value="Common Information" 
                                onClick={this._onTabChange.bind(this, 'Common Information')}
                            />
                            <SymphonyTab 
                                label="Contact Information" 
                                value="Contact Information"
                                onClick={this._onTabChange.bind(this, 'Contact Information')}
                            />
                        </SymphonyTabs>
                    </SymphonyTabsContainer>
                    {customerViewLoading ? <SymphonyContentLoading /> : 
                        <SymphonyViewContainer>
                            {customerViewActiveTab === 'Common Information' && activeCustomer ?
                                <CommonInformation 
                                    customer={activeCustomer}
                                    salespersons={salespersons}
                                    fields={fields}
                                    sections={sections}
                                    onCommonInformationInput={this._onActiveCustomerInput.bind(this)}
                                    onDeleteClick={this._onDeleteClick.bind(this)}
                                />
                            :
                                <CustomerContacts />
                            }
                        </SymphonyViewContainer>
                    }
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    customer: state.customer,
    salesperson: state.salesperson,
    system: state.system
});

export default withRouter(connect(mapStateToProps, {
    getSalesCustomer,
    setCustomerState,
    uploadLogo,
    saveSalesCustomer,
    loadSalespersonList,
    deleteSalesCustomer,
    setSystemState,
    resetSystemDialog,
    loadSalesCustomerModuleFields
})(CustomerView));