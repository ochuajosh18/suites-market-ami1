import React from 'react';
// import { Link } from 'react-router-dom';
// import { Distributor } from '../../../../store/distributor/types';
import { ICustomer } from '../../../../store/customer/types';
import { MediaInputType } from '../../../../store/system/types';

import {
    CustomerListImportButton
} from './DistributorComponents';

import { 
    SymphonySortableHeaderGridContainer,
    SymphonySortableHeaderGrid,
    SymphonyListContainer,
    SymphonyListGrid,
    SymphonyHeaderButton,
    SymphonyContentLoadingContainer
} from '../../../symphony/SymphonyCommonComponents';
import SymphonySortableHeader from '../../../symphony/SymphonySortableHeader';
import SymphonyContentLoading from '../../../symphony/SymphonyContentLoading';

import { 
    SalesListRowContainer,
    SalesListImageContainer,
    SalesRowsContainer,
    DecoratedPopoverButton
} from '../../common/SalesCommonComponents';
import CardAux from '../../common/CardAux';
// material
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import AddIcon from '@material-ui/icons/Add';

// util
import map from 'lodash/map';

// default svg
import { ReactComponent as DefaultPic } from '../../../Basic/Common/BasicDefaultSvg.svg';

interface DistributorCustomersProps {
    distributorCustomers: Array<ICustomer>;
    customerListLoading: boolean;
    onToggleModal: () => void;
    onRemoveTagClick: (id: string) => void;
}

const DistributorCardList = (props: DistributorCustomersProps) => {
    const { distributorCustomers, customerListLoading, onToggleModal, onRemoveTagClick} = props;
    return (
        <SymphonyListContainer padding="0!important">
            <Box display="flex" justifyContent="space-between" alignItems="center" boxSizing="border-box" marginBottom="8px">
                <Box color="#A2A2A2" fontSize="14px">
                    {`Total ${distributorCustomers.length} Customer${distributorCustomers.length > 1 ? 's' : ''}`}
                </Box>
                <Box display="flex">
                    <CustomerListImportButton
                        endIcon={<Icon className="fas fa-file-import" />}
                    >
                        Import
                    </CustomerListImportButton>
                    <SymphonyHeaderButton
                        startIcon={<AddIcon />}
                        style={{ height: 44, width: 136 }}
                        onClick={onToggleModal}
                    >
                        Customer
                    </SymphonyHeaderButton>
                </Box>
            </Box>
            <SymphonySortableHeaderGridContainer container={true} style={{ padding: '12px 0'}}>
                <SymphonySortableHeaderGrid item={true} xs={3}>
                    <SymphonySortableHeader
                        headerTitle="Distributor Name"
                        headerValue="name"
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true} xs={3}>
                    <SymphonySortableHeader
                        headerTitle="ID"
                        headerValue="displayId"
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true} xs={3}>
                    <SymphonySortableHeader
                        headerTitle="Channel"
                        headerValue=""
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true} xs={3}>
                    <SymphonySortableHeader
                        headerTitle="Salesperson"
                        headerValue=""
                    />
                </SymphonySortableHeaderGrid>
            </SymphonySortableHeaderGridContainer>
            {/* Cards here */}
            {customerListLoading ? <SymphonyContentLoading overrideHeight="calc(100vh - 280px)!important" /> :
                <>
                    {distributorCustomers.length === 0 ? <SymphonyContentLoadingContainer height="calc(100vh - 280px)!important">No Customer Tagged</SymphonyContentLoadingContainer> :
                        <SalesRowsContainer>
                            {map(distributorCustomers, ({ id, name, displayId, channel, salespersonName, logo }) => {
                                const image = (logo as unknown) as MediaInputType; // type cast
                                const imageUndefined = typeof image === 'undefined';
                                return (
                                    // <Link 
                                    //     id={`distributor-customer-view-${id}`}
                                    //     className="hey"
                                    //     key={id} 
                                    //     to={`/sales/distributor/${id}`} 
                                    //     style={{ display: 'flex', textDecoration: 'none', color: 'unset' }}
                                    // > 
                                        <SalesListRowContainer style={{ padding: '12px 0', position: 'relative' }}>
                                            <Grid container={true} >
                                                <SymphonyListGrid item={true} xs={3}>
                                                    <Box display="inline-flex" alignItems="center">
                                                        <SalesListImageContainer style={{ backgroundColor: imageUndefined ? '#F3F3F3' : 'transparent' }}>
                                                            {!imageUndefined ? 
                                                                <img 
                                                                    src={typeof image !== 'undefined' ? image.path : ''} 
                                                                    alt="" style={{ width: 48, height: 'auto', maxHeight: 48 }}
                                                                />
                                                            :
                                                                <DefaultPic style={{ width: 32, height: 32, marginLeft: 4, }} />
                                                            }
                                                        </SalesListImageContainer>
                                                        <Box marginLeft="8px">
                                                            {name || 'Unknown Customer Name'}
                                                        </Box>
                                                    </Box>
                                                </SymphonyListGrid>
                                                <SymphonyListGrid item={true} xs={3}>
                                                    <Box color="#A2A2A2">{displayId || ''}</Box>
                                                </SymphonyListGrid>
                                                <SymphonyListGrid item={true} xs={3}>
                                                    <Box display="inline" color="#A2A2A2">{channel}</Box>
                                                </SymphonyListGrid>
                                                <SymphonyListGrid item={true} xs={3}>
                                                    <Box display="inline" color="#A2A2A2">{salespersonName}</Box>
                                                </SymphonyListGrid>
                                            </Grid>
                                            <Box position="absolute" right="0" top="0" bottom="0" display="flex" alignItems="center">
                                                <CardAux>
                                                    <DecoratedPopoverButton
                                                        id={`distributor-customer-remove-${id}`}
                                                        style={{ color: '#FF4D4D', padding: 8 }}
                                                        endIcon={<Icon className="fa fa-trash-alt" />}
                                                        onClick={() => onRemoveTagClick(id)}
                                                    >
                                                        Remove
                                                    </DecoratedPopoverButton>
                                                </CardAux>
                                            </Box>
                                        </SalesListRowContainer>
                                    // </Link>
                                )
                            })}
                        </SalesRowsContainer>
                    }
                </>
            }
        </SymphonyListContainer>
    )
}

export default DistributorCardList;