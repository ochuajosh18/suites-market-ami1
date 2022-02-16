import React from 'react';
import { BasicProduct, DynamicBasicProductInput, HierarchyOne, HierarchyTwo } from '../../../../store/basicproduct/types';
import { Field } from '../../../../store/fields/types';
import { AutocompleteKeyPair, GenericMedia } from '../../../../store/system/types';

// symphony components
import {
    SymphonyViewTabs,
    SymphonyViewTab,
    SymphonyViewTabsContainer,
    SymphonyViewContentContainer,
    SymphonyViewCommonInfoContainer,
    SymphonyViewInputContainer
} from '../../../symphony/SymphonyCommonComponents'

// common components
import {
    SalesSectionHeaderContainer,
    SalesSectionHeaderTitleContainer,
    SalesSectionHeaderSubTitleContainer,
    DecoratedPopoverButton
} from '../../common/SalesCommonComponents';
import SymphonyInput from '../../../symphony/SymphonyInput';
import SalesAuxMenu from '../../common/SalesAuxMenu';
import SymphonyModuleFieldRenderer from '../../../symphony/SymphonyModuleFieldRenderer';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

// material
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';

// hooks
import useScrollableTabs from '../../../symphony/hooks/useScrollableTabs';

// util
import moment from 'moment';
import map from 'lodash/map';
import find from 'lodash/find';

interface CommonInformationProps {
    product: BasicProduct;
    onCommonInformationInput: (field: string, value: string | number | boolean | [number, number] | GenericMedia | Array<GenericMedia> | DynamicBasicProductInput | undefined) => void;
    tierOneCategories: Array<HierarchyOne>;
    tierTwoCategories: Array<HierarchyTwo>;
    tierThreeCategories: Array<string>;
    onDeleteClick: (id: string) => void;
    fields: Array<Field>;
    sections: Array<string>;
}

const CommonInformation = (props: CommonInformationProps) => {
    const { product, onCommonInformationInput, tierOneCategories, tierTwoCategories, sections, fields } = props;
    // const refs = React.useRef<Array<HTMLElement>>(map(sections, (s) => React.createRef<HTMLElement>()));
    const sectionList = [...sections, 'Category Hierarchy'];
    const refs = [...sectionList.map(() => React.createRef<HTMLElement>()), React.createRef<HTMLElement>()];
    const [tab, setTab] = React.useState<string>(sectionList[0]);
    const [onTabClick, onScroll] = useScrollableTabs(refs, (target: string) => {
        if (target && sectionList.includes(target)) {
            setTab(target as string);
        }
    });
    
    // vars
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
                    {map(sections, (s, i) => {
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
                    <SymphonyViewTab
                        label="Category Hierarchy"
                        value="Category Hierarchy"
                        onClick={onTabClick}
                        id="Category Hierachy-tab"
                    />
                </SymphonyViewTabs>
            </SymphonyViewTabsContainer>
            <SymphonyViewCommonInfoContainer onScroll={onScroll}>
                {map(sections, (s, i) => {
                    return (
                        <Box key={`${s}-section`}>
                            <SalesSectionHeaderContainer id={s} key={s} style={{ justifyContent: 'space-between' }} innerRef={refs[i]}>
                                <SalesSectionHeaderTitleContainer>     
                                    {s}
                                    {i === 0 && product.id && 
                                        <SalesSectionHeaderSubTitleContainer>
                                            Last edited on {moment(product.dateUpdated as string).format('DD.MM.YYYY [at] hh:mmA')}
                                        </SalesSectionHeaderSubTitleContainer>
                                    } 
                                </SalesSectionHeaderTitleContainer>
                                {i === 0 && product.id &&
                                    <SalesAuxMenu>
                                        <DecoratedPopoverButton
                                            id="product-delete-btn"
                                            style={{ color: '#FF4D4D' }}
                                            endIcon={<Icon className="fa fa-trash-alt" />}
                                            onClick={() => props.onDeleteClick(product.id)}
                                        >
                                            Delete
                                        </DecoratedPopoverButton>
                                    </SalesAuxMenu>
                                }
                            </SalesSectionHeaderContainer>
                            <SymphonyModuleFieldRenderer
                                fields={fields}
                                section={s}
                                entity={product}
                                onEntityInput={onCommonInformationInput}
                            />
                        </Box>
                    )
                })}
                {/* <SalesSectionHeaderContainer style={{ justifyContent: 'space-between' }} innerRef={pRef}>
                    <SalesSectionHeaderTitleContainer>
                        Product Information
                        {product.id &&
                            <SalesSectionHeaderSubTitleContainer>
                                Last edited on {moment(product.dateUpdated as string).format('DD.MM.YYYY [at] hh:mmA')}
                            </SalesSectionHeaderSubTitleContainer>
                        }
                    </SalesSectionHeaderTitleContainer>
                    {product.id &&
                        <SalesAuxMenu>
                            <DecoratedPopoverButton
                                id="product-delete-btn"
                                style={{ color: '#FF4D4D' }}
                                endIcon={<Icon className="fa fa-trash-alt" />}
                                onClick={() => props.onDeleteClick(product.id)}
                            >
                                Delete
                            </DecoratedPopoverButton>
                        </SalesAuxMenu>
                    }
                </SalesSectionHeaderContainer> */}
                {/* Inputs */}
                {/* <SymphonyViewInputContainer>
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
                        value={product.code as string || ''}
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
                    <SymphonyInput
                        id="product-ingredient-input"
                        type="multiline"
                        label="Ingredients"
                        richText={true}
                        value={product.ingredient as string || ''}
                        onRichTextInput={(html) => {
                            onCommonInformationInput('ingredient', html);
                        }}
                    />
                </SymphonyViewInputContainer> */}
                {/* Category Hierarchy */}
                <SalesSectionHeaderContainer id="Category Hierarchy" innerRef={refs[refs.length - 1]}>
                    <SalesSectionHeaderTitleContainer>
                        Category Hierarchy
                    </SalesSectionHeaderTitleContainer>
                </SalesSectionHeaderContainer>
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