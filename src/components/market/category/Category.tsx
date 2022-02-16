import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { setCategoryState, getAllCategories, addCategory, deleteCategory, updateCategory } from '../../../store/category/actions';
import { setSystemState } from '../../../store/system/actions';
import { GenericMedia } from '../../../store/system/types';
import { CategoryState, HierarchyTwo, HierarchyOne, ColumnLevel } from '../../../store/category/types';

// Material UI
import Box from '@material-ui/core/Box';

// Global Components
import { 
    SymphonyContainer,
    SymphonyContentContainer,
} from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import SymphonyContentLoading from '../../symphony/SymphonyContentLoading';
import { toastWarning, toastError } from '../../../modules/Toast';

// Local Components
import { CategoryContainer } from './fragments/CategoryComponents';
import { CategoryGrid, CategoryGridItem } from './fragments/CategoryComponents';
import CategoryColumn from './fragments/CategoryColumn';
import AddOrEditModal from './fragments/AddOrEditModal';
import DeleteModal from './fragments/DeleteModal';

import find from 'lodash/find';
import filter from 'lodash/filter';
import includes from 'lodash/includes';

interface CategoryProps {
    category: CategoryState;
    setSystemState: typeof setSystemState;
    setCategoryState: typeof setCategoryState;
    getAllCategories: typeof getAllCategories;
    addCategory: typeof addCategory;
    deleteCategory: typeof deleteCategory;
    updateCategory: typeof updateCategory;
}

class Category extends React.PureComponent<CategoryProps> {

    componentDidMount = () => {
        this.props.setSystemState({
            headerEndButton: () => {},
            shallRedirect: false,
            redirectTo: '',
            header: (
                <Box display="flex">
                    <Box fontSize="36px">
                        Category Management
                    </Box>
                </Box>
            ),
        });
        this.props.getAllCategories(true);
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined });
    
    setCategory = (level: ColumnLevel, val: Array<HierarchyOne> | Array<HierarchyTwo> | Array<string>, selectedCategory: HierarchyOne | HierarchyTwo) => {
        if(level === 'Level 1') {
            val = val as Array<HierarchyTwo>;
            selectedCategory = selectedCategory as HierarchyOne;
            this.props.setCategoryState({ tierTwoCategories : val, tierThreeCategories: [], selectedTierOne: selectedCategory.name, selectedTierTwo: '' })
        } else if (level === 'Level 2') {
            val = val as Array<string>;
            selectedCategory = selectedCategory as HierarchyTwo;
            this.props.setCategoryState({ tierThreeCategories : val, selectedTierTwo: selectedCategory.name, tierThreeThumbnail: selectedCategory.h2Thumbnail})
        }
    }

    onChangeModalCategoryName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.props.setCategoryState({ modalCategoryName: e.target.value })
    }

    _onPressEditIcon = (level: ColumnLevel, modalTitle : string, modalCategoryName: string, modalImage: GenericMedia ) => {
        this.props.setCategoryState({ 
            selectedLevel: level, 
            modalTitle, 
            modalCategoryName, 
            prevModalCategoryName: modalCategoryName,
            modalImage: level === 'Level 3' ? this.props.category.tierThreeThumbnail : modalImage, 
            modalAddOrEditIsOpen: true 
        })
    }

    _onPressDeleteIcon = (level: ColumnLevel, modalCategoryName: string) => {
        this.props.setCategoryState({ selectedLevel: level, modalDeleteIsOpen: true, modalCategoryName })
    }

    _validateCategoryInput = () => {
        const { modalCategoryName, modalImage, selectedLevel, modalTitle, prevModalCategoryName } = this.props.category;
        let { tierOneCategories, tierTwoCategories, tierThreeCategories } = this.props.category;

        if(selectedLevel !== 'Level 3') {
            if(modalCategoryName.length > 0 && ((modalTitle === 'Add Category' && modalImage.file) || (modalTitle === 'Edit' && modalImage.path.length > 0))) {
                if(selectedLevel === 'Level 1') {
                    tierOneCategories = modalTitle === 'Add Category' ? tierOneCategories : filter(tierOneCategories, (t1) => t1.name !== prevModalCategoryName )
                    const tierOne = find(tierOneCategories, (t1) => t1.name.toLowerCase() === modalCategoryName.toLowerCase() );
                    if(tierOne) {
                        toastError('Category name already exists')
                        return false;
                    } else {
                        return true;
                    }
                } else if (selectedLevel === 'Level 2') {
                    tierTwoCategories = modalTitle === 'Add Category' ? tierTwoCategories : filter(tierTwoCategories, (t2) => t2.name !== prevModalCategoryName )
                    const tierTwo = find(tierTwoCategories, (t2) => t2.name.toLowerCase() === modalCategoryName.toLowerCase());
                    if(tierTwo) {
                        toastError('Category name already exists')
                        return false;
                    } else {
                        return true;
                    }
                }
            } else {
                toastError('Category name and image is required')
                return false;
            }
        } else {
            if(modalCategoryName.length > 0) {
                tierThreeCategories = modalTitle === 'Add Category' ? tierThreeCategories : filter(tierThreeCategories, (t3) => t3 !== prevModalCategoryName )
                const tierThree = find(tierThreeCategories, (t3) => t3.toLowerCase() === modalCategoryName.toLowerCase());
                // const tierThree = includes(tierThreeCategories, modalCategoryName);
                if(tierThree) {
                    toastError('Category name already exists')
                    return false;
                } else {
                    return true;
                }
            } else {
                toastError('Category name is required')
                return false;
            }
        }
    }

    _onPressSaveAddEditModal = () => {
        if(this._validateCategoryInput()) {
            if(this.props.category.modalTitle === 'Add Category' || this.props.category.modalTitle.length === 0) {
                this.props.addCategory(this.props.category.selectedLevel)
            } else {
                this.props.updateCategory();
            }
        }
    }

    _onMediaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        // upload then load new list of images
        if (e.target.files && e.target.files.length === 1) {
            const file = e.target.files[0];
            if (includes(file.type, 'image')) {
                if(file.size < 5000000) {
                    this.props.setCategoryState({ modalImage: { ...this.props.category.modalImage, file, type: file.type} })
                } else {
                    toastError('Each file cannot exceed 5mb');
                }
            } else {
                toastError('Uploading a non image file is not valid')
            }
        }
    }

    _toggleModal = (level: ColumnLevel) => {
        if(level === 'Level 2' && !this.props.category.selectedTierOne) {
            toastWarning('Please select category level 1')
            return;
        }
        if(level === 'Level 3' && !this.props.category.selectedTierTwo){
            toastWarning('Please select category level 2')
            return;
        }
        
        this.props.setCategoryState({ 
            modalAddOrEditIsOpen: true,
            modalTitle: 'Add Category',
            modalImage: { name: '', type: '', size: 0, path: '' }, 
            modalCategoryName: '', 
            selectedLevel: level as string
        })
    }

    _onDeleteCategory = () => {
        this.props.deleteCategory();
    }

    render() {
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyContentContainer>
                        {this.props.category.categoryLoading ? <SymphonyContentLoading /> :
                            <CategoryContainer>
                                <CategoryGrid container>
                                    <CategoryGridItem item xs={4}>
                                        <CategoryColumn 
                                            id="category-column-one"
                                            key="category-column-one"
                                            level="Level 1" 
                                            categories={this.props.category.tierOneCategories as Array<HierarchyOne>}
                                            setCategory={this.setCategory.bind(this)}
                                            onPressCategoryAddButton={this._toggleModal.bind(this, 'Level 1')}
                                            onPressEdit={this._onPressEditIcon.bind(this)}
                                            onPressDelete={this._onPressDeleteIcon.bind(this)}
                                            selectedTierOne={this.props.category.selectedTierOne}
                                            selectedTierTwo={this.props.category.selectedTierTwo}
                                        />
                                    </CategoryGridItem>
                                    <CategoryGridItem item xs={4}>
                                        <CategoryColumn 
                                            id="category-column-two"
                                            key="category-column-two"
                                            level="Level 2" 
                                            categories={this.props.category.tierTwoCategories as Array<HierarchyTwo>}
                                            setCategory={this.setCategory.bind(this)}
                                            onPressCategoryAddButton={this._toggleModal.bind(this, 'Level 2')}
                                            onPressEdit={this._onPressEditIcon.bind(this)}
                                            onPressDelete={this._onPressDeleteIcon.bind(this)}
                                            selectedTierOne={this.props.category.selectedTierOne}
                                            selectedTierTwo={this.props.category.selectedTierTwo}
                                        />
                                    </CategoryGridItem>
                                    <CategoryGridItem item xs={4}>
                                        <CategoryColumn 
                                            id="category-column-three"
                                            key="category-column-three"
                                            level="Level 3" 
                                            categories={this.props.category.tierThreeCategories as Array<string>}
                                            setCategory={this.setCategory.bind(this)}
                                            onPressCategoryAddButton={this._toggleModal.bind(this, 'Level 3')}
                                            onPressEdit={this._onPressEditIcon.bind(this)}
                                            onPressDelete={this._onPressDeleteIcon.bind(this)}
                                            selectedTierOne={this.props.category.selectedTierOne}
                                            selectedTierTwo={this.props.category.selectedTierTwo}
                                            h3Thumbnail={this.props.category.tierThreeThumbnail}
                                        />
                                    </CategoryGridItem>
                                </CategoryGrid>
                            </CategoryContainer>
                        }
                    </SymphonyContentContainer>
                    <AddOrEditModal 
                        key="category-addedit-modal"
                        modalAddOrEditIsOpen={this.props.category.modalAddOrEditIsOpen}
                        modalTitle={this.props.category.modalTitle}
                        modalImage={this.props.category.modalImage}
                        modalCategoryName={this.props.category.modalCategoryName}
                        level={this.props.category.selectedLevel}
                        onPressCancelModal={() => this.props.setCategoryState({ modalAddOrEditIsOpen : false, modalTitle: '', modalImage: { name: '', type: '', size: 0, path: '' }, modalCategoryName: '' })}
                        onPressSaveModal={this._onPressSaveAddEditModal.bind(this)}
                        onChangeModalCategoryName={this.onChangeModalCategoryName.bind(this)}
                        onMediaInput={this._onMediaInput.bind(this)}
                        loading={this.props.category.modalAddOrEditIsLoading}
                    />
                    <DeleteModal 
                        modalDeleteIsOpen={this.props.category.modalDeleteIsOpen}
                        onPressCancelButton={() => this.props.setCategoryState({ modalDeleteIsOpen: false }) }
                        onPressDeleteButton={this._onDeleteCategory.bind(this)}
                        loading={this.props.category.modalDeleteIsLoading}
                    />
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        category: state.category
    }
}

export default connect(mapStateToProps, {
    setSystemState,
    setCategoryState,
    getAllCategories,
    addCategory,
    deleteCategory,
    updateCategory
})(Category);