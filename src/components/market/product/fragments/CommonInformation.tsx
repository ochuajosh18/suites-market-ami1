import React from 'react';
import { MarketProduct, HierarchyOne, HierarchyTwo } from '../../../../store/marketproduct/types';
import { AutocompleteKeyPair } from '../../../../store/system/types';

// symphony components
import {
    SymphonyViewTabs,
    SymphonyViewTab,
    SymphonyViewTabsContainer,
    SymphonyViewContentContainer,
    SymphonyViewCommonInfoContainer,
    SymphonyViewInputContainer,
    SymphonySectionHeaderContainer,
    SymphonySectionHeaderTitleContainer,
    SymphonySectionHeaderSubTitleContainer,
    DecoratedPopoverButton
} from '../../../symphony/SymphonyCommonComponents'

import SymphonyInput from '../../../symphony/SymphonyInput';
import MarketAuxMenu from '../../common/MarketAuxMenu';

// material
import Icon from '@material-ui/core/Icon';

// hooks
import useScrollableTabs from '../../../symphony/hooks/useScrollableTabs';

// util
import moment from 'moment';
import map from 'lodash/map';
import find from 'lodash/find';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

interface CommonInformationProps {
    product: MarketProduct;
    onCommonInformationInput: (field: string, value: string | number | boolean) => void;
    tierOneCategories: Array<HierarchyOne>;
    tierTwoCategories: Array<HierarchyTwo>;
    tierThreeCategories: Array<string>;
    onDeleteClick: (id: string) => void;
}

const CommonInformation = (props: CommonInformationProps) => {
    type CommonInfoTab = 'Product Information' | 'Category Hierarchy';
    const pRef = React.useRef<HTMLElement>(null);
    const hRef = React.useRef<HTMLElement>(null);
    const [tab, setTab] = React.useState<CommonInfoTab>('Product Information');
    const [onTabClick, onScroll] = useScrollableTabs([pRef, hRef], (target: string) => {
        if (target && ['Product Information', 'Category Hierarchy'].includes(target)) {
            setTab(target as CommonInfoTab);
        }
    });
    
    // vars
    const { product, onCommonInformationInput, tierOneCategories, tierTwoCategories } = props;
    const tierOneSelected = find(tierOneCategories, { name: product.h1 as string });
    const tierTwoSelected = find(tierTwoCategories, { name: product.h2 as string });
    const filteredTierTwoCategories = tierOneSelected ? tierOneSelected.h2 : [];
    const filteredTierThreeCategories = tierTwoSelected ? tierTwoSelected.h3 : [];

    return (
        <SymphonyViewContentContainer>
            <SymphonyViewTabsContainer>
                <SymphonyViewTabs
                    orientation="vertical"
                    value={tab}
                    TabIndicatorProps={{ style: { width: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                >
                    <SymphonyViewTab
                        label="Product Information"
                        value="Product Information"
                        onClick={onTabClick}
                        id="product-view-information"
                    />
                    <SymphonyViewTab
                        label="Category Hierarchy"
                        value="Category Hierarchy"
                        onClick={onTabClick}
                        id="product-view-category"
                    />
                </SymphonyViewTabs>
            </SymphonyViewTabsContainer>
            <SymphonyViewCommonInfoContainer onScroll={onScroll}>
                <SymphonySectionHeaderContainer style={{ justifyContent: 'space-between' }} innerRef={pRef}>
                    <SymphonySectionHeaderTitleContainer>
                        Product Information
                        {product.id &&
                            <SymphonySectionHeaderSubTitleContainer>
                                Last edited on {moment().format('DD.MM.YYYY [at] hh:mmA')}
                            </SymphonySectionHeaderSubTitleContainer>
                        }
                    </SymphonySectionHeaderTitleContainer>
                    {product.id &&
                        <MarketAuxMenu>
                            <DecoratedPopoverButton
                                id="product-delete-btn"
                                style={{ color: '#FF4D4D' }}
                                endIcon={<Icon className="fa fa-trash-alt" />}
                                onClick={() => props.onDeleteClick(product.id)}
                            >
                                Delete
                            </DecoratedPopoverButton>
                        </MarketAuxMenu>
                    }
                </SymphonySectionHeaderContainer>
                {/* Inputs */}
                <SymphonyViewInputContainer>
                    <SymphonyInput
                        id="product-name-input"
                        type="text"
                        label="Product Name"
                        value={product.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            onCommonInformationInput('name', e.target.value);
                        }}
                    />
                    <SymphonyInput
                        id="product-code-input"
                        type="text"
                        label="Code"
                        value={product.displayId as string || ''}
                        disabled={true}
                    />
                    <SymphonyInput
                        id="product-brand-input"
                        type="text"
                        label="Brand Name"
                        value={product.brand}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            onCommonInformationInput('brand', e.target.value);
                        }}
                    />
                    <SymphonyInput
                        id="product-material-input"
                        type="text"
                        label="Material"
                        value={product.material as string || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            onCommonInformationInput('material', e.target.value);
                        }}
                    />
                    <SymphonyInput
                        id="product-type-input"
                        type="text"
                        label="Type"
                        value={product.type}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            onCommonInformationInput('type', e.target.value);
                        }}
                    />
                    <SymphonyInput
                        id="product-description-input"
                        type="multiline"
                        label="Product Description"
                        richText={true}
                        value={product.description as string || ''}
                        onRichTextInput={(html) => {
                            onCommonInformationInput('description', html);
                        }}
                    />
                </SymphonyViewInputContainer>
                {/* Category Hierarchy */}
                <SymphonySectionHeaderContainer id="category-hierarchy" innerRef={hRef}>
                    <SymphonySectionHeaderTitleContainer>
                        Category Hierarchy
                    </SymphonySectionHeaderTitleContainer>
                </SymphonySectionHeaderContainer>
                <SymphonyViewInputContainer>
                    <SymphonyInput
                        id="product-h1-searchabledropdown"
                        type="searchabledropdown"
                        label="Level 1"
                        value={product.h1 as string || ''}
                        autocompleteOptions={map(tierOneCategories, (cat) => ({ label: cat.name, value: cat.name }))}
                        onAutocompleteChange={(e: React.ChangeEvent<{}>, v: AutocompleteKeyPair | null) => {
                            props.onCommonInformationInput('h1', v ? v.value : (product.h1 as string || ''))
                        }}
                    />
                    <SymphonyInput
                        id="product-h2-searchabledropdown"
                        type="searchabledropdown"
                        label="Level 2"
                        value={product.h2 as string || ''}
                        autocompleteOptions={map(filteredTierTwoCategories, (cat) => ({ label: cat.name, value: cat.name }))}
                        onAutocompleteChange={(e: React.ChangeEvent<{}>, v: AutocompleteKeyPair | null) => {
                            props.onCommonInformationInput('h2', v ? v.value : (product.h2 as string || ''))
                        }}
                    />
                    <SymphonyInput
                        id="product-h3-searchabledropdown"
                        type="searchabledropdown"
                        label="Level 3"
                        value={product.h3 as string || ''}
                        autocompleteOptions={map(filteredTierThreeCategories, (cat) => ({ label: cat, value: cat }))}
                        onAutocompleteChange={(e: React.ChangeEvent<{}>, v: AutocompleteKeyPair | null) => {
                            props.onCommonInformationInput('h3', v ? v.value : (product.h3 as string || ''))
                        }}
                    />
                </SymphonyViewInputContainer>
            </SymphonyViewCommonInfoContainer>
        </SymphonyViewContentContainer>
    )
}

export default CommonInformation;