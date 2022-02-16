import React from 'react';

// Local Components
import { PromoBannerSelectedCategoryRowContainer, PromoBannerSelectedCategoryRowLabel } from './PromoBannerCommonComponents';

interface SelectedCategoryRowProps {
    h1: string;
    h2?: string;
    h3?: string;
}

const SelectedCategoryRow = (props: SelectedCategoryRowProps) => {
    return (
        <PromoBannerSelectedCategoryRowContainer>
            <PromoBannerSelectedCategoryRowLabel>{props.h1}</PromoBannerSelectedCategoryRowLabel>
            {
                typeof props.h2 !== 'undefined' && props.h2.length > 0 && <PromoBannerSelectedCategoryRowLabel>/ {props.h2}</PromoBannerSelectedCategoryRowLabel> 
            }
            {
                typeof props.h3 !== 'undefined' && props.h3.length > 0 && <PromoBannerSelectedCategoryRowLabel>/ {props.h3}</PromoBannerSelectedCategoryRowLabel> 
            }
        </PromoBannerSelectedCategoryRowContainer>
    )
}

export default SelectedCategoryRow;