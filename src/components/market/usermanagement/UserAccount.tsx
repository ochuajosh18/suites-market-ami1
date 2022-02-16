import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store'
import { UserAccountsType, UserManagementFilter, UserManagementState } from '../../../store/usermanagement/types';
import { 
    setUserManagementState, 
    getRoles, 
    addUserAccount, 
    deleteUserAccount,
    updateUserAccount,
    getUsers,
    searchUser
} from '../../../store/usermanagement/actions';
import { SortOrder } from '../../../store/system/types';
import { setSystemState, resetSystemDialog } from '../../../store/system/actions';

// Material UI
import Box from '@material-ui/core/Box';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';

// Local Components
import { 
    HeaderButtonContainer,
    HeaderTitle
} from './fragments/UserManagementComponents';
import UserAccountDialogContent from './fragments/UserAccountDialogContent';
import UserAccountList from './fragments/UserAccountList';

// Global Components
import { 
    SymphonyContainer,
    SymphonyContentContainer,
    SymphonyField,
    SymphonyTabsContainer,
    SymphonyTabs,
    SymphonyTab,
    SymphonyHeaderButton,
} from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import SymphonyDialog from '../../symphony/SymphonyDialog';
import { toastError } from '../../../modules/Toast';

// Utils
import debounce from 'lodash/debounce';
import find from 'lodash/find';
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';

// Asset
// import { ReactComponent as Import } from '../../../assets/images/icons/ImportIcon.svg';
// import { ReactComponent as Export } from '../../../assets/images/icons/ExportIcon.svg';


interface UserAccountProps {
    usermanagement: UserManagementState;
    getRoles: typeof getRoles;
    searchUser: typeof searchUser;
    setSystemState: typeof setSystemState;
    getUsers: typeof getUsers;
    addUserAccount: typeof addUserAccount;
    deleteUserAccount: typeof deleteUserAccount;
    updateUserAccount: typeof updateUserAccount;
    resetSystemDialog: typeof resetSystemDialog;
    setUserManagementState: typeof setUserManagementState;
}

class UserAccount extends React.PureComponent<UserAccountProps> {
    searchRef = React.createRef<HTMLInputElement>();
    _search = debounce((searchString: string) => {
        const { userAccountTab, activeSortOrder, activeSort } = this.props.usermanagement;
        this.props.getUsers(
            userAccountTab === 'Active', 
            searchString, 
            {
                ...this.props.usermanagement.activeFilters, 
                order: activeSortOrder,
                orderBy: activeSort as string
            }
        );
    }, 300, { leading: false });

    componentDidMount = () => {
        this.props.setSystemState({
            header: (
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <HeaderTitle>
                        User Account
                    </HeaderTitle>
                    <HeaderButtonContainer>
                        {/* <HeaderActionButton
                            endIcon={<Export style={{ width: 16, height: 16 }}/>}
                        >
                            Import
                        </HeaderActionButton>
                        <HeaderActionButton
                            endIcon={<Import style={{ width: 16, height: 16 }}/>}
                        >
                            Export
                        </HeaderActionButton> */}
                        <div>
                            <SymphonyHeaderButton 
                                id="useraccount-add-btn"
                                startIcon={<AddIcon />}
                                onClick={this._onPressAddNewUser.bind(this)}
                            >
                                Add New
                            </SymphonyHeaderButton>
                        </div>
                    </HeaderButtonContainer>
                </Box>
            )
        })
        this.props.getRoles();
        this.props.getUsers(true);
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined })

    _onTabChange = (tab: 'Active' | 'Inactive') => {
        const { current } = this.searchRef;
        this.props.setUserManagementState({ userAccountTab: tab as string, activeFilters: { } });
        this.props.getUsers(tab === 'Active');
        // reset search value when changing tabs
        if (current) {
            current.value = '';
        }
    }

    _onSearch = (e: React.ChangeEvent<HTMLInputElement>) => this._search(e.target.value);

    _onPressAddNewUser = () => {
        this.props.setUserManagementState({ 
            userAccountNewUserDialogIsOpen: true,
            userAccountDialogeConfirmLabel: 'Add',
            activeUser: {
                firstName: '',
                lastName: '',
                email: '',
                role: '',
                status: this.props.usermanagement.userAccountTab,
                id: ''
            }
        })
    }

    _onChangeActiveUserInput = (property: string, value: string) => {
        const { activeUser } = this.props.usermanagement;
        if (activeUser) {
            this.props.setUserManagementState({ 
                activeUser: {
                    ...activeUser,
                    [property]: value
                }
            })
        }
    }

    _onPressActionButton = (type: 'EDIT' | 'DELETE', account: UserAccountsType) => {
        const user = find(this.props.usermanagement.userAccounts, account);
        if (user) { 
            if (type === 'EDIT') {
                const activeRole = find(this.props.usermanagement.userRoles, { id: account.roleId });
                if (activeRole) {
                    this.props.setUserManagementState({
                        activeUser: {
                            firstName: account.firstName,
                            lastName: account.lastName,
                            email: account.email,
                            role: activeRole.name,
                            status: account.isActive ? 'Active' : 'Inactive',
                            id: account.id
                        },
                        userAccountNewUserDialogIsOpen: true,
                        userAccountDialogeConfirmLabel: 'Save'
                    })
                }
                return;
            }
            this.props.setSystemState({
                systemDialogOpen: true,
                systemDialogMaxWidth: 'xs',
                systemDialogTitle: 'Confirm Delete',
                systemDialogContent: 'Deleting the user account will make permanent changes. Please click the confirm button to continue.',
                systemDialogSimple: true,
                systemDialogConfirm: true,
                systemOverrideTitle: 'Confirm',
                systemDialogConfirmAction: () => { 
                    this.props.deleteUserAccount(account.id);
                    this.props.resetSystemDialog();
                }
            });
        }
    }

    _onPressDialogSaveButton = () => {
        const { activeUser } = this.props.usermanagement;
        const validateEmail = (data) => {
            // eslint-disable-next-line
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let isValid = re.test(String(data).toLowerCase());
            return isValid;
        };

        if (activeUser) {
            if (!activeUser.firstName) {
                toastError('Missing first name');
                return;
            }

            if (!activeUser.lastName) {
                toastError('Missing last name');
                return;
            }

            if (!activeUser.email) {
                toastError('Missing email');
                return;
            }

            if (!validateEmail(activeUser.email)){
                toastError('Invalid email');
                return;
            }

            if (!activeUser.role) {
                toastError('Missing role');
                return;
            }
            this.props.setSystemState({
                systemDialogOpen: true,
                systemDialogMaxWidth: 'xs',
                systemDialogTitle: 'Confirm Save',
                systemDialogContent: 'Please note that any changes are permanent. To continue, please click the save button.',
                systemDialogSimple: true,
                systemDialogConfirm: true,
                systemDialogConfirmAction: () => { 
                    this.props.usermanagement.userAccountDialogeConfirmLabel === 'Save' ? this.props.updateUserAccount() : this.props.addUserAccount();
                    this.props.resetSystemDialog();
                }
            });
        }
    }

    _onSortClick = (sort: string, order: SortOrder) => {
        let query: Partial<UserManagementFilter> = { ...this.props.usermanagement.activeFilters };
        const activeSort = !order ? '' : sort;
        this.props.setUserManagementState({ activeSort, activeSortOrder: order as string });
        if (activeSort && order) { 
            this.props.getUsers(
                this.props.usermanagement.userAccountTab === 'Active',
                this.props.usermanagement.search,
                { 
                    ...this.props.usermanagement.activeFilters, 
                    orderBy: sort,
                    order: order as string
                }
            ); // with filter
        }
        else {
            this.props.getUsers(this.props.usermanagement.userAccountTab === 'Active', this.props.usermanagement.search, query); // no filter
        }
    }

    render () {
        const { userAccountTab, userAccounts, userRoles, activeSort, activeSortOrder, userAccountNewUserDialogIsOpen, userAccountSaveLoading, activeUser, userAccountDialogeConfirmLabel, userListLoading } = this.props.usermanagement;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyTabsContainer>
                        <SymphonyTabs 
                            value={userAccountTab}
                            TabIndicatorProps={{ style: { height: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                        >
                            <SymphonyTab
                                id="useraccount-active-tab"
                                label="Active"
                                value="Active"
                                onClick={this._onTabChange.bind(this, 'Active')}
                            />
                            <SymphonyTab
                                id="useraccount-inactive-tab"
                                label="Inactive"
                                value="Inactive"
                                onClick={this._onTabChange.bind(this, 'Inactive')}
                            />
                        </SymphonyTabs>
                        <SymphonyField 
                            id="useraccount-search-fld"
                            style={{ marginBottom: 8 }}
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
                        <UserAccountList 
                            userAccounts={userAccounts} 
                            onPressActionButton={this._onPressActionButton.bind(this)} 
                            activeSort={activeSort}
                            activeSortOrder={activeSortOrder}
                            onSortClick={this._onSortClick.bind(this)}
                            loading={userListLoading}
                        />
                        <SymphonyDialog
                            idKey="useraccount"
                            open={userAccountNewUserDialogIsOpen}
                            loading={userAccountSaveLoading}
                            title={userAccountDialogeConfirmLabel === 'Save' ? 'Update User' : 'New User'}
                            onClose={() => this.props.setUserManagementState({ userAccountNewUserDialogIsOpen: false, activeUser: undefined })}
                            onClickSave={this._onPressDialogSaveButton.bind(this)}
                            saveLabel={userAccountDialogeConfirmLabel}
                        >
                            <UserAccountDialogContent activeUser={activeUser} userRoles={userRoles} onChangeActiveUserInput={this._onChangeActiveUserInput.bind(this)}/>
                        </SymphonyDialog>
                    </SymphonyContentContainer>
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        usermanagement: state.usermanagement,
    }
}

export default connect(mapStateToProps, {
    getRoles,
    searchUser,
    setSystemState,
    getUsers,
    addUserAccount,
    deleteUserAccount,
    updateUserAccount,
    resetSystemDialog,
    setUserManagementState
})(UserAccount);