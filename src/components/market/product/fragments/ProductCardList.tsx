import React from 'react';
import { Link } from 'react-router-dom';
import { GenericMedia } from '../../../../store/system/types';
import { MarketProduct } from '../../../../store/marketproduct/types';
import { 
    ProductListContainer,
    ProductRowContainer,
    ProductGrid,
    ProductImageContainer
} from './ProductComponents';
import SymphonyImage from '../../../symphony/SymphonyImage';

// material
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

// util
import map from 'lodash/map';

interface ProductCardListProps {
    products: Array<MarketProduct>;
}

const ProductCardList = (props: ProductCardListProps) => {
    return (
        <ProductListContainer>
            {/* Cards here */}
            {map(props.products, ({ id, name, displayId, h1, h2, h3, image, varietiesCount }, index) => {
                const im: GenericMedia = image as GenericMedia;
                const imageUndefined = typeof im === 'undefined';
                return (
                    <Link 
                        id={`product-view-${id}`}
                        key={id} 
                        to={`/market/product/${id}`} 
                        style={{ display: 'flex', textDecoration: 'none', color: 'unset' }}
                    > 
                        <ProductRowContainer>
                                <ProductImageContainer>
                                    <SymphonyImage 
                                        src={imageUndefined ? '' : im.path} 
                                        style={{ width: 50, height: 'auto', maxHeight: 60 }}
                                    />
                                </ProductImageContainer>
                                <Grid container={true} style={{ margin: '0 16px'}}>
                                    <ProductGrid item={true} xs={5}>
                                        {name}
                                        <Box color="#A2A2A2">
                                            {varietiesCount || '1'} {varietiesCount && varietiesCount > 1 ? 'Varieties' : 'Variety'}
                                        </Box>
                                    </ProductGrid>
                                    <ProductGrid item={true} xs={3} color="#A2A2A2">
                                        <Box display="inline">
                                            Code: 
                                            <Box color="#A2A2A2" display="inline" paddingLeft="4px">
                                                {displayId || ''}
                                            </Box>
                                        </Box>
                                    </ProductGrid>
                                    <ProductGrid item={true} xs={4}>
                                        <Box display="inline">
                                            <Box display="inline" fontWeight="bold">Hierarchy: </Box>
                                            <Box className="word-break-all" display="inline" color="#A2A2A2">{`${h1}${h2 ? `/${h2}` : ''}${h3 ? `/${h3}` : ''}`}</Box>
                                        </Box>
                                    </ProductGrid>
                                </Grid>
                        </ProductRowContainer>
                    </Link>
                )
            })}
            
        </ProductListContainer>
    )
}

export default ProductCardList;