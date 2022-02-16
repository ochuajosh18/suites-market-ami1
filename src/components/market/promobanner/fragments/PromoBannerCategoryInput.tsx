import React from 'react';
import { BannerSelectedCategoryType } from '../../../../store/promobanner/types';

// Local Components
import { SelectedCategoryRowContainer, PromoBannerCategoryInputLabel, PromoBannerCategoryInputContainer } from './PromoBannerCommonComponents';
import SelectedCategoryRow from './SelectedCategoryRow';

// Utils
import map from 'lodash/map';

interface PromoBannerCategoryInputProps {
    onPressCategoryInput: () => void;
    selectedCategory: Array<BannerSelectedCategoryType>;
}

const PromoBannerCategoryInput = (props: PromoBannerCategoryInputProps) => {
    return (
        <PromoBannerCategoryInputContainer>
            <PromoBannerCategoryInputLabel>Category</PromoBannerCategoryInputLabel>
            <SelectedCategoryRowContainer
                id="promobanner-crud-selectedrow-btn"
                onClick={props.onPressCategoryInput}
            >
                {map(props.selectedCategory, (selectedCat) => {
                    return (
                        <SelectedCategoryRow 
                            key={`promobanner-selectedcategoryrow-${selectedCat.h1}${selectedCat.h2 && `-${selectedCat.h2}`}${selectedCat.h3 && `-${selectedCat.h3}`}`}
                            h1={selectedCat.h1}
                            h2={selectedCat.h2}
                            h3={selectedCat.h3}
                        />
                    )
                })}
            </SelectedCategoryRowContainer>
        </PromoBannerCategoryInputContainer>
    )
}

export default PromoBannerCategoryInput;
