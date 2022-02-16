import React from 'react';
import { Link } from 'react-router-dom';
import { ICustomer as Customer } from '../../../../store/customer/types';
import { MediaInputType } from '../../../../store/system/types';

import { 
    SymphonySortableHeaderGridContainer,
    SymphonySortableHeaderGrid
} from '../../../symphony/SymphonyCommonComponents';
import SymphonySortableHeader from '../../../symphony/SymphonySortableHeader';

import { 
    SalesListContainer,
    SalesListRowContainer,
    SalesListGrid,
    SalesListImageContainer,
    SalesRowsContainer
} from '../../common/SalesCommonComponents';

// material
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

// util
import map from 'lodash/map';

// default svg
import { ReactComponent as DefaultPic } from '../../../Basic/Common/BasicDefaultSvg.svg';

interface CustomerCardListProps {
    customers: Array<Customer>;
}

const CustomerCardList = (props: CustomerCardListProps) => {
    const { customers } = props;
    return (
        <SalesListContainer>
            <SymphonySortableHeaderGridContainer container={true}>
                <SymphonySortableHeaderGrid item={true} xs={3}>
                    <SymphonySortableHeader
                        headerTitle="Customer Name"
                        headerValue="name"
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true} xs={3}>
                    <SymphonySortableHeader
                        headerTitle="Code"
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
            <SalesRowsContainer>
                {map(customers, ({ id, name, displayId, channel, salespersonName, logo, numberOfContacts }) => {
                    const image = (logo as unknown) as MediaInputType; // type cast
                    const imageUndefined = typeof image === 'undefined';
                    return (
                        <Link 
                            id={`customer-view-${id}`}
                            className="hey"
                            key={id} 
                            to={`/sales/customer/${id}`} 
                            style={{ display: 'flex', textDecoration: 'none', color: 'unset' }}
                        > 
                            <SalesListRowContainer>
                                <Grid container={true} >
                                    <SalesListGrid item={true} xs={3}>
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
                                                <Box color="#A2A2A2">
                                                    {numberOfContacts || 'No'} {numberOfContacts && numberOfContacts > 1 ? 'Contact Persons' : 'Contact Person'}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </SalesListGrid>
                                    <SalesListGrid item={true} xs={3} color="#A2A2A2">
                                        {displayId || ''}
                                    </SalesListGrid>
                                    <SalesListGrid item={true} xs={3}>
                                        <Box display="inline" color="#A2A2A2">{channel}</Box>
                                    </SalesListGrid>
                                    <SalesListGrid item={true} xs={3}>
                                        <Box display="inline" color="#A2A2A2">{salespersonName}</Box>
                                    </SalesListGrid>
                                </Grid>
                            </SalesListRowContainer>
                        </Link>
                    )
                })}
            </SalesRowsContainer>
        </SalesListContainer>
    )
}

export default CustomerCardList;