import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, match } from 'react-router';
import { AppState } from '../../../store';
import { SalespersonState, Salesperson, ContactNumber, DynamicSalesSalespersonInput } from '../../../store/salesperson/types';
import { 
    loadSalespersonList, 
    loadSalesperson, 
    setSalespersonState, 
    upsertSalesperson, 
    deleteSalesperson, 
    loadSalesSalespersonModuleFields 
} from '../../../store/salesperson/actions';
import { GenericMedia, SystemState } from '../../../store/system/types';
import { setSystemState, resetSystemDialog } from '../../../store/system/actions';
import { toastWarning } from '../../../modules/Toast';

// local
import SalespersonInformation from './fragments/SalespersonInformation';
// import CustomerContacts from './CustomerContacts';

// common components
import {
    SymphonyContainer,
    SymphonyViewContainer,
    SymphonyHeaderButton
}  from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout  from '../../symphony/SymphonyLayout';
import BackButton  from '../../symphony/SymphonyBackButton';
import SymphonyContentLoading from '../../symphony/SymphonyContentLoading';

// material
import Box from '@material-ui/core/Box';

// util
import find from 'lodash/find';

interface MatchParams {
    params: { salespersonId: string; };
}

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

interface SalespersonViewProps {
    loadSalesSalespersonModuleFields: typeof loadSalesSalespersonModuleFields;
    loadSalesperson: typeof loadSalesperson;
    loadSalespersonList: typeof loadSalespersonList;
    setSalespersonState: typeof setSalespersonState;
    setSystemState: typeof setSystemState;
    resetSystemDialog: typeof resetSystemDialog;
    upsertSalesperson: typeof upsertSalesperson;
    deleteSalesperson: typeof deleteSalesperson;
    salesperson: SalespersonState;
    system: SystemState;
}

const EMPTY_SALESPERSON = {
    id: '',
    displayId: '',
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: {
        primary: '',
        secondary: '',
        other: []
    },
    address: '',
    salespersonType: '',
    isTestAccount: false,
    isActive: false,
    password: '',
    confirmedPassword: ''
} as Salesperson;

class SalespersonView extends React.Component<SalespersonViewProps & RouteParams> {

    componentDidMount = () => {
        const { salespersonId } = this.props.match.params;
        const salesperson = find(this.props.salesperson.salespersons, { id: salespersonId });
        this.props.setSystemState({
            header: <Box display="flex">
                <BackButton to="/sales/salesperson" />
                <Box fontSize="36px">
                    {salesperson ?
                        <>{salesperson.name}</>
                    :
                        <>{salespersonId !== 'new' ? 'Loading Salesperson...' : 'Add New Salesperson'}</>
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
        if (salespersonId !== 'new') {
            this.props.loadSalesperson(salespersonId); // get active salesperson
        }
        else {
            this.props.setSalespersonState({ activeSalespersonDetail: EMPTY_SALESPERSON });
            this.props.loadSalesSalespersonModuleFields();
        }
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined });

    _onActiveSalespersonInput = (field: string, value: string | number | boolean | [number, number] | GenericMedia | ContactNumber | Array<GenericMedia> | DynamicSalesSalespersonInput | undefined) => {
        const { activeSalespersonDetail } = this.props.salesperson;
        if (activeSalespersonDetail) {
            const newSalesperson = { ...activeSalespersonDetail, [field]: value };
            this.props.setSalespersonState({ activeSalespersonDetail: newSalesperson as typeof activeSalespersonDetail });
        }
    }

    _onSaveClick = () => {
        const { activeSalespersonDetail, fields } = this.props.salesperson;
        if (activeSalespersonDetail) {
            const { id, avatar, contactNumber, password, confirmedPassword } = activeSalespersonDetail;
            for (const f of fields) {
                if (f.isRequired && f.type !== 'View' && !activeSalespersonDetail[f.name]) { 
                    if (typeof activeSalespersonDetail[f.name] !== 'boolean') {
                        toastWarning(`Missing ${f.title.toLowerCase()}`); return; 
                    }
                }
            }
            const passRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            if (!avatar || (avatar && !avatar.path && !avatar.file))  { toastWarning('Missing salesperson photo'); return ; }
            // if (!firstName)  { toastWarning('Missing salesperson first name'); return ; }
            // if (!lastName)  { toastWarning('Missing salesperson last name'); return ; }
            if (!contactNumber.primary)  { toastWarning('Missing salesperson primary contact number'); return ; }
            // if (!email)  { toastWarning('Missing salesperson email'); return ; }
            // if (!address)  { toastWarning('Missing salesperson address'); return ; }

            if (!id && (password.length < 8 || !passRegex.test(password))) { toastWarning('Password is invalid'); return ; }
            if (!id && password !== confirmedPassword) { toastWarning('Password and Confirm Password is not equal'); return ; }

            this._triggerDialog(
                'Confirm Save', 
                'Please note that any changes are permanent. To continue, please click the save button.',
                async () => {
                    this.props.resetSystemDialog();
                    await this.props.upsertSalesperson();
                    if (activeSalespersonDetail && activeSalespersonDetail.id.indexOf('SALESPERSON') > -1) {
                        this.props.setSystemState({
                            header: <Box display="flex">
                                <BackButton to="/sales/salesperson" />
                                <Box fontSize="36px">
                                    {`${activeSalespersonDetail.firstName} ${activeSalespersonDetail.lastName}`}
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
            'Deleting this salesperson is permanent. Please click confirm to continue',
            () => {
                this.props.deleteSalesperson(id);
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
        const { activeSalespersonDetail, salespersonDetailLoading, fields, sections } = this.props.salesperson;
        return (
            <SymphonyLayout>
                <Box height="10px" bgcolor="rgb(244, 246, 249)" />
                <SymphonyContainer height="calc(100vh - 130px)">
                    {salespersonDetailLoading ? <SymphonyContentLoading overrideHeight="calc(100vh - 130px)!important" /> : 
                        <SymphonyViewContainer height="calc(100vh - 130px)!important">
                            {activeSalespersonDetail &&
                                <SalespersonInformation 
                                    salesperson={activeSalespersonDetail}
                                    onSalespersonInformationInput={this._onActiveSalespersonInput.bind(this)}
                                    onDeleteClick={this._onDeleteClick.bind(this)}
                                    fields={fields}
                                    sections={sections}
                                />
                            }
                        </SymphonyViewContainer>
                    }
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    salesperson: state.salesperson,
    system: state.system
});

export default withRouter(connect(mapStateToProps, {
    loadSalesSalespersonModuleFields,
    loadSalespersonList,
    loadSalesperson,
    setSalespersonState,
    upsertSalesperson,
    setSystemState,
    deleteSalesperson,
    resetSystemDialog
})(SalespersonView));