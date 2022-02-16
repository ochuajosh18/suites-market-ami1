import React from 'react';
import { BannerSelectedCategoryType, GenericMedia, HierarchyTwo } from '../../../../store/promobanner/types';

// Material UI
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Box from '@material-ui/core/Box';

// Local Components
import { TierOneRowContainer, PromoBannerRowLabel, PromoBannerImageNameContainer } from './PromoBannerCommonComponents';
import TierTwoRow from './TierTwoRow';

// Utils
import map from 'lodash/map';
import find from 'lodash/find';
import filter from 'lodash/filter';
import SymphonyImage from '../../../symphony/SymphonyImage';

interface TierOneRowProps {
    name: string;
    thumbnail: GenericMedia;
    h2: Array<HierarchyTwo> | undefined;
    selectedCategory: Array<BannerSelectedCategoryType>;
    addToSelectedCategory: (selectedCategory: Array<BannerSelectedCategoryType>) => void;
    customStyle: React.CSSProperties | undefined;
}

const TierOneRow = (props: TierOneRowProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { thumbnail, name, h2 } = props;

    React.useEffect(() => {
        // If category is selected expand else do nothing
        const isCategorySelected = find(props.selectedCategory, { h1: props.name } );
        if(isCategorySelected) {
            setIsOpen(true);
        }
    }, [props.name, props.selectedCategory])

    const onPressRow = () => {
        if (typeof h2 !== 'undefined' && h2.length > 0) {
            setIsOpen(!isOpen);
        } else {
            // Add if category is not selected else remove 
            const categoryIsSelected = find(props.selectedCategory, (selectedCat) => selectedCat.h1 === name );
            if(categoryIsSelected) {
                const filterSelectedCategory = filter(props.selectedCategory, (selectedCat) => selectedCat.h1 !== name );
                props.addToSelectedCategory(filterSelectedCategory)
            } else {
                props.addToSelectedCategory([ ...props.selectedCategory, { h1: name } ])
            }
        }
    }

    return (
        <Box
            key={`promobanner-tierone-row-${name}`}
        >
            <TierOneRowContainer
                onClick={onPressRow}
                style={props.customStyle}
            >
                <PromoBannerImageNameContainer>
                    <SymphonyImage 
                        src={thumbnail ? thumbnail.path as string : ''} 
                        style={{ width: 50, height: 'auto', maxHeight: 60 }}
                    />
                    <PromoBannerRowLabel>{name}</PromoBannerRowLabel>
                </PromoBannerImageNameContainer>
                { (typeof h2 !== 'undefined' && h2.length > 0) && isOpen === false ?
                    <KeyboardArrowDownIcon /> : (typeof h2 !== 'undefined' && h2.length > 0) && <KeyboardArrowUpIcon />
                }
            </TierOneRowContainer>
            { isOpen && 
                map(h2, (t2) => {
                    const isSelected = find(props.selectedCategory, (selectedCat) => {
                        if(typeof selectedCat.h3 === 'undefined' && selectedCat.h1 === name && selectedCat.h2 === t2.name) {
                            return selectedCat
                        }
                    });
                    return (
                        <TierTwoRow 
                            tierOne={name}
                            name={t2.name}
                            h3={t2.h3}
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

export default TierOneRow;