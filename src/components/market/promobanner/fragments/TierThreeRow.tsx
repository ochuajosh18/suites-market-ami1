import React from 'react';
import { BannerSelectedCategoryType } from '../../../../store/promobanner/types';

// Local Components
import { TierThreeRowContainer, PromoBannerRowLabel, PromoBannerImageNameContainer } from './PromoBannerCommonComponents';

// Utils
import find from 'lodash/find';
import filter from 'lodash/filter';

interface TierThreeRowProps {
    tierOne: string;
    tierTwo: string;
    name: string;
    selectedCategory: Array<BannerSelectedCategoryType>;
    addToSelectedCategory: (selectedCategory: Array<BannerSelectedCategoryType>) => void;
    customStyle: React.CSSProperties | undefined;
}

const TierThreeRow = (props: TierThreeRowProps) => {
    const { name } = props;

    React.useEffect(() => {
        
    }, [props.name, props.selectedCategory])

    const onPressRow = () => {
        // Add if category is not selected else remove 
        const categoryIsSelected = find(props.selectedCategory, { h1: props.tierOne, h2: props.tierTwo, h3: name } );
        if(categoryIsSelected) {
            const filterSelectedCategory = filter(props.selectedCategory, (selectedCat) => selectedCat.h3 !== name );
            props.addToSelectedCategory(filterSelectedCategory)
        } else {
            props.addToSelectedCategory([ ...props.selectedCategory, { h1: props.tierOne, h2: props.tierTwo, h3: name } ])
        }
    }

    return (
        <TierThreeRowContainer
            key={`promobanner-tierthree-row-${name}`}
            onClick={onPressRow}
            style={props.customStyle}
        >
            <PromoBannerImageNameContainer>
                <PromoBannerRowLabel style={{ fontSize: 12 }}>{name}</PromoBannerRowLabel>
            </PromoBannerImageNameContainer>
        </TierThreeRowContainer>
    )
}

export default TierThreeRow;