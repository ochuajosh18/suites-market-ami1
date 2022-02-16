import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { UserManagementState } from '../../../store/usermanagement/types';
import { setUserManagementState, loadRoleList, saveRole, deleteRole } from '../../../store/usermanagement/actions';
import { setSystemState } from '../../../store/system/actions';
import RoleCardList from './fragments/RoleCardList';
// import RoleActionDialog from './fragments/RoleActionDialog';
import RoleDeleteModal from './fragments/RoleDeleteModal';

// local components
import {
    AddRoleButton
} from './fragments/AccessibilityComponents';

// Global Components
import { 
    SymphonyContainer,
    SymphonyContentContainer,
    SymphonyContentLoadingContainer,
    SymphonyTabsContainer,
    SymphonyField,
    SymphonyTabs
} from '../../symphony/SymphonyCommonComponents';
import SymphonyContentLoading from '../../symphony/SymphonyContentLoading';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import { SYMPHONY_PRIMARY_COLOR } from '../Colors';
import { toastError } from '../../../modules/Toast';
import findIndex from 'lodash/findIndex';

//material UI
import AddIcon from '@material-ui/icons/Add';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

// util
import debounce from 'lodash/debounce';

interface RoleProps {
    setSystemState: typeof setSystemState;
    setUserManagementState: typeof setUserManagementState;
    loadRoleList: typeof loadRoleList;
    saveRole: typeof saveRole;
    deleteRole: typeof deleteRole;
    usermanagement: UserManagementState;
}

class Role extends React.PureComponent<RoleProps> {
    searchRef = React.createRef<HTMLInputElement>();
    _search = debounce((searchString: string) => {
        this.props.loadRoleList(searchString);
    }, 300, { leading: false });

    componentDidMount = () => {
        // set button
        this.props.setSystemState({
            headerEndButton:
                <div>
                    <AddRoleButton 
                        id="add-role-btn"
                        startIcon={<AddIcon />}
                        onClick={this._onAddClick.bind(this)}
                    >
                        Add New
                    </AddRoleButton>
                </div>
            ,
            shallRedirect: false,
            redirectTo: ''
        });
        this.props.loadRoleList('');
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined });

    _onAddClick = () => {
        this.props.setSystemState({
            shallRedirect: true,
            redirectTo: '/symphony/roles/new'
        });
    }


    _onUpdateField = (field: string, value: string) => {
        this.props.setUserManagementState({ [field]: value });
    }

    _onEditClick = (id: string, name: string, description: string) => {
        // this.props.setUserManagementState({ 
        //     selectedRoleId: id, 
        //     selectedRoleName: name, 
        //     selectedRoleDescription: description
        // });
        this.props.setSystemState({
            shallRedirect: true,
            redirectTo: `/symphony/roles/${id}`
        })
    }

    _onToggleDeleteModal = (open: boolean, id: string) => {
        this.props.setUserManagementState({ deleteModalVisible: open as boolean, selectedRoleId: id})
    }

    _onDeleteClick = async () => {
        this.props.deleteRole(this.props.usermanagement.selectedRoleId);
    }

    _onSaveClick = async () => {
        const { selectedRoleId, selectedRoleName, selectedRoleDescription, roles } = this.props.usermanagement
        const roleIndex = findIndex(roles, (role)  => role.name.toLowerCase() === selectedRoleName.toLowerCase() && role.id !== selectedRoleId)
        
        if(roleIndex !== -1) toastError('Role name already exist')
        if(!selectedRoleName) toastError('Role name is required')
        if(!selectedRoleDescription) toastError('Description is required')
        if(selectedRoleName && selectedRoleDescription && roleIndex === -1) {
            this.props.saveRole(selectedRoleId, selectedRoleName, selectedRoleDescription)
        }
    }

    _onSearch = (e: React.ChangeEvent<HTMLInputElement>) => this._search(e.target.value);

    render() {
        const { 
            userListLoading, 
            roles, 
            // modalVisible, 
            // selectedRoleId, 
            // selectedRoleName, 
            // selectedRoleDescription, 
            statusLoading, 
            deleteModalVisible 
        } = this.props.usermanagement;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyTabsContainer>
                        <SymphonyTabs/>
                        <SymphonyField 
                            id="role-search-fld"
                            style={{ marginBottom: 8, width: 300 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    <Search htmlColor={SYMPHONY_PRIMARY_COLOR} />
                                </InputAdornment>
                            }}
                            inputProps={{ ref: this.searchRef }}
                            onChange={this._onSearch.bind(this)}
                            placeholder="Search"
                        />
                    </SymphonyTabsContainer>
                    <SymphonyContentContainer>
                        {userListLoading ? <SymphonyContentLoading /> :
                            <>
                                {roles.length > 0 ? 
                                    <RoleCardList
                                        roles={roles}
                                        onEditClick={this._onEditClick.bind(this)}
                                        toggleDeleteModal={this._onToggleDeleteModal.bind(this)}
                                    />
                                :
                                    <SymphonyContentLoadingContainer>No Role Found</SymphonyContentLoadingContainer>
                                }
                            </>
                        }
                    </SymphonyContentContainer>
                    {/* <RoleActionDialog
                        open={modalVisible}
                        roleName={selectedRoleName}
                        roleDescription={selectedRoleDescription}
                        onClose={this._onToggleModal.bind(this, false)}
                        onUpdateField={this._onUpdateField.bind(this)}
                        statusLoading={statusLoading}
                        selectedRoleId={selectedRoleId}
                        onSaveClick={this._onSaveClick.bind(this)}
                    /> */}
                    <RoleDeleteModal
                        open={deleteModalVisible}
                        onPressDeleteButton={this._onDeleteClick.bind(this)}
                        onPressCancelButton={this._onToggleDeleteModal.bind(this, false, '')}
                        statusLoading={statusLoading}
                    />
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    usermanagement: state.usermanagement,
    system: state.system
});

export default connect(mapStateToProps, {
    setSystemState,
    setUserManagementState,
    loadRoleList,
    saveRole,
    deleteRole
})(Role);