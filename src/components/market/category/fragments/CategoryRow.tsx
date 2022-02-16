import React from 'react';
import { ColumnLevel, HierarchyOne, HierarchyTwo } from '../../../../store/category/types';
import { GenericMedia } from '../../../../store/system/types';
import { 
    CategoryRowButton, 
    CategoryRowName, 
    IconContainer, 
    EditIcon, 
    DeleteIcon,
    CategoryLeftBox 
} from './CategoryComponents';

interface CategoryRowProps {
    category: HierarchyOne | HierarchyTwo | string;
    level: ColumnLevel;
    image: { name: string, path: string, type: string, size: number }
    setCategory: (level: ColumnLevel, category: Array<HierarchyOne> | Array<HierarchyTwo> | Array<string>, selectedCategory: HierarchyOne | HierarchyTwo) => void;
    onPressEdit: (level: ColumnLevel, modalTitle : string, modalCategoryName: string, modalImage: GenericMedia ) => void;
    onPressDelete: (level: ColumnLevel, modalCategoryName: string) => void;
    selected: boolean;
    h3Thumbnail?: GenericMedia;
}

export default (props: CategoryRowProps) => {
    let { category, level, image, setCategory, onPressEdit, onPressDelete } = props;

    const onPressCategoryRow = () => {
        if(level === 'Level 1') {
            category = category as HierarchyOne;
            setCategory('Level 1', category.h2, category);
        } else if (level === 'Level 2') {
            category = category as HierarchyTwo;
            setCategory('Level 2', category.h3, category)
        } 
    }

    const onPressEditIcon = () => {
        if(level === 'Level 1') {
            category = category as HierarchyOne;
            onPressEdit('Level 1', 'Edit', category.name, category.h1Thumbnail);
        } else if (level === 'Level 2') {
            category = category as HierarchyTwo;
            onPressEdit('Level 2', 'Edit', category.name, category.h2Thumbnail);

        } else {
            category = category as string;
            onPressEdit('Level 3', 'Edit', category, { name: '', path: '', type: '', size: 0});
        }
    }

    const onPressDeleteIcon = () => {
        if(level === 'Level 1') {
            category = category as HierarchyOne;
            onPressDelete(level, category.name);
        } else if (level === 'Level 2') {
            category = category as HierarchyTwo;
            onPressDelete(level, category.name);
        } else {
            category = category as string;
            onPressDelete(level, category);
        }
    }
    
    return (
        <CategoryRowButton 
            id={`category-row-button-${typeof props.category === 'string' ? props.category.replace(/\s+/g, '-').toLowerCase() : props.category.name.replace(/\s+/g, '-').toLowerCase()}`}
            key={`category-row-button-${typeof props.category === 'string' ? props.category.replace(/\s+/g, '-').toLowerCase() : props.category.name.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={onPressCategoryRow}
            style={props.selected ? { backgroundColor: '#EDEDED' } : { backgroundColor: '#FFF' }}
        >
            <CategoryLeftBox>
                <img src={props.level === 'Level 3' ? props.h3Thumbnail?.path : image.path} alt=""/>
                <CategoryRowName style={{ width: `calc(100% - 70px)` }} noWrap >
                    {typeof props.category === 'string' ? props.category : props.category.name }
                </CategoryRowName>
            </CategoryLeftBox> 
            <IconContainer className="icon-container">
                <EditIcon 
                    id={`category-row-edit-button-${typeof props.category === 'string' ? props.category.replace(/\s+/g, '-').toLowerCase() : props.category.name.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={onPressEditIcon}
                />
                <DeleteIcon 
                    id={`category-row-delete-button-${typeof props.category === 'string' ? props.category.replace(/\s+/g, '-').toLowerCase() :  props.category.name.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={onPressDeleteIcon}
                />
            </IconContainer>
        </CategoryRowButton>
    )
}