import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { CustomerState, CustomerContact, DynamicBasicCustomerInput } from '../../../store/customer/types';
import { setCustomerState, getSalesCustomerContacts, saveSalesCustomerContact, deleteContact } from '../../../store/customer/actions';
import { GenericMedia, SystemState } from '../../../store/system/types';
import { setSystemState, resetSystemDialog } from '../../../store/system/actions';

// local
import CustomerContactCardList from './fragments/CustomerContactCardList';
import CustomerContactView from './fragments/CustomerContactView';

// symphony 
import { SymphonyHeaderButton } from '../../symphony/SymphonyCommonComponents';
import SymphonyContentLoading from '../../symphony/SymphonyContentLoading';

// material
import Box from '@material-ui/core/Box';

// util
import find from 'lodash/find';
import { toastWarning } from '../../../modules/Toast';

interface CustomerContactProps {
    deleteContact: typeof deleteContact;
    getSalesCustomerContacts: typeof getSalesCustomerContacts;
    saveSalesCustomerContact: typeof saveSalesCustomerContact;
    setCustomerState: typeof setCustomerState;
    setSystemState: typeof setSystemState;
    resetSystemDialog: typeof resetSystemDialog;
    customer: CustomerState;
    system: SystemState;
}

const EMPTY_CONTACT: CustomerContact = {
    id: '',
    name: '',
    isPrimary: false,
    email: '',
    avatar: {
        path: '',
        name: '',
        size: 0,
        type: ''
    },
    position: '',
    address: '',
    phoneNumber: '',
    note: ''
}

class CustomerContacts extends React.Component<CustomerContactProps> {

    componentDidMount = () => {
        const { activeCustomer, activeContact } = this.props.customer;
        // load customer contacts to display cards if customer is not new
        if (activeCustomer && activeCustomer.id) {
            this.props.getSalesCustomerContacts(activeCustomer.id);
            this.props.setCustomerState({ activeContact: undefined });
        }
        else {
            // new customer
            if (!activeContact) {
                this.props.setCustomerState({ activeContact: EMPTY_CONTACT });
            }
        }
    }

    _onAddContactClick = () => {
        this.props.setCustomerState({ activeContact: EMPTY_CONTACT });
        this.props.setSystemState({
            headerEndButton: (
                <Box>
                    <SymphonyHeaderButton onClick={this._onSaveClick.bind(this)}>
                        Save
                    </SymphonyHeaderButton>
                </Box>
            )
        })
    }

    _onContactClick = (id: string) => {
        const { customerContacts } = this.props.customer;
        const contact = find(customerContacts, { id });
        if (contact) {
            this.props.setCustomerState({ activeContact: {
                ...contact,
                avatar: contact.avatar ? contact.avatar : {
                    path: '',
                    name: '',
                    size: 0,
                    type: ''
                }
            }});
            
            this.props.setSystemState({
                headerEndButton: (
                    <Box>
                        <SymphonyHeaderButton onClick={this._onSaveClick.bind(this)}>
                            Save
                        </SymphonyHeaderButton>
                    </Box>
                )
            })
        }
    }

    _onSaveClick = () => {
        const { activeContact } = this.props.customer;
        if (activeContact) {
            const { avatar, name, position, email, phoneNumber } = activeContact;
            const genAvatar: GenericMedia = avatar as GenericMedia;
            if (genAvatar.path.length === 0 && typeof genAvatar.file === 'undefined' ) { toastWarning('Missing contact image'); return; }
            if (!name) { toastWarning('Missing contact name'); return; }
            if (!position) { toastWarning('Missing contact position'); return; }
            if (!email) { toastWarning('Missing contact email'); return; }
            if (!phoneNumber) { toastWarning('Missing contact number'); return; }

            this._triggerDialog(
                'Confirm Save', 
                'Please note that any changes are permanent. To continue, please click the save button.',
                () => {
                    this.props.saveSalesCustomerContact();
                    this.props.resetSystemDialog();
                }
            )
        }
    }
    
    _onDeleteContactClick = (id: string) => {
        const { activeCustomer, customerContacts } = this.props.customer;
        const contact = find(customerContacts, { id });
        if (activeCustomer && activeCustomer.numberOfContacts && activeCustomer.numberOfContacts === 1) { toastWarning("Cannot delete all contacts"); return; }
        if (contact && contact.isPrimary) { toastWarning("Cannot delete primary contact"); return; }
        
        this._triggerDialog(
            'Confirm Delete', 
            'Please note that any changes are permanent. To continue, please click the confirm button.',
            () => {
                this.props.deleteContact(id);
                this.props.resetSystemDialog();
            },
            'Confirm'
        );
    }
    
    _onContactInput = (field: string, value: DynamicBasicCustomerInput) => {
        const { activeContact } = this.props.customer;   
        if (activeContact) {
            this.props.setCustomerState({
                activeContact: { ...activeContact, [field]: value }
            });
        }
    }

    _onBackClick = () => this.props.setCustomerState({ activeContact: undefined });

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
        const { customerContactLoading, customerContacts, activeCustomer, activeContact, contactFields, contactSections } = this.props.customer;
        return(
            <div>
                {customerContactLoading ? <SymphonyContentLoading /> : 
                    <>
                        {activeCustomer && !activeContact ?
                            <CustomerContactCardList
                                contacts={customerContacts}
                                activeCustomer={activeCustomer}
                                onAddContactClick={this._onAddContactClick.bind(this)}
                                onContactClick={this._onContactClick.bind(this)}
                                onDeleteContactClick={this._onDeleteContactClick.bind(this)}
                            />
                        :
                            <>
                                {activeCustomer && activeContact && 
                                    <CustomerContactView
                                        numberOfContacts={activeCustomer.numberOfContacts}
                                        contact={activeContact}
                                        newCustomer={typeof activeCustomer.id === 'undefined'}
                                        onContactInput={this._onContactInput.bind(this)}
                                        onDeleteContactClick={this._onDeleteContactClick.bind(this)}
                                        onBackClick={this._onBackClick.bind(this)}
                                        fields={contactFields}
                                        sections={contactSections}
                                    />
                                }
                            </>
                        }
                        
                    </>
                }
            </div>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    customer: state.customer,
    system: state.system
});

export default connect(mapStateToProps, {
    deleteContact,
    getSalesCustomerContacts,
    saveSalesCustomerContact,
    setCustomerState,
    setSystemState,
    resetSystemDialog
})(CustomerContacts);