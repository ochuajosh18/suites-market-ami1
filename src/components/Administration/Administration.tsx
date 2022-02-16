import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { setAdministrationState, getUsers, updateUser, deleteUser } from '../../store/administration/actions';
import { AdministrationState } from '../../store/administration/types';
import { setHeaderEndButton, setSystemState, resetSystemDialog } from '../../store/system/actions';
import { resetLoginState } from '../../store/login/actions';
import Header from '../Common/Header';
import PermanentDrawer from '../Common/SideBar';
import { ToastContainer } from 'react-toastify';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import UserList from './fragments/UserList';
import UserView from './fragments/UserView';
import find from 'lodash/find';
import filter from 'lodash/filter';

interface AdministrationInterface {
    administration: AdministrationState
    setAdministrationState: typeof setAdministrationState;
    getUsers: typeof getUsers;
    setHeaderEndButton: typeof setHeaderEndButton;
    resetLoginState: typeof resetLoginState;
    updateUser: typeof updateUser;
    setSystemState: typeof setSystemState;
    resetSystemDialog: typeof resetSystemDialog;
    deleteUser: typeof deleteUser;
}

class Administration extends React.Component<AdministrationInterface> {
    
    componentDidMount = () => {
        this.props.getUsers();
    }

    componentWillUnmount = () => {
        this.props.setHeaderEndButton({
            title: 'Logout',
            action: () => { this.props.resetLoginState() }
        });
    }

    _onUserClick = (id: string) => {
        const entity = find(this.props.administration.users, ({ id }))
        this.props.setAdministrationState({ activeUserId: id, activeUser: entity, userAction: 'Update' })
        this.props.setHeaderEndButton({
            title: 'Save',
            action: this._onSaveClick.bind(this)
        });
    }

    _onTriggerCreateUser = () => {
        this.props.setAdministrationState({ 
            activeUser: {
                id: '',
                email: '',
                firstName: '',
                lastName: '',
                roleId: '',
                isActive: false,
                userType: '',
            },
            userAction: 'Create' 
        })
        this.props.setHeaderEndButton({
            title: 'Save',
            action: this._onSaveClick.bind(this)
        });
    }

    _onEntityEdit = (field: string, value: string | boolean) => {
        if (this.props.administration.activeUser) {
            this.props.setAdministrationState({ activeUser: { ...this.props.administration.activeUser, [field]: value } })
        }
    }
    
    _onSaveClick = () => {
        this.props.setSystemState({
            systemDialogOpen: true,
            systemDialogMaxWidth: 'xs',
            systemDialogTitle: `Confirm Save`,
            systemDialogContent: 'Please note that any changes are permanent. To continue, please click the save button.',
            systemDialogSimple: true,
            systemDialogConfirm: false,
            systemConfirmOnly: false,
            systemDialogConfirmAction: () => { 
                this.props.updateUser();
                this.props.resetSystemDialog();
            }
        })
    }

    _onDeleteClick = () => {
        this.props.setSystemState({
            systemDialogOpen: true,
            systemDialogMaxWidth: 'xs',
            systemDialogTitle: `Confirm Delete`,
            systemDialogContent: 'Please note that any changes are permanent. To continue, please click the delete button.',
            systemDialogSimple: true,
            systemDialogConfirm: false,
            systemOverrideTitle: 'Delete',
            systemConfirmOnly: false,
            systemDialogConfirmAction: () => { 
                this.props.deleteUser();
                this.props.setAdministrationState({ activeUser: undefined });
                this.props.resetSystemDialog();
            }
        })
    }
    
    _onCancelClick = () => {
        this.props.setAdministrationState({ activeUser: undefined });
    }
    
    _onUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.setAdministrationState({ entitySearch: e.target.value })
    }

    render () {
        return (
            <Box>
                <Header />
                <PermanentDrawer>
                    <Grid container={true}>
                        <Grid item={true} xs={3}>
                            <UserList
                                loading={this.props.administration.userLoading}
                                entities={filter(this.props.administration.users, (entity) => entity.firstName.indexOf(this.props.administration.userSearch) > -1 || entity.lastName.indexOf(this.props.administration.userSearch) > -1)}
                                onUserClick={this._onUserClick.bind(this)}
                                onUserSearch={this._onUserSearch.bind(this)}
                                activeUserId={this.props.administration.activeUserId}
                                onUserCreateClick={this._onTriggerCreateUser.bind(this)}
                            />
                        </Grid>
                        <Grid item={true} xs={9}>
                            <UserView 
                                user={this.props.administration.activeUser}
                                roles={this.props.administration.roles}
                                entityLoading={this.props.administration.userLoading}
                                action={this.props.administration.userAction}
                                onChange={this._onEntityEdit.bind(this)}
                                onUserDelete={this._onDeleteClick.bind(this)}
                                onUserCancel={this._onCancelClick.bind(this)}
                            />
                        </Grid>
                    </Grid>
                </PermanentDrawer>
                <ToastContainer />
            </Box>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    administration: state.administration
});

export default connect(mapStateToProps, {
    setAdministrationState,
    getUsers,
    setHeaderEndButton,
    resetLoginState,
    updateUser,
    setSystemState,
    resetSystemDialog,
    deleteUser
})(Administration);