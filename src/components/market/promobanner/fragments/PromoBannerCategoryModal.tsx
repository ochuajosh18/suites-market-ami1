import React from 'react';
import { BannerSelectedCategoryType, HierarchyOne } from '../../../../store/promobanner/types';

// Material UI
import IconButton from '@material-ui/core/IconButton';

// Local Components
import { 
    PromoBannerModal, 
    PromoBannerModalContentContainer, 
    PromoBannerModalLabel, 
    PromoBannerModalLabelContainer,
    PromoBannerModalCloseIcon,
    PromoBannerModalCategoryListContainer
} from './PromoBannerCommonComponents';
import TierOneRow from './TierOneRow';

// Utils
import map from 'lodash/map';
import find from 'lodash/find';

interface PromoBannerCategoryModalProps {
    open: boolean;
    tierOneCategories: Array<HierarchyOne>;
    selectedCategory: Array<BannerSelectedCategoryType>;
    addToSelectedCategory: (selectedCategory: Array<BannerSelectedCategoryType>) => void;
    onPressCloseModal: () => void;
}

const PromoBannerCategoryModal = (props: PromoBannerCategoryModalProps) => {

    React.useEffect(() => {
        
    }, [props])

    return (
        <PromoBannerModal
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', outline: 'none' }}
            open={props.open}
        >
            <PromoBannerModalContentContainer>
                <PromoBannerModalLabelContainer>
                    <PromoBannerModalLabel>Select Category</PromoBannerModalLabel>
                    <IconButton
                        onClick={() => props.onPressCloseModal()}
                    > 
                        <PromoBannerModalCloseIcon/>
                    </IconButton>
                </PromoBannerModalLabelContainer>
                <PromoBannerModalCategoryListContainer>
                    {
                        map(props.tierOneCategories, (t1) => {
                            const isSelected = find(props.selectedCategory, (selectedCat) => {
                                if(typeof selectedCat.h2 === 'undefined' && typeof selectedCat.h3 === 'undefined' && selectedCat.h1 === t1.name) {
                                    return selectedCat
                                }
                            });
                            return(
                                <TierOneRow 
                                    key={`promobanner-tierone-row-${t1.name}`}
                                    name={t1.name}
                                    thumbnail={t1.h1Thumbnail}
                                    h2={t1.h2}
                                    selectedCategory={props.selectedCategory}
                                    addToSelectedCategory={props.addToSelectedCategory}
                                    customStyle={{ backgroundColor: isSelected ? '#00000029' : '#FFF' }}
                                />
                            )
                        })
                    }
                </PromoBannerModalCategoryListContainer>
            </PromoBannerModalContentContainer>
        </PromoBannerModal>
    )
}

export default PromoBannerCategoryModal;