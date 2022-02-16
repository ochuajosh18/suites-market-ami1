import { 
    SET_CATEGORY_STATE, 
    CategoryState, 
    CategoryAction 
} from './types';

const INITIAL_STATE: CategoryState = {
    tierOneCategories: [],
    tierTwoCategories: [],
    tierThreeCategories: [],
    categoryLoading: false,
    modalAddOrEditIsOpen: false,
    modalAddOrEditIsLoading: false,
    modalDeleteIsOpen: false,
    modalDeleteIsLoading: false,
    modalTitle: '',
    modalImage: { name: '', path: '', size: 0, type: '' },
    modalCategoryName: '',
    prevModalCategoryName: '',
    selectedLevel: 'Level 1',
    selectedTierOne: '',
    selectedTierTwo: '',
    tierThreeThumbnail: { name: '', path: '', size: 0, type: '' }
}

export default (state = INITIAL_STATE, action: CategoryAction): CategoryState => {
    switch (action.type) {
        case SET_CATEGORY_STATE:
            return { ...state, ...action.payload }
        default:
        return state;
    }
}