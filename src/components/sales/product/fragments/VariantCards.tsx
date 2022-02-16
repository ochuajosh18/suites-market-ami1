import React from 'react';
// local
import {
    ProductVariantsContainer,
    ProductVariantsCardContainer,
    ProductVariantsCard,
    ProductVariantsImageContainer,
    ProductVariantAddContainer,
    ProductVariantDescriptionContainer,
    ProductVariantAuxContainer,
    ProductAuxIconButton
} from './ProductComponents';
import VariantAux from './VariantAux';

// global
import {
    DecoratedPopoverButton
} from '../../common/SalesCommonComponents';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

// material
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import StarIcon from '@material-ui/icons/Star';
import StarOutlineIcon from '@material-ui/icons/StarBorder';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import map from 'lodash/map';
import { BasicProduct, BasicProductSku } from '../../../../store/basicproduct/types';

interface VariantCardsProps {
    productVariants: Array<BasicProductSku>;
    activeProduct?: BasicProduct;
    featuredSku: string;
    onVariantClick: (id: string) => void;
    onAddVariantClick: () => void;
    onDeleteVariantClick: (id: string) => void;
    onDuplicateVariantClick: (id: string) => void;
}

const VariantCards = ({ productVariants, featuredSku, onVariantClick, onAddVariantClick, onDeleteVariantClick, onDuplicateVariantClick }: VariantCardsProps) => {
    const onCardClick = React.useCallback(onVariantClick, []);

    return (
        <ProductVariantsContainer>
            <ProductVariantsCardContainer>
                {map(productVariants, (variant, index) => {
                    const { id, skuNumber } = variant;
                    let primImage = ''
                    for (const m of variant.media) {
                        if (m.type.indexOf('image') > -1 ) {
                            primImage = m.path;
                            break;
                        }
                    }

                    return (
                        <ProductVariantsCard key={id} >
                            <ProductVariantsImageContainer onClick={() => onCardClick(id as string)}>
                                <img src={primImage} alt="" />
                            </ProductVariantsImageContainer>
                            <ProductVariantDescriptionContainer
                                onClick={() => onCardClick(id as string)}
                            >
                                <Box fontSize="16px" marginBottom="4px">{skuNumber}</Box>
                                <Box fontSize="12px" marginBottom="2px" color="#969696">{variant.size || ''}</Box>
                                <Box fontSize="12px" marginBottom="2px" color="#969696">{variant.color || ''}</Box>
                            </ProductVariantDescriptionContainer>
                            <ProductVariantAuxContainer>
                                <Box display="inline-flex">
                                    <ProductAuxIconButton>
                                        {variant.id === featuredSku ?
                                            <StarIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />
                                        :
                                            <StarOutlineIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />
                                        }
                                    </ProductAuxIconButton>
                                    <VariantAux>
                                        <DecoratedPopoverButton
                                            id={`product-variant-delete-${id}`}
                                            style={{ color: '#FF4D4D' }}
                                            endIcon={<Icon className="fa fa-trash-alt" />}
                                            onClick={() => onDeleteVariantClick(id as string)}
                                            
                                        >
                                            Delete
                                        </DecoratedPopoverButton>
                                        <DecoratedPopoverButton
                                            id={`product-variant-duplicate-${id}`}
                                            style={{ color: SYMPHONY_PRIMARY_COLOR }}
                                            endIcon={<FileCopyIcon style={{ width: 14, height: 14 }} />}
                                            onClick={() => onDuplicateVariantClick(id as string)}
                                        >
                                            Duplicate
                                        </DecoratedPopoverButton>
                                    </VariantAux>
                                </Box>
                            </ProductVariantAuxContainer>
                        </ProductVariantsCard>
                    )
                })}
                <ProductVariantsCard 
                    id="product-variant-add-btn" 
                    className="add-variant-card"
                    onClick={onAddVariantClick}
                >
                    <ProductVariantAddContainer>
                        <AddCircleIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />
                        New SKU
                    </ProductVariantAddContainer>
                </ProductVariantsCard>
            </ProductVariantsCardContainer>
        </ProductVariantsContainer>
    )
}

export default VariantCards;