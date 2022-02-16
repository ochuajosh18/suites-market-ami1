import React from 'react';
import { MarketProduct, MarketProductSku } from '../../../../store/marketproduct/types';
import { GenericMedia } from '../../../../store/system/types';

// local
import {
    ProductVariantContentContainer,
    ProductViewTabsContainer,
    ProductViewTabs,
    ProductViewTab,
    ProductVariantsInputContainer,
    ProductVariantsAuxContainer,
    ProductAuxButton
} from './ProductComponents';

// global
import {
    SymphonySectionHeaderContainer,
    SymphonyBackButton,
    SymphonySectionHeaderTitleContainer,
    DecoratedPopoverButton,
    SymphonyViewInfoContainer
} from '../../../symphony/SymphonyCommonComponents';

// symphony
import SymphonyInput from '../../../symphony/SymphonyInput';
import SymphonyMediaInput from '../../../symphony/SymphonyMediaInput';
import MarketAuxMenu from '../../common/MarketAuxMenu';

// material
import Icon from '@material-ui/core/Icon';
import StarIcon from '@material-ui/icons/Star';
import StarOutlineIcon from '@material-ui/icons/StarBorder';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

// hooks
import useScrollableTabs from '../../../symphony/hooks/useScrollableTabs';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

interface VariantViewProps {
    featuredSku: string;
    variant: MarketProductSku;
    existingVariant?: MarketProductSku;
    activeProduct?: MarketProduct;
    currency: string;
    onDeleteVariantClick: (id: string) => void;
    onVariantInput: (field: string, value: string | boolean | Array<GenericMedia>) => void;
    onFeaturedSkuClick: (id: string) => void;
    onBackClick: () => void;
    onVariantMediaDelete: (path: string, fileName?: string) => void;
}

const VariantView = (props: VariantViewProps) => {
    const gRef = React.useRef<HTMLElement>(null);
    const pRef = React.useRef<HTMLElement>(null);
    const GENERAL_INFORMATION = 'General Information';
    const PRODUCT_MEDIA = 'Product Media'
    const [tab, setTab] = React.useState<typeof GENERAL_INFORMATION | typeof PRODUCT_MEDIA>(GENERAL_INFORMATION);
    const [withDiscountPrice, setWithDiscountPrice] = React.useState(false);
    const [withBargainPrice, setWithBargainPrice] = React.useState(false);
    const [disableSpecialPrice, setDisableSpecialPrice] = React.useState(false);
    const [disableSize, setDisableSize] = React.useState(false);
    const [disableColor, setDisableColor] = React.useState(false);
    const [onTabClick, onScroll] = useScrollableTabs([gRef, pRef], (target: string) => {
        if (target) {
            setTab(target as typeof GENERAL_INFORMATION | typeof PRODUCT_MEDIA);
        }
    });

    // vars
    const { onVariantInput, onDeleteVariantClick, onBackClick, onFeaturedSkuClick, onVariantMediaDelete, variant, existingVariant, featuredSku, activeProduct } = props; // props destructure
    const { id, unit, skuNumber, isActive, price, discountPrice, color, size, marketStock, minBargainPrice, maxBargainPrice, minSpecialPrice, maxSpecialPrice, media } = variant; // variant destructure
    const onDeleteClick = React.useCallback(onDeleteVariantClick, []);
    const newProductComparator = variant.id && variant.id!.indexOf('PRODUCT::SKU') > -1
    const numberRegex: RegExp = /^[0-9.]+$/;
    const addDecimal = (input: string): string =>   parseFloat(isNaN(parseFloat(input)) ? '0.00' : input).toFixed(2);

    // eslint-disable-next-line
    React.useEffect(() => {
        const p = parseFloat(price as string);
        const dp = parseFloat(discountPrice as string);
        const minbp = parseFloat(minBargainPrice as string);
        const maxbp = parseFloat(maxBargainPrice as string);
        
        if(dp) {
            setWithDiscountPrice(true); // disable bargain price and special price
        }
        else setWithDiscountPrice(false);

        if((minBargainPrice || maxBargainPrice) && (minbp || maxbp)) {
            setWithBargainPrice(true); // disable discount price
        }
        else setWithBargainPrice(false)

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
        }
    });
    
    return (
        <ProductVariantContentContainer key={id}>
            <ProductViewTabsContainer>
                <ProductViewTabs
                    orientation="vertical"
                    value={tab}
                    TabIndicatorProps={{ style: { width: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                >
                    <ProductViewTab
                        label={GENERAL_INFORMATION}
                        value={GENERAL_INFORMATION}
                        onClick={onTabClick}
                        id="product-variant-view-general"
                    />
                    <ProductViewTab
                        label={PRODUCT_MEDIA}
                        value={PRODUCT_MEDIA}
                        onClick={onTabClick}
                        id="product-variant-view-media"
                    />
                </ProductViewTabs>
            </ProductViewTabsContainer>
            <SymphonyViewInfoContainer onScroll={onScroll}>
                <SymphonySectionHeaderContainer style={{ justifyContent: 'space-between' }} innerRef={gRef}>
                    <SymphonySectionHeaderTitleContainer style={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center' }}>
                        {activeProduct && activeProduct.id && 
                            <SymphonyBackButton onClick={onBackClick}>
                                <ArrowBackIcon />
                            </SymphonyBackButton>
                        }
                        General Information
                    </SymphonySectionHeaderTitleContainer>
                    <ProductVariantsAuxContainer>
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
                            <MarketAuxMenu>
                                <DecoratedPopoverButton
                                    style={{ color: '#FF4D4D' }}
                                    endIcon={<Icon className="fa fa-trash-alt" />}
                                    onClick={() => onDeleteClick(id as string)}
                                >
                                    Delete
                                </DecoratedPopoverButton>
                            </MarketAuxMenu>
                        }
                    </ProductVariantsAuxContainer>
                </SymphonySectionHeaderContainer>
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
                        id="variant-unit-input"
                        value={unit as string || ''}
                        label="Unit"
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            onVariantInput('unit', e.target.value);
                        }}
                    />
                    <SymphonyInput
                        id="variant-size-input"
                        value={size as string}
                        label="Size"
                        type="text"
                        disabled={disableSize}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            onVariantInput('size', e.target.value);
                        }}
                    />
                    <SymphonyInput
                        id="variant-color-input"
                        value={color as string}
                        label="Color"
                        disabled={disableColor}
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            onVariantInput('color', e.target.value);
                        }}
                    />
                    <SymphonyInput
                        id="variant-stock-input"
                        value={marketStock as string || ''}
                        label="Stock"
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            const wholeNumberRegex: RegExp = /^(\s*|\d+)$/
                            if (wholeNumberRegex.test(e.target.value) || e.target.value.length === 0) {
                                onVariantInput('marketStock', e.target.value);
                            }
                        }}
                    />
                    <SymphonyInput
                        id="variant-price-input"
                        value={price as string}
                        label="Display Price"
                        type='decoratedtext'
                        inputAdornment={props.currency}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            if (numberRegex.test(e.target.value) || e.target.value.length === 0) {
                                onVariantInput('price', e.target.value);
                            }
                        }}
                        onBlur={() => {
                            onVariantInput('price', addDecimal(price as string));
                        }}
                    />
                    <SymphonyInput
                        id="variant-discountedprice-input"
                        value={discountPrice as string}
                        label="Discounted Price"
                        type='decoratedtext'
                        inputAdornment={props.currency}
                        disabled={withBargainPrice}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            if (numberRegex.test(e.target.value) || e.target.value.length === 0) {
                                onVariantInput('discountPrice', e.target.value);
                            }
                        }}
                        onBlur={() => {
                            onVariantInput('discountPrice', addDecimal(discountPrice as string));
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
                        inputAdornment={props.currency}
                        disabled={withDiscountPrice}
                        decoratedTextRangeOverrideDisabledTwo={true}
                        decoratedTextOneChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            if (numberRegex.test(e.target.value) || e.target.value.length === 0) {
                                onVariantInput('minBargainPrice', e.target.value);
                            }
                        }}
                        decoratedTextTwoChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            if (numberRegex.test(e.target.value) || e.target.value.length === 0) {
                                onVariantInput('maxBargainPrice', e.target.value);
                            }
                        }}
                        onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            const isMin = e.currentTarget.id === 'variant-bargainprice-min-input';
                            const value =  isMin ? minBargainPrice : maxBargainPrice;
                            onVariantInput(isMin ? 'minBargainPrice' : 'maxBargainPrice', addDecimal(value as string));
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
                        inputAdornment={props.currency}
                        disabled={withDiscountPrice || disableSpecialPrice}
                        decoratedTextRangeOverrideDisabledTwo={true}
                        decoratedTextOneChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            if (numberRegex.test(e.target.value) || e.target.value.length === 0) {
                                onVariantInput('minSpecialPrice', e.target.value);
                            }
                        }}
                        decoratedTextTwoChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            if (numberRegex.test(e.target.value) || e.target.value.length === 0) {
                                onVariantInput('maxSpecialPrice', e.target.value);
                            }
                        }}
                        onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            const isMin = e.currentTarget.id === 'variant-specialprice-min-input';
                            const value =  isMin ? minSpecialPrice : maxSpecialPrice;
                            onVariantInput(isMin ? 'minSpecialPrice' : 'maxSpecialPrice', addDecimal(value as string));
                        }}
                    />
                </ProductVariantsInputContainer>
                <SymphonySectionHeaderContainer innerRef={pRef}>
                    <SymphonySectionHeaderTitleContainer>
                        Product Media
                    </SymphonySectionHeaderTitleContainer>
                </SymphonySectionHeaderContainer>
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
                </ProductVariantsInputContainer>
            </SymphonyViewInfoContainer>
        </ProductVariantContentContainer>
    )
}

export default VariantView;