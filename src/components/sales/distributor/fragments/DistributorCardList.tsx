import React from 'react';
import { Link } from 'react-router-dom';
import { Distributor } from '../../../../store/distributor/types';
import { MediaInputType } from '../../../../store/system/types';

import { 
    SymphonySortableHeaderGridContainer,
    SymphonySortableHeaderGrid,
    SymphonyListContainer,
    SymphonyListGrid,
} from '../../../symphony/SymphonyCommonComponents';
import SymphonySortableHeader from '../../../symphony/SymphonySortableHeader';

import { 
    SalesListRowContainer,
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

interface DistributorCardListProps {
    distributors: Array<Distributor>;
}

const DistributorCardList = (props: DistributorCardListProps) => {
    const { distributors } = props;
    return (
        <SymphonyListContainer>
            <SymphonySortableHeaderGridContainer container={true}>
                <SymphonySortableHeaderGrid item={true} xs={4}>
                    <SymphonySortableHeader
                        headerTitle="Distributor Name"
                        headerValue="name"
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true} xs={4}>
                    <SymphonySortableHeader
                        headerTitle="ID"
                        headerValue="displayId"
                    />
                </SymphonySortableHeaderGrid>
                {/* <SymphonySortableHeaderGrid item={true} xs={3}>
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
                </SymphonySortableHeaderGrid> */}
            </SymphonySortableHeaderGridContainer>
            {/* Cards here */}
            <SalesRowsContainer>
                {map(distributors, ({ id, name, displayId, channel, salespersonName, logo, numberOfContacts }) => {
                    const image = (logo as unknown) as MediaInputType; // type cast
                    const imageUndefined = typeof image === 'undefined';
                    return (
                        <Link 
                            id={`distributor-view-${id}`}
                            className="hey"
                            key={id} 
                            to={`/sales/distributor/${id}`} 
                            style={{ display: 'flex', textDecoration: 'none', color: 'unset' }}
                        > 
                            <SalesListRowContainer>
                                <Grid container={true} >
                                    <SymphonyListGrid item={true} xs={4}>
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
                                                {name || 'Unknown Distributor Name'}
                                            </Box>
                                        </Box>
                                    </SymphonyListGrid>
                                    <SymphonyListGrid item={true} xs={4} color="#A2A2A2">
                                        {displayId || ''}
                                    </SymphonyListGrid>
                                    {/* <SymphonyListGrid item={true} xs={3}>
                                        <Box display="inline" color="#A2A2A2">{channel}</Box>
                                    </SymphonyListGrid>
                                    <SymphonyListGrid item={true} xs={3}>
                                        <Box display="inline" color="#A2A2A2">{salespersonName}</Box>
                                    </SymphonyListGrid> */}
                                </Grid>
                            </SalesListRowContainer>
                        </Link>
                    )
                })}
            </SalesRowsContainer>
        </SymphonyListContainer>
    )
}

export default DistributorCardList;