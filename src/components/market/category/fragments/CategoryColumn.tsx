import React from 'react';
import { ColumnLevel, HierarchyOne, HierarchyTwo } from '../../../../store/category/types';
import { GenericMedia } from '../../../../store/system/types';

// Local Components
import { 
    CategoryBox, 
    CategoryHeader, 
    CategoryHeaderText, 
    CategoryTextField, 
    CategoryButton, 
    CategoryButtonBox, 
    AddIcon,
    CategoryListContainer,
    CategoryTypography,
    CategoryFullHeightWidth
} from './CategoryComponents';
import CategoryRow from './CategoryRow';

import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

// Material UI
import Search from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

// Utils
import map from 'lodash/map';
import filter from 'lodash/filter';

interface CategoryColumnProps {
    level: ColumnLevel;
    id: 'category-column-one' | 'category-column-two' | 'category-column-three';
    categories: Array<HierarchyOne> | Array<HierarchyTwo> | Array<string>;
    selectedTierOne: string;
    selectedTierTwo: string;
    setCategory: (level: ColumnLevel, category: Array<HierarchyOne> | Array<HierarchyTwo> | Array<string>, selectedCategory: HierarchyOne | HierarchyTwo) => void;
    onPressCategoryAddButton: () => void;
    onPressEdit: (level: ColumnLevel, modalTitle : string, modalCategoryName: string, modalImage: GenericMedia ) => void;
    onPressDelete: (level: ColumnLevel, modalCategoryName: string) => void;
    h3Thumbnail?: GenericMedia;
}

export default (props: CategoryColumnProps) => {
    const [categories, setCategories] = React.useState<typeof props.categories>([]);
    const [searchValue, setSearchValue] = React.useState('');

    React.useEffect(() => {
        setCategories(props.categories);
        // eslint-disable-next-line
    }, [])

    if(JSON.stringify(props.categories) !== JSON.stringify(categories)) setCategories(props.categories);

    const onSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSearchValue(e.target.value);

    const cats = filter(categories, (c) => {
        if(typeof c === 'string') {
            return c.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
        } 
        const categoryName = (c as HierarchyOne | HierarchyTwo).name.toLowerCase();

        if(props.level === 'Level 1') {
            return categoryName.indexOf(searchValue.toLowerCase()) > -1 || categoryName === props.selectedTierOne.toLowerCase();
        } else {
            return categoryName.indexOf(searchValue.toLowerCase()) > -1 || categoryName === props.selectedTierTwo.toLowerCase();
        }
    });
    
    return (
        <CategoryBox id={props.id}>
            <CategoryHeader id={props.level === 'Level 1' ? 'category-header-level-one' : props.level === 'Level 2' ? 'category-header-level-two' : 'category-header-level-three'}>
                <CategoryHeaderText>{props.level}</CategoryHeaderText>
            </CategoryHeader>
            <CategoryTextField 
                id={props.level === 'Level 1' ? 'product-search-field-level-one' : props.level === 'Level 2' ? 'product-search-field-level-two' : 'product-search-field-level-three'}
                style={{ width: '100%', fontSize: 10 }}
                InputProps={{
                    startAdornment: <InputAdornment position="start">
                        <Search htmlColor={SYMPHONY_PRIMARY_COLOR} />
                    </InputAdornment>
                }}
                onChange={onSearch}
                placeholder="Search"
            />
            <CategoryButtonBox
                id={props.level === 'Level 1' ? 'category-column-one-add-button' : props.level === 'Level 2' ? 'category-column-two-add-button' : 'category-column-three-add-button'}
                onClick={props.onPressCategoryAddButton}
            >
                <CategoryButton> <AddIcon /> </CategoryButton>
            </CategoryButtonBox>
            <CategoryListContainer>
                { props.level === 'Level 1' &&
                    <>
                        {
                            cats.length > 0 ?
                            map(cats as Array<HierarchyOne>, (category) => {
                                return (
                                    <CategoryRow 
                                        key={`category-row-${category.name.replace(/\s+/g, '-').toLowerCase()}`}
                                        category={category as HierarchyOne}
                                        level={props.level}
                                        setCategory={props.setCategory}
                                        image={category.h1Thumbnail}
                                        onPressEdit={props.onPressEdit}
                                        onPressDelete={props.onPressDelete}
                                        selected={props.selectedTierOne === category.name}
                                    />
                                )
                            }) :
                            <CategoryFullHeightWidth>
                                <CategoryTypography id={'category-nocatavail-level-one'} style={{ fontSize: 12 }}>No Category Available</CategoryTypography>
                            </CategoryFullHeightWidth>
                        }
                    </>
                }
                { props.level === 'Level 2' &&
                    <>
                        {
                            cats.length > 0 ?
                            map(cats as Array<HierarchyTwo>, (category) => {
                                return (
                                    <CategoryRow
                                        key={`category-row-${category.name.replace(/\s+/g, '-').toLowerCase()}`}
                                        category={category as HierarchyTwo}
                                        level={props.level}
                                        setCategory={props.setCategory}
                                        image={category.h2Thumbnail}
                                        onPressEdit={props.onPressEdit}
                                        onPressDelete={props.onPressDelete}
                                        selected={props.selectedTierTwo === category.name}
                                    />
                                )
                            }) : props.selectedTierOne.length > 0 &&
                            <CategoryFullHeightWidth>
                                <CategoryTypography id={'category-nocatavail-level-two'} style={{ fontSize: 12 }}>No Category Available</CategoryTypography>
                            </CategoryFullHeightWidth>
                        }
                    </>
                }
                { props.level === 'Level 3' &&
                    <>
                        {
                            cats.length > 0 ?
                            map(cats as Array<string>, (category) => {
                                return (
                                    <CategoryRow
                                        key={`category-row-${category.replace(/\s+/g, '-').toLowerCase()}`}
                                        category={category as string}
                                        level={props.level}
                                        setCategory={props.setCategory}
                                        image={{name: '', path: '', size: 0, type: ''}}
                                        onPressEdit={props.onPressEdit}
                                        onPressDelete={props.onPressDelete}
                                        selected={false}
                                        h3Thumbnail={props.h3Thumbnail}
                                    />
                                )
                            }) : props.selectedTierTwo.length > 0 &&
                            <CategoryFullHeightWidth>
                                <CategoryTypography id={'category-nocatavail-level-three'} style={{ fontSize: 12 }}>No Category Available</CategoryTypography>
                            </CategoryFullHeightWidth>
                        }
                    </>
                }
            </CategoryListContainer>

        </CategoryBox>
    )
}