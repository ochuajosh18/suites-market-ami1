import React, { useState } from 'react';
import { BannerSelectedCategoryType } from '../../../../store/promobanner/types';

// Material UI
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Box from '@material-ui/core/Box';

// Local Components
import { TierTwoRowContainer, PromoBannerRowLabel, PromoBannerImageNameContainer } from './PromoBannerCommonComponents';
import TierThreeRow from './TierThreeRow';

// Utils
import map from 'lodash/map';
import find from 'lodash/find';
import filter from 'lodash/filter';

interface TierTwoRowProps {
    tierOne: string;
    name: string;
    h3: Array<string> | undefined;
    selectedCategory: Array<BannerSelectedCategoryType>;
    addToSelectedCategory: (selectedCategory: Array<BannerSelectedCategoryType>) => void;
    customStyle: React.CSSProperties | undefined;
}

const TierTwoRow = (props: TierTwoRowProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { name, h3 } = props;

    React.useEffect(() => {
        // If category is selected expand else do nothing
        const isCategorySelected = find(props.selectedCategory, { h1: props.tierOne, h2: props.name } );
        if(isCategorySelected) {
            setIsOpen(true);
        }
    }, [props.name, props.selectedCategory, props.tierOne])

    const onPressRow = () => {
        if (typeof h3 !== 'undefined' && h3.length > 0) {
            setIsOpen(!isOpen);
        } else {
            // Add if category is not selected else remove 
            const categoryIsSelected = find(props.selectedCategory, { h1: props.tierOne, h2: name } );
            if(categoryIsSelected) {
                const filterSelectedCategory = filter(props.selectedCategory, (selectedCat) => selectedCat.h2 !== name );
                props.addToSelectedCategory(filterSelectedCategory)
            } else {
                props.addToSelectedCategory([ ...props.selectedCategory, { h1: props.tierOne, h2: name } ])
            }
        }
    }

    return (
        <Box
            key={`promobanner-tiertwo-row-${name}`}
        >
            <TierTwoRowContainer
                onClick={onPressRow}
                style={props.customStyle}
            >
                <PromoBannerImageNameContainer>
                    <PromoBannerRowLabel style={{ fontSize: 14 }}>{name}</PromoBannerRowLabel>
                </PromoBannerImageNameContainer>
                {
                    typeof h3 !== 'undefined' && h3.length > 0 && isOpen === false ?
                    <KeyboardArrowDownIcon /> : typeof h3 !== 'undefined' && h3.length > 0 && <KeyboardArrowUpIcon />
                }
            </TierTwoRowContainer>
            {
                isOpen && 
                map(h3, (t3) => {
                    const isSelected = find(props.selectedCategory, { h1 : props.tierOne, h2: props.name, h3: t3 });
                    return (
                        <TierThreeRow 
                            name={t3}
                            tierOne={props.tierOne}
                            tierTwo={props.name}
                            selectedCategory={props.selectedCategory}
                            addToSelectedCategory={props.addToSelectedCategory}
                            customStyle={{ backgroundColor: isSelected ? '#00000029' : '#FFF' }}
                        />
                    )
                })
            }
        </Box>
    )
}

export default TierTwoRow;