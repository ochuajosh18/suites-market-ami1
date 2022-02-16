import React from 'react';
import { Link } from 'react-router-dom';
import { Salesperson } from '../../../../store/salesperson/types';
import { MediaInputType } from '../../../../store/system/types';

import { 
    SymphonySortableHeaderGridContainer,
    SymphonySortableHeaderGrid
} from '../../../symphony/SymphonyCommonComponents';
import SymphonySortableHeader from '../../../symphony/SymphonySortableHeader';

import { 
    SalesListContainer,
    SalesRowsContainer,
    SalesListRowContainer,
    SalesListGrid,
    SalesListImageContainer
} from '../../common/SalesCommonComponents';

// material
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

// util
import map from 'lodash/map';

// default svg
import { ReactComponent as DefaultPic } from '../../../Basic/Common/BasicDefaultSvg.svg';

interface SalespersonCardListProps {
    salespersons: Array<Salesperson>;
}

const SalespersonCardList = (props: SalespersonCardListProps) => {
    const { salespersons } = props;
    return (
        <SalesListContainer>
            <SymphonySortableHeaderGridContainer container={true}>
                <SymphonySortableHeaderGrid item={true} xs={4}>
                    <SymphonySortableHeader
                        headerTitle="Salerperson Name"
                        headerValue="name"
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true} xs={4}>
                    <SymphonySortableHeader
                        headerTitle="ID"
                        headerValue="displayId"
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true} xs={4}>
                    <SymphonySortableHeader
                        headerTitle="Email"
                        headerValue=""
                    />
                </SymphonySortableHeaderGrid>
            </SymphonySortableHeaderGridContainer>
            {/* Cards here */}
            <SalesRowsContainer>
                {map(salespersons, ({ id, name, displayId, email, avatar, role }) => {
                    const image = (avatar as unknown) as MediaInputType; // type cast
                    const imageUndefined = typeof image === 'undefined';
                    return (
                        <Link 
                            id={`salesperson-view-${id}`}
                            key={id} 
                            to={`/sales/salesperson/${id}`} 
                            style={{ display: 'flex', textDecoration: 'none', color: 'unset' }}
                        > 
                            <SalesListRowContainer>
                                <Grid container={true}>
                                    <SalesListGrid item={true} xs={4}>
                                        <Box display="inline-flex" alignItems="center">
                                            <SalesListImageContainer style={{ backgroundColor: imageUndefined ? '#F3F3F3' : 'transparent', marginRight: 8 }}>
                                                {!imageUndefined ? 
                                                    <img 
                                                        src={typeof image !== 'undefined' ? image.path : ''} 
                                                        alt="" style={{ width: 48, height: 'auto', maxHeight: 48 }}
                                                    />
                                                :
                                                    <DefaultPic style={{ width: 32, height: 32, marginLeft: 4, }} />
                                                }
                                            </SalesListImageContainer>
                                            {name || 'Unknown Salesperson Name'}
                                        </Box>
                                    </SalesListGrid>
                                    <SalesListGrid item={true} xs={4} color="#A2A2A2">
                                        {displayId || ''}
                                    </SalesListGrid>
                                    <SalesListGrid item={true} xs={4}>
                                        <Box display="inline" color="#A2A2A2">{email}</Box>
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

export default SalespersonCardList;