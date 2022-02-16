import React from 'react';
import { Link } from 'react-router-dom';
import { Vendor } from '../../../../store/usermanagement/types';
import { MediaInputType, SortOrder } from '../../../../store/system/types';
import { 
    UserManagementListContainer,
    UserManagementListRowsContainer,
    UserManagementListRowContainer,
    UserManagementListGrid,
    UserManagementListImageContainer,
    UserManagementButtonGrid,
    ApproveButton,
    DisapproveButton
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

interface VendorCardListProps {
    vendors: Array<Vendor>;
    tab: String;
    setVendorStatusUpdate: (status: string, vendorId: string) => void;
    activeSort: string;
    activeSortOrder: SortOrder;
    onSortClick: (sort: string, order: SortOrder) => void;
    loading: boolean;
}

const VendorCardList = (props: VendorCardListProps) => {
    const { vendors, tab, activeSort, activeSortOrder, onSortClick, loading, setVendorStatusUpdate } = props;
    return (
        <UserManagementListContainer>
            <SymphonySortableHeaderGridContainer container={true}>
                <SymphonySortableHeaderGrid item={true}  xs={tab !== 'Pending' ? 3 : 3}>
                    <SymphonySortableHeader
                        headerTitle="Name"
                        headerValue="name"
                        activeSort={activeSort}
                        activeSortOrder={activeSortOrder}
                        onSortClick={() => onSortClick('name', !activeSortOrder ||  activeSort !== 'name' ? 'ASC' : activeSortOrder === 'ASC'? 'DESC' : '')}
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true} xs={tab !== 'Pending' ? 3 : 3}>
                    <SymphonySortableHeader
                        headerTitle="Email"
                        headerValue="email"
                        activeSort={activeSort}
                        activeSortOrder={activeSortOrder}
                        onSortClick={() => onSortClick('email', !activeSortOrder ||  activeSort !== 'email' ? 'ASC' : activeSortOrder === 'ASC'? 'DESC' : '')}
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true}  xs={tab !== 'Pending' ? 3 : 3}>
                    <SymphonySortableHeader
                        headerTitle="Mobile Number"
                        headerValue="mobileNumber"
                        activeSort={activeSort}
                        activeSortOrder={activeSortOrder}
                        onSortClick={() => onSortClick('mobileNumber', !activeSortOrder ||  activeSort !== 'mobileNumber' ? 'ASC' : activeSortOrder === 'ASC'? 'DESC' : '')}
                    />
                </SymphonySortableHeaderGrid>
                {tab === 'Pending' ?
                    <SymphonySortableHeaderGrid item={true} xs={3} />
                :
                    <SymphonySortableHeaderGrid item={true} xs={3}>
                        <SymphonySortableHeader
                            headerTitle="Updated By"
                            headerValue="dateUpdated"
                            activeSort={activeSort}
                            activeSortOrder={activeSortOrder}
                            onSortClick={() => onSortClick('dateUpdated', !activeSortOrder ||  activeSort !== 'dateUpdated' ? 'ASC' : activeSortOrder === 'ASC'? 'DESC' : '')}
                        />
                    </SymphonySortableHeaderGrid>
                }
                
            </SymphonySortableHeaderGridContainer>
            {/* Cards here */}
            {loading ? <SymphonyContentLoading overrideHeight="calc(100vh - 314px)!important" /> :
                <>
                    {vendors.length === 0 &&
                        <SymphonyContentLoadingContainer height="calc(100vh - 314px)!important">
                            No Vendor Found
                        </SymphonyContentLoadingContainer>
                    }
                    <UserManagementListRowsContainer>
                        {map(vendors, ({ id, companyName, email, avatar, mobileNumber, updatedBy }) => {
                            const image = (avatar as unknown) as MediaInputType; // type cast
                            const imageUndefined = typeof image === 'undefined';
                            return (
                                <Link 
                                    id={`vendor-view-${id}`}
                                    key={id} 
                                    to={`/market/vendor/${id}`} 
                                    style={{ display: 'flex', textDecoration: 'none', color: 'unset' }}
                                > 
                                    <UserManagementListRowContainer>
                                        <Grid container={true} style={{ padding: '0 6px' }}>
                                            <UserManagementListGrid item={true} xs={tab !== 'Pending' ? 3 : 3}>
                                                <Box display="flex" alignItems="center">
                                                <UserManagementListImageContainer style={{ marginRight: 8 }}>
                                                    {!imageUndefined ? 
                                                        <SymphonyImage 
                                                            src={typeof image !== 'undefined' ? image.path : ''} 
                                                            style={{ width: 48, height: 'auto', maxHeight: 48 }}
                                                        />
                                                    :
                                                        <DefaultPic style={{ width: 32, height: 32, marginLeft: 4, }} />
                                                    }
                                                </UserManagementListImageContainer>
                                                    {companyName || 'Unknown Vendor Name'}
                                                </Box>
                                            </UserManagementListGrid>
                                            <UserManagementListGrid item={true} xs={tab !== 'Pending' ? 3 : 3}>
                                                <Box display="inline" color="#A2A2A2">{email}</Box>
                                            </UserManagementListGrid>
                                            <UserManagementListGrid item={true} xs={tab !== 'Pending' ? 3 : 3}>
                                                <Box display="inline" color="#A2A2A2">{mobileNumber}</Box>
                                            </UserManagementListGrid>
                                            { tab !== 'Pending' &&
                                                <UserManagementListGrid item={true} xs={3}>
                                                    <Box display="inline" color="#A2A2A2">{updatedBy}</Box>
                                                </UserManagementListGrid>
                                            }
                                            {
                                                tab === "Pending" && 
                                                    <>
                                                        <UserManagementButtonGrid item={true} xs={3} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                                            <ApproveButton
                                                                style={{ width: 128, marginRight: 8 }}
                                                                id={`vendor-approve-button-${id}`}
                                                                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();
                                                                    setVendorStatusUpdate("Approved", id)
                                                                }} 
                                                            >
                                                                Approve
                                                            </ApproveButton>
                                                            <DisapproveButton
                                                                style={{ width: 128 }}
                                                                id={`vendor-disapprove-button-${id}`}
                                                                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();
                                                                    setVendorStatusUpdate("Rejected", id)
                                                                }}
                                                            >
                                                                Reject
                                                            </DisapproveButton>
                                                        </UserManagementButtonGrid>
                                                    </>
                                            }
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

export default VendorCardList;