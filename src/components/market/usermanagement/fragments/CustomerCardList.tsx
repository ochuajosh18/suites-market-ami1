import React from 'react';
import { Link } from 'react-router-dom';
import { Customer } from '../../../../store/usermanagement/types';
import { MediaInputType, SortOrder} from '../../../../store/system/types';
import { 
    UserManagementListContainer,
    UserManagementListRowsContainer,
    UserManagementListRowContainer,
    UserManagementListGrid,
    UserManagementListImageContainer
} from './UserManagementComponents';

import {
    SymphonySortableHeaderGridContainer,
    SymphonySortableHeaderGrid,
    SymphonyContentLoadingContainer
} from '../../../symphony/SymphonyCommonComponents';
import SymphonySortableHeader from '../../../symphony/SymphonySortableHeader';
import SymphonyContentLoading from '../../../symphony/SymphonyContentLoading';

// material
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

// util
import map from 'lodash/map';

// default svg
import { ReactComponent as DefaultPic } from '../../../../assets/images/logos/logo.svg';
import SymphonyImage from '../../../symphony/SymphonyImage';

interface CustomerCardListProps {
    customers: Array<Customer>;
    activeSort: string;
    activeSortOrder: SortOrder;
    onSortClick: (sort: string, order: SortOrder) => void;
    loading: boolean;
}

const CustomerCardList = (props: CustomerCardListProps) => {
    const { customers, loading, activeSort, activeSortOrder, onSortClick } = props;
    return (
        <UserManagementListContainer paddingTop="10px">
            <SymphonySortableHeaderGridContainer container={true}>
                <SymphonySortableHeaderGrid item={true} xs={5}>
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
                <SymphonySortableHeaderGrid item={true} xs={3}>
                    <SymphonySortableHeader
                        headerTitle="Mobile Number"
                        headerValue="mobileNumber"
                        activeSort={activeSort}
                        activeSortOrder={activeSortOrder}
                        onSortClick={() => onSortClick('mobileNumber', !activeSortOrder ||  activeSort !== 'mobileNumber' ? 'ASC' : activeSortOrder === 'ASC'? 'DESC' : '')}
                    />
                </SymphonySortableHeaderGrid>
            </SymphonySortableHeaderGridContainer>
            {/* Cards here */}
            {loading ? <SymphonyContentLoading overrideHeight="calc(100vh - 314px)!important" /> :
                <>
                    {customers.length === 0 &&
                        <SymphonyContentLoadingContainer height="calc(100vh - 314px)!important">
                            No Order Found
                        </SymphonyContentLoadingContainer>
                    }
                    <UserManagementListRowsContainer>

                        {map(customers, ({ id, firstName, lastName, email, avatar, mobileNumber }) => {
                            const image = (avatar as unknown) as MediaInputType; // type cast
                            const imageUndefined = typeof image === 'undefined';
                            return (
                                <Link 
                                    id={`customer-view-${id}`}
                                    key={id} 
                                    to={`/market/customer/${id}`} 
                                    style={{ display: 'flex', textDecoration: 'none', color: 'unset' }}
                                > 
                                    <UserManagementListRowContainer>
                                        <Grid container={true}>
                                            <UserManagementListGrid item={true} xs={5}>
                                                <Box display="flex" alignItems="center">
                                                    <UserManagementListImageContainer style={{ backgroundColor: imageUndefined ? '#F3F3F3' : 'transparent', marginRight: 8 }}>
                                                        {!imageUndefined ? 
                                                            <SymphonyImage 
                                                                src={typeof image !== 'undefined' ? image.path : ''} 
                                                                style={{ width: 48, height: 'auto', maxHeight: 48 }}
                                                            />
                                                        :
                                                            <DefaultPic style={{ width: 32, height: 32, marginLeft: 4, }} />
                                                        }
                                                    </UserManagementListImageContainer>
                                                    {`${firstName} ${lastName}` || 'Unknown Customer Name'}
                                                </Box>
                                            </UserManagementListGrid>
                                            <UserManagementListGrid item={true} xs={4}>
                                                <Box display="inline" color="#A2A2A2">{email}</Box>
                                            </UserManagementListGrid>
                                            <UserManagementListGrid item={true} xs={3}>
                                                <Box display="inline" color="#A2A2A2">{mobileNumber}</Box>
                                            </UserManagementListGrid>
                                            
                                        </Grid>
                                    </UserManagementListRowContainer>
                                </Link>
                            )
                        })}
                    </UserManagementListRowsContainer>
                </>
            }
        </UserManagementListContainer>
    )
}

export default CustomerCardList;