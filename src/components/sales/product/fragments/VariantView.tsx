import React from 'react';
import { BasicProduct, BasicProductSku, DynamicBasicProductInput } from '../../../../store/basicproduct/types';
import { Field } from '../../../../store/fields/types';

// local
import {
    ProductVariantContentContainer,
    ProductAuxButton
} from './ProductComponents';

// global
import {
    DecoratedPopoverButton,
    SalesBackButton
} from '../../common/SalesCommonComponents';

// symphony
import {
    SymphonyViewInfoContainer,
    SymphonyViewTabs,
    SymphonyViewTab,
    SymphonyViewTabsContainer,
    SymphonySectionHeaderContainer,
    SymphonySectionHeaderTitleContainer,
} from '../../../symphony/SymphonyCommonComponents';
import SymphonyModuleFieldRenderer from '../../../symphony/SymphonyModuleFieldRenderer';
import SalesAuxMenu from '../../common/SalesAuxMenu';

// material
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import StarIcon from '@material-ui/icons/Star';
import StarOutlineIcon from '@material-ui/icons/StarBorder';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

// hooks
import useScrollableTabs from '../../../symphony/hooks/useScrollableTabs';

import map from 'lodash/map';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

interface VariantViewProps {
    featuredSku: string;
    variant: BasicProductSku;
    variantCount: number;
    existingVariant?: BasicProductSku;
    activeProduct?: BasicProduct;
    fields: Array<Field>;
    sections: Array<string>;
    isDuplicating: boolean;
    onDeleteVariantClick: (id: string) => void;
    onVariantInput: (field: string, value: DynamicBasicProductInput) => void;
    onFeaturedSkuClick: (id: string) => void;
    onBackClick: () => void;
    onVariantMediaDelete: (path: string, fileName?: string) => void;
}

const VariantView = (props: VariantViewProps) => {
    const { onVariantInput, onDeleteVariantClick, onBackClick, onFeaturedSkuClick, onVariantMediaDelete, variant, isDuplicating, variantCount, existingVariant, featuredSku, activeProduct, fields, sections } = props; // props destructure   
    const refs = [...sections.map(() => React.createRef<HTMLElement>()), React.createRef<HTMLElement>()];
    const [tab, setTab] = React.useState<string>(sections[0]);
    const [onTabClick, onScroll] = useScrollableTabs(refs, (target: string) => {
        if (sections.length > 1) {
            setTab(target as string);
        }
    });
    const onDeleteClick = React.useCallback(onDeleteVariantClick, []);
    const newProductComparator = variant.id && variant.id!.indexOf('PRODUCT::SKU') > -1
    
    // internal logic 
    const [withDiscountPrice, setWithDiscountPrice] = React.useState(false);
    // const [withBargainPrice, setWithBargainPrice] = React.useState(false);
    const [disableSpecialPrice, setDisableSpecialPrice] = React.useState(false);
    const [disableSize, setDisableSize] = React.useState(false);
    const [disableColor, setDisableColor] = React.useState(false);
    const { id, price, discountPrice, minBargainPrice } = variant;
    // eslint-disable-next-line
    React.useEffect(() => {
        const p = parseFloat(price as string);
        const dp = parseFloat(discountPrice as string);
        const minbp = parseFloat(minBargainPrice as string);
        // const maxbp = parseFloat(maxBargainPrice as string);
        
        if(dp) {
            setWithDiscountPrice(true); // disable bargain price and special price
        }
        else setWithDiscountPrice(false);

        // if((minBargainPrice || maxBargainPrice) && (minbp || maxbp)) {
        //     setWithBargainPrice(true); // disable discount price
        // }
        // else setWithBargainPrice(false)

        if ((minbp && p )|| (!minbp)) {
            if (minbp < p / 2 + 2) { // check if min bargain price / 2 + 2
                setDisableSpecialPrice(true);
            }
            else setDisableSpecialPrice(false);
        }
        else setDisableSpecialPrice(false);
        

        // disable size or color
        if (existingVariant) {
            if (!existingVariant.size) setDisableSize(true);
            if (!existingVariant.color) setDisableColor(true);
            if (variantCount === 1 && existingVariant.id === id) {
                // last product edit
                setDisableColor(false);
                setDisableSize(false);
            }
        }
    });
    return (
        <ProductVariantContentContainer>
            <SymphonyViewTabsContainer>
                <SymphonyViewTabs
                    orientation="vertical"
                    value={tab}
                    TabIndicatorProps={{ style: { width: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                >
                    {map(sections, (s) => {
                        return (
                            <SymphonyViewTab
                                key={s}
                                label={s}
                                value={s}
                                onClick={onTabClick}
                                id={`${s}-tab`}
                            />
                        )
                    })}
                </SymphonyViewTabs>
            </SymphonyViewTabsContainer>
            <SymphonyViewInfoContainer onScroll={onScroll}>
                {map(sections, (s, i) => {
                    return (
                        <Box key={`${s}-section`} id={s}>
                            <SymphonySectionHeaderContainer key={s} style={{ justifyContent: 'space-between' }} innerRef={refs[i]}>
                                <SymphonySectionHeaderTitleContainer>
                                    <Box display="flex" alignItems="center">
                                        {i === 0 && (activeProduct && activeProduct.id && activeProduct.id.indexOf('PRODUCT') > -1) &&
                                            <SalesBackButton onClick={onBackClick}>
                                                <ArrowBackIcon />
                                            </SalesBackButton> 
                                        }
                                        {s}
                                    </Box>
                                </SymphonySectionHeaderTitleContainer>
                                {i === 0 && 
                                    <Box display="flex" flexDirection="reverse-row">
                                        <ProductAuxButton 
                                            onClick={() => onFeaturedSkuClick(variant.id!)}
                                            style={{ marginRight: newProductComparator ? 16 : 0 }}
                                        >
                                            {variant.id === featuredSku || (!(newProductComparator || (activeProduct && activeProduct.id && activeProduct.id.indexOf('PRODUCT') > -1))) ? 
                                                <StarIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />
                                            :
                                                <StarOutlineIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />
                                            }
                                        </ProductAuxButton>
                                        {newProductComparator &&
                                            <SalesAuxMenu>
                                                <DecoratedPopoverButton
                                                    style={{ color: '#FF4D4D' }}
                                                    endIcon={<Icon className="fa fa-trash-alt" />}
                                                    onClick={() => onDeleteClick(variant.id! as string)}
                                                >
                                                    Delete
                                                </DecoratedPopoverButton>
                                            </SalesAuxMenu>
                                        }
                                    </Box>
                                }
                            </SymphonySectionHeaderContainer>
                            <SymphonyModuleFieldRenderer
                                fields={map(fields, (f) => {
                                    switch (f.name) {
                                        case 'bargainPriceRange': return {
                                            ...f,
                                            minDisabled: withDiscountPrice || isDuplicating,
                                            maxDisabled: true
                                        }
                                        case 'specialPriceRange': return {
                                            ...f,
                                            disabled: withDiscountPrice || disableSpecialPrice || isDuplicating,
                                            maxDisabled: true
                                        }
                                        case 'size': return {
                                            ...f,
                                            disabled: disableSize
                                        }
                                        case 'color': return {
                                            ...f,
                                            disabled: disableColor
                                        }
                                        case 'stock': 
                                        case 'skuNumber': return {
                                            ...f,
                                            disabled: false
                                        }       
                                        default: return {
                                            ...f,
                                            disabled: isDuplicating
                                        };
                                    }
                                })}
                                section={s}
                                entity={variant}
                                onEntityInput={onVariantInput}
                                onMediaDelete={onVariantMediaDelete}
                            />
                        </Box>
                    )
                })}
                {/* <SalesSectionHeaderContainer style={{ justifyContent: 'space-between' }} innerRef={gRef}>
                    <SalesSectionHeaderTitleContainer style={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center' }}>
                        <SalesBackButton onClick={onBackClick}>
                            <ArrowBackIcon />
                        </SalesBackButton>
                        General Information
                    </SalesSectionHeaderTitleContainer>
                    <ProductVariantsAuxContainer>
                        <ProductAuxButton 
                            onClick={() => onFeaturedSkuClick(variant.id!)}
                            style={{ marginRight: newProductComparator ? 16 : 0 }}
                        >
                            {variant.id === featuredSku || (!(newProductComparator || (activeProduct && activeProduct.id && activeProduct.id.indexOf('PRODUCT') > -1))) ? 
                                <StarIcon htmlColor="#4C89F5" />
                            :
                                <StarOutlineIcon htmlColor="#4C89F5" />
                            }
                        </ProductAuxButton>
                        {newProductComparator &&
                            <SalesAuxMenu>
                                <DecoratedPopoverButton
                                    style={{ color: '#FF4D4D' }}
                                    endIcon={<Icon className="fa fa-trash-alt" />}
                                    onClick={() => onDeleteClick(id as string)}
                                >
                                    Delete
                                </DecoratedPopoverButton>
                            </SalesAuxMenu>
                        }
                    </ProductVariantsAuxContainer>
                </SalesSectionHeaderContainer>
                <ProductVariantsInputContainer>
                    <SymphonyInput
                        id="variant-skunumber-input"
                        value={skuNumber}
                        label="SKU Number"
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            onVariantInput('skuNumber', e.target.value);
                        }}
                    />
                    <SymphonyInput
                        id="variant-status-input"
                        value={isActive as boolean}
                        label="Status"
                        type="radio"
                        radioTrueText="Active"
                        radioFalseText="Inactive"
                        onRadioButtonChange={(val: boolean) => {
                            onVariantInput('isActive', val);
                        }}
                    />
                    <SymphonyInput
                        id="variant-size-input"
                        value={size as string}
                        label="Size"
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            onVariantInput('size', e.target.value);
                        }}
                    />
                    <SymphonyInput
                        id="variant-color-input"
                        value={color as string}
                        label="Color"
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            onVariantInput('color', e.target.value);
                        }}
                    />
                    <SymphonyInput
                        id="variant-price-input"
                        value={price as string}
                        label="Price"
                        type='decoratedtext'
                        inputAdornment="Php"
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            if (numberRegex.test(e.target.value) || e.target.value.length === 0) {
                                onVariantInput('price', e.target.value);
                            }
                        }}
                    />
                    <SymphonyInput
                        decoratedTextRangeOneId="variant-bargainprice-min-input"
                        decoratedTextRangeTwoId="variant-bargainprice-max-input"
                        value=""
                        decoratedTextRangeOneValue={minBargainPrice as string}
                        decoratedTextRangeTwoValue={maxBargainPrice as string}
                        label="Bargain Price Range"
                        type='decoratedtextrange'
                        inputAdornment="Php"
                        decoratedTextOneChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            if (numberRegex.test(e.target.value)) {
                                onVariantInput('minBargainPrice', e.target.value);
                            }
                        }}
                        decoratedTextTwoChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            if (numberRegex.test(e.target.value)) {
                                onVariantInput('maxBargainPrice', e.target.value);
                            }
                        }}
                    />
                    <SymphonyInput
                        decoratedTextRangeOneId="variant-specialprice-min-input"
                        decoratedTextRangeTwoId="variant-specialprice-max-input"
                        value=""
                        decoratedTextRangeOneValue={minSpecialPrice as string}
                        decoratedTextRangeTwoValue={maxSpecialPrice as string}
                        label="Special Price Range"
                        type='decoratedtextrange'
                        inputAdornment="Php"
                        decoratedTextOneChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            if (numberRegex.test(e.target.value)) {
                                onVariantInput('minSpecialPrice', e.target.value);
                            }
                        }}
                        decoratedTextTwoChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            if (numberRegex.test(e.target.value)) {
                                onVariantInput('maxSpecialPrice', e.target.value);
                            }
                        }}
                    />
                </ProductVariantsInputContainer>
                <SalesSectionHeaderContainer innerRef={pRef}>
                    <SalesSectionHeaderTitleContainer>
                        Product Media
                    </SalesSectionHeaderTitleContainer>
                </SalesSectionHeaderContainer>
                <ProductVariantsInputContainer>
                    <SymphonyMediaInput
                        mediaList={media}
                        onMediaInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.files) {
                                onVariantInput('media', [...media, {
                                    path: '',
                                    size: 0,
                                    name: '',
                                    type: e.target.files[0].type,
                                    file: e.target.files[0]
                                }] as Array<GenericMedia>)
                            }
                        }}
                        onMediaDelete={onVariantMediaDelete}
                    />
                </ProductVariantsInputContainer> */}
            </SymphonyViewInfoContainer>
        </ProductVariantContentContainer>
    )
}

export default VariantView;