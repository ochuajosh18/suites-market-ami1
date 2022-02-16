import { GenericMedia } from "../system/types";

export type DynamicCategoryInput = 
number |
string | 
boolean |
Array<HierarchyOne> |
Array<HierarchyTwo> |
Array<string>

export type ColumnLevel = 'Level 1' | 'Level 2' | 'Level 3';

export interface CategoryState {
    tierOneCategories: Array<HierarchyOne>;
    tierTwoCategories: Array<HierarchyTwo>;
    tierThreeCategories: Array<string>;
    categoryLoading: boolean;
    modalAddOrEditIsOpen: boolean;
    modalAddOrEditIsLoading: boolean;
    modalDeleteIsOpen: boolean;
    modalDeleteIsLoading: boolean;
    modalTitle: string;
    modalImage: GenericMedia;
    modalCategoryName: string;
    prevModalCategoryName: string;
    selectedLevel: ColumnLevel;
    selectedTierOne: string;
    selectedTierTwo: string;
    tierThreeThumbnail: GenericMedia;
}

export const SET_CATEGORY_STATE = 'set_category_state';

export interface CategoryInput {
    [name: string] : string | boolean | number | undefined | Array<HierarchyOne> | Array<HierarchyTwo> | Array<string> | GenericMedia
}

export interface HierarchyOne {
    name: string
    h1Thumbnail: {
        name: string;
        path: string;
        size: number;
        type: string;
    },
    h2: Array<HierarchyTwo>;
}

export interface HierarchyTwo {
    name: string
    h2Thumbnail: {
        name: string;
        path: string;
        size: number;
        type: string;
    },
    h3: Array<string>;
}

export interface SetCategoryStateAction {
    type: typeof SET_CATEGORY_STATE;
    payload: CategoryInput;
}


export type CategoryAction = SetCategoryStateAction;