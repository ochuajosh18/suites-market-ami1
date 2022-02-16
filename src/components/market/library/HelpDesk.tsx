import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store/';
import { LibraryState } from '../../../store/library/types';
import { GenericMedia } from '../../../store/system/types';
import { setSystemState, resetSystemDialog } from '../../../store/system/actions';
import { setLibraryState, getHelpDesk, updateHelpDesk } from '../../../store/library/actions';

// Global Components
import { 
    SymphonyHeaderButton, 
    SymphonyHeaderTitle,
    SymphonyContainer,
    SymphonyContentContainer
} from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import SymphonyContentLoading from '../../symphony/SymphonyContentLoading';

// Local Components
import HelpDeskInformation from './fragments/HelpDeskInformation';

// Material UI
import Box from '@material-ui/core/Box';

// Utils
import { toastError } from '../../../modules/Toast';

interface HelpDeskProps {
    library: LibraryState;
    getHelpDesk: typeof getHelpDesk;
    setSystemState: typeof setSystemState;
    updateHelpDesk: typeof updateHelpDesk;
    setLibraryState: typeof setLibraryState; 
    resetSystemDialog: typeof resetSystemDialog;   
}

class HelpDesk extends React.PureComponent<HelpDeskProps> {

    componentDidMount = () => {
        this.props.setSystemState({
            header: (
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <SymphonyHeaderTitle
                        id="helpdesk-header-title"
                    >
                        Helpdesk
                    </SymphonyHeaderTitle>
                    <div>
                        <SymphonyHeaderButton 
                            id="helpdesk-save-btn"
                            onClick={this._onPressSaveButton.bind(this)}
                        >
                            Save
                        </SymphonyHeaderButton>
                    </div>
                </Box>
            )
        })
        this.props.getHelpDesk();
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined })

    _validateActiveHelpDesk = () => {
        const { activeHelpDesk } = this.props.library;

        const validateEmail = (data) => {
            // eslint-disable-next-line
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let isValid = re.test(String(data).toLowerCase());
            return isValid;
        };

        if (activeHelpDesk) {
            const { helpDeskEmail, helpDeskAddress, helpDeskPrimaryContact, helpDeskSecondaryContact, helpDeskFax, helpDeskImage, helpDeskOpening, helpDeskClosing } = activeHelpDesk;
            if (!helpDeskEmail) {
                toastError('Missing email');
                return false;
            }

            if(!validateEmail(helpDeskEmail)) {
                toastError('Invalid email');
                return false;
            }

            if (!helpDeskAddress) {
                toastError('Missing address');
                return false;
            }

            if (!helpDeskPrimaryContact) {
                toastError('Missing primary contact');
                return false;
            }

            if (!helpDeskSecondaryContact) {
                toastError('Missing secondary contact');
                return false;
            }

            if (!helpDeskFax) {
                toastError('Missing fax');
                return false;
            }

            if (!helpDeskOpening) {
                toastError('Missing opening time');
                return false;
            }

            if (!helpDeskClosing) {
                toastError('Missing closing time');
                return false;
            }

            if (!helpDeskImage.path && !helpDeskImage.file) {
                toastError('Missing image');
                return false;
            }

            return true;
        }
    }

    _onPressSaveButton = () => {
        let validHelpDeskInfo = this._validateActiveHelpDesk();
        if (validHelpDeskInfo) {
            this.props.setSystemState({
                systemDialogOpen: true,
                systemDialogMaxWidth: 'xs',
                systemDialogTitle: 'Confirm Save',
                systemDialogContent: 'Please note that any changes are permanent. To continue, please click the save button.',
                systemDialogSimple: true,
                systemDialogConfirm: true,
                systemDialogConfirmAction: () => { 
                    this.props.updateHelpDesk();
                    this.props.resetSystemDialog();
                }
            });
        }
    }

    _onChangeHelpDeskInput = (property: string, value: number | string | boolean | GenericMedia) => {
        const { activeHelpDesk } = this.props.library;
        if (activeHelpDesk) {
            this.props.setLibraryState({ activeHelpDesk: { ...activeHelpDesk, [property] : value }})
        }
    }
    
    render () {
        const { activeHelpDesk, helpDeskLoading } = this.props.library;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyContentContainer overflow="auto">
                        { helpDeskLoading ? <SymphonyContentLoading /> :
                            activeHelpDesk &&
                            <HelpDeskInformation 
                                activeHelpDesk={activeHelpDesk}
                                onChangeHelpDeskInput={this._onChangeHelpDeskInput.bind(this)}
                            />
                        }
                    </SymphonyContentContainer>
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        library: state.library
    }
}

export default connect(mapStateToProps, {
    getHelpDesk,
    setSystemState,
    updateHelpDesk,
    setLibraryState,
    resetSystemDialog
})(HelpDesk);