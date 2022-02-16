import React from 'react';
import { UserAccountsType } from '../../../../store/usermanagement/types';
import { SortOrder } from '../../../../store/system/types';

// Material UI
import Icon from '@material-ui/core/Icon';

// Local Components
import { 
    DecoratedPopoverButton,
    UserAccountListContainer,
    UserManagementListRowsContainer,
    UserAccountListBodyGridContainer,
    UserAccountListBodyGridItem,
    UserAccountListBodyTypography,
    UserAccountListBodyRoleContainer,
    UserAccountListAuxMenuContainer,
} from './UserManagementComponents';

// Global Components
import {
    SymphonySortableHeaderGridContainer,
    SymphonySortableHeaderGrid,
    SymphonyContentLoadingContainer
} from '../../../symphony/SymphonyCommonComponents';
import SymphonySortableHeader from '../../../symphony/SymphonySortableHeader';
import SymphonyContentLoading from '../../../symphony/SymphonyContentLoading';
import MarketAuxMenu from '../../../market/common/MarketAuxMenu';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

// Utils
import map from 'lodash/map';

// Assets
import EditIcon from '../../../../assets/images/icons/symphony-edit-gold.png';

interface UserAccountListProps {
    userAccounts: Array<UserAccountsType>;
    onPressActionButton: (type: 'EDIT' | 'DELETE', account: UserAccountsType) => void;
    activeSort: string;
    activeSortOrder: SortOrder;
    onSortClick: (sort: string, order: SortOrder) => void;
    loading: boolean;
}

const UserAccountList = (props: UserAccountListProps) => {
    const { userAccounts, activeSort, activeSortOrder, loading, onSortClick, onPressActionButton } = props;
    return (
        <UserAccountListContainer>
           <SymphonySortableHeaderGridContainer container={true}>
                <SymphonySortableHeaderGrid item={true} xs={4}>
                    <SymphonySortableHeader
                        headerTitle="Name"
                        headerValue="name"
                        activeSort={activeSort}
                        activeSortOrder={activeSortOrder}
                        onSortClick={() => onSortClick('name', !activeSortOrder ||  activeSort !== 'name' ? 'ASC' : activeSortOrder === 'ASC'? 'DESC' : '')}
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true} xs={4}>
                    <SymphonySortableHeader
                        headerTitle="Email"
                        headerValue="email"
                        activeSort={activeSort}
                        activeSortOrder={activeSortOrder}
                        onSortClick={() => onSortClick('email', !activeSortOrder ||  activeSort !== 'email' ? 'ASC' : activeSortOrder === 'ASC'? 'DESC' : '')}
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true} xs={4}>
                    <SymphonySortableHeader
                        headerTitle="Role"
                        headerValue="userType"
                        activeSort={activeSort}
                        activeSortOrder={activeSortOrder}
                        onSortClick={() => onSortClick('userType', !activeSortOrder ||  activeSort !== 'userType' ? 'ASC' : activeSortOrder === 'ASC'? 'DESC' : '')}
                    />
                </SymphonySortableHeaderGrid>
            </SymphonySortableHeaderGridContainer>
            {loading ? <SymphonyContentLoading overrideHeight="calc(100vh - 314px)!important" /> :
                <>
                    {userAccounts.length === 0 &&
                        <SymphonyContentLoadingContainer height="calc(100vh - 314px)!important">
                            No User Found
                        </SymphonyContentLoadingContainer>
                    }
                    <UserManagementListRowsContainer>
                        { map(userAccounts, (account, index) => {
                            return (
                                <UserAccountListBodyGridContainer 
                                    id={`useraccount-${account.firstName}-${account.lastName}-${index}`}
                                    key={`useraccount-${account.firstName}-${account.lastName}-${index}`} 
                                    container={true}
                                    style={{ padding: '0 12px' }}
                                >
                                    <UserAccountListBodyGridItem item={true} xs={4}>
                                        <UserAccountListBodyTypography style={{ fontWeight: 'bold' }}>{account.firstName} {account.lastName}</UserAccountListBodyTypography>
                                    </UserAccountListBodyGridItem>
                                    <UserAccountListBodyGridItem item={true} xs={4}>
                                        <UserAccountListBodyTypography style={{ opacity: 0.5 }}>{account.email}</UserAccountListBodyTypography>
                                    </UserAccountListBodyGridItem>
                                    <UserAccountListBodyGridItem item={true} xs={4}>
                                        <UserAccountListBodyRoleContainer>
                                            <UserAccountListBodyTypography>{account.userType}</UserAccountListBodyTypography>
                                            <MarketAuxMenu>
                                                <UserAccountListAuxMenuContainer>
                                                    <DecoratedPopoverButton
                                                        id={`useraccount-${account.firstName}-${account.lastName}-${index}-edit-btn`}
                                                        style={{ color: SYMPHONY_PRIMARY_COLOR }}
                                                        endIcon={<img src={EditIcon} style={{ width: 14, height: 14 }} alt="" />}
                                                        onClick={() => onPressActionButton('EDIT', account)}
                                                    >
                                                        Edit
                                                    </DecoratedPopoverButton>
                                                    <DecoratedPopoverButton
                                                        id={`useraccount-${account.firstName}-${account.lastName}-${index}-delete-btn`}
                                                        style={{ color: '#FF4D4D' }}
                                                        endIcon={<Icon className="fa fa-trash-alt" />}
                                                        onClick={() => onPressActionButton('DELETE', account)}
                                                    >
                                                        Delete
                                                    </DecoratedPopoverButton>
                                                </UserAccountListAuxMenuContainer>
                                            </MarketAuxMenu>
                                        </UserAccountListBodyRoleContainer>
                                    </UserAccountListBodyGridItem>
                                </UserAccountListBodyGridContainer>
                            )
                        })}
                    </UserManagementListRowsContainer>
                </>
            }
        </UserAccountListContainer>
    )
}

export default UserAccountList;