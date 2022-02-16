import React from 'react';
import { Link } from 'react-router-dom';
import { BasicProduct, BasicProductMedia } from '../../../../store/basicproduct/types';

import { 
    SymphonySortableHeaderGridContainer,
    SymphonySortableHeaderGrid
} from '../../../symphony/SymphonyCommonComponents';
import SymphonySortableHeader from '../../../symphony/SymphonySortableHeader';

import { 
    ProductListContainer,
    ProductRowContainer,
    ProductGrid,
    ProductImageContainer,
    ProductRowsContainer
} from './ProductComponents';

// material
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

// util
import map from 'lodash/map';

// default svg
import { ReactComponent as DefaultPic } from '../../../Basic/Common/BasicDefaultSvg.svg';

interface ProductCardListProps {
    products: Array<BasicProduct>;
}

const ProductCardList = (props: ProductCardListProps) => {
    return (
        <ProductListContainer>
            {/* Header here */}
            <SymphonySortableHeaderGridContainer container={true}>
                <SymphonySortableHeaderGrid item={true} xs={5}>
                    <SymphonySortableHeader
                        headerTitle="Product Name"
                        headerValue="name"
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true} xs={3}>
                    <SymphonySortableHeader
                        headerTitle="Code"
                        headerValue="displayId"
                    />
                </SymphonySortableHeaderGrid>
                <SymphonySortableHeaderGrid item={true} xs={4}>
                    <SymphonySortableHeader
                        headerTitle="Hierarchy"
                        headerValue=""
                    />
                </SymphonySortableHeaderGrid>
            </SymphonySortableHeaderGridContainer>
            {/* Cards here */}
            <ProductRowsContainer>
                {map(props.products, ({ id, name, displayId, h1, h2, h3, featuredSkuImage, varietiesCount }) => {
                    const image = (featuredSkuImage as unknown) as BasicProductMedia; // type cast
                    const imageUndefined = typeof image === 'undefined';
                    return (
                        <Link 
                            id={`product-view-${id}`}
                            key={id} 
                            to={`/sales/product/${id}`} 
                            style={{ display: 'flex', textDecoration: 'none', color: 'unset' }}
                        > 
                            <ProductRowContainer>
                                <Grid container={true} >
                                    <ProductGrid item={true} xs={5}>
                                        <Box display="inline-flex" alignItems="center">
                                            <ProductImageContainer style={{ backgroundColor: imageUndefined ? '#F3F3F3' : 'transparent', marginRight: 8 }}>
                                                {!imageUndefined ? 
                                                    <img 
                                                        src={typeof image !== 'undefined' ? image.path : ''} 
                                                        alt="" style={{ width: 50, height: 'auto', maxHeight: 60 }}
                                                    />
                                                :
                                                    <DefaultPic style={{ width: 32, height: 32, marginLeft: 4, }} />
                                                }
                                            </ProductImageContainer>
                                            <Box>
                                                {name}
                                                <Box color="#A2A2A2">
                                                    {varietiesCount || '1'} {varietiesCount && varietiesCount > 1 ? 'Varieties' : 'Variety'}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </ProductGrid>
                                    <ProductGrid item={true} xs={3} color="#A2A2A2">
                                        {displayId || ''}
                                    </ProductGrid>
                                    <ProductGrid item={true} xs={4}>
                                        <Box display="inline" color="#A2A2A2">{`${h1}/${h2}/${h3}`}</Box>
                                    </ProductGrid>
                                </Grid>
                            </ProductRowContainer>
                        </Link>
                    )
                })}
            </ProductRowsContainer>
            
        </ProductListContainer>
    )
}

export default ProductCardList;