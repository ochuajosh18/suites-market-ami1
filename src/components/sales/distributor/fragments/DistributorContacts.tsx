import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../../store';
import { DistributorState, DynamicDistributorType } from '../../../../store/distributor/types';
import { setDistributorState } from '../../../../store/distributor/actions';
import { GenericMedia, SystemState } from '../../../../store/system/types';
import { setSystemState, resetSystemDialog } from '../../../../store/system/actions';
import { CustomerContact } from '../../../../store/customer/types';

// local
import DistributorContactCardList from './DistributorContactCardList';
// import DistributorContactView from './DistributorContactCardView';

// symphony 
import { SymphonyHeaderButton } from '../../../symphony/SymphonyCommonComponents';
import SymphonyContentLoading from '../../../symphony/SymphonyContentLoading';

// material
import Box from '@material-ui/core/Box';

// util
import find from 'lodash/find';
import { toastWarning } from '../../../../modules/Toast';

interface DistributorContactProps {
    setDistributorState: typeof setDistributorState;
    setSystemState: typeof setSystemState;
    resetSystemDialog: typeof resetSystemDialog;
    distributor: DistributorState;
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

class DistributorContacts extends React.Component<DistributorContactProps> {

    componentDidMount = () => {
        const { activeDistributor, activeContact } = this.props.distributor;
        // load distributor contacts to display cards if distributor is not new
        if (activeDistributor && activeDistributor.id) {
            // this.props.getSalesDistributorContacts(activeDistributor.id);
            this.props.setDistributorState({ activeContact: undefined });
        }
        else {
            // new distributor
            if (!activeContact) {
                this.props.setDistributorState({ activeContact: EMPTY_CONTACT });
            }
        }
    }

    _onAddContactClick = () => {
        this.props.setDistributorState({ activeContact: EMPTY_CONTACT });
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
        const { activeContacts } = this.props.distributor;
        const contact = find(activeContacts, { id });
        if (contact) {
            this.props.setDistributorState({ activeContact: {
                ...contact,
                avatar: contact.avatar ? contact.avatar : {
                    path: '',
                    name: '',
                    size: 0,
                    type: ''
                },
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
        const { activeContact } = this.props.distributor;
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
                    // this.props.saveSalesDistributorContact();
                    this.props.resetSystemDialog();
                }
            )
        }
    }
    
    _onDeleteContactClick = (id: string) => {
        const { activeDistributor, activeContacts } = this.props.distributor;
        const contact = find(activeContacts, { id });
        if (activeDistributor && activeDistributor.numberOfContacts && activeDistributor.numberOfContacts === 1) { toastWarning("Cannot delete all contacts"); return; }
        if (contact && contact.isPrimary) { toastWarning("Cannot delete primary contact"); return; }
        
        this._triggerDialog(
            'Confirm Delete', 
            'Please note that any changes are permanent. To continue, please click the confirm button.',
            () => {
                // this.props.deleteContact(id);
                this.props.resetSystemDialog();
            },
            'Confirm'
        );
    }
    
    _onContactInput = (field: string, value: DynamicDistributorType) => {
        const { activeContact } = this.props.distributor;   
        if (activeContact) {
            this.props.setDistributorState({
                activeContact: { ...activeContact, [field]: value }
            });
        }
    }

    _onBackClick = () => this.props.setDistributorState({ activeContact: undefined });

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
        const { distributorContactLoading, activeContacts, activeDistributor, activeContact } = this.props.distributor;
        console.log(activeContact)
        return(
            <div>
                {distributorContactLoading ? <SymphonyContentLoading /> : 
                    <>
                        {activeDistributor && activeContact ?
                            <DistributorContactCardList
                                contacts={activeContacts}
                                activeDistributor={activeDistributor}
                                onAddContactClick={this._onAddContactClick.bind(this)}
                                onContactClick={this._onContactClick.bind(this)}
                                onDeleteContactClick={this._onDeleteContactClick.bind(this)}
                            />
                        :
                            <>
                                {/* {activeDistributor && activeContact && 
                                    <DistributorContactView
                                        numberOfContacts={activeDistributor.numberOfContacts}
                                        contact={activeContact}
                                        newDistributor={typeof activeDistributor.id === 'undefined'}
                                        onContactInput={this._onContactInput.bind(this)}
                                        onDeleteContactClick={this._onDeleteContactClick.bind(this)}
                                        onBackClick={this._onBackClick.bind(this)}
                                        fields={contactFields}
                                        sections={contactSections}
                                    />
                                } */}
                            </>
                        }
                        
                    </>
                }
            </div>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    distributor: state.distributor,
    system: state.system
});

export default connect(mapStateToProps, {
    setDistributorState,
    setSystemState,
    resetSystemDialog
})(DistributorContacts);