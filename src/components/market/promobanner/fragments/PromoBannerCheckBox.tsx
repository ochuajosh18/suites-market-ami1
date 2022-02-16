import React from 'react'

// Local Components
import { 
    PromoBannerCheckBoxLabel, 
    PromoBannerCheckBox, 
    PromoBannerCheckBoxCheckedIcon, 
    PromoBannerUnCheckedBoxCheckedIcon,
    PromoBannerCheckBoxContainer
} from './PromoBannerCommonComponents';

interface PromoBannerCheckBoxProps {
    isChecked: boolean;
    label: string;
    onClick: (checked: boolean) => void;
}

export default (props: PromoBannerCheckBoxProps) => {
    return (
        <PromoBannerCheckBoxContainer>
            <PromoBannerCheckBox 
                id="promobanner-crud-noexpiration-checkbox"
                checked={props.isChecked}
                checkedIcon={<PromoBannerCheckBoxCheckedIcon />}
                icon={<PromoBannerUnCheckedBoxCheckedIcon />}
                onClick={() => props.onClick(!props.isChecked)}
            />
            <PromoBannerCheckBoxLabel>{props.label}</PromoBannerCheckBoxLabel>
        </PromoBannerCheckBoxContainer>
    )
}