import React from 'react';
import thunk from 'redux-thunk'
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import category from '../../../store/category/reducers';
import { HierarchyOne, HierarchyTwo, SET_CATEGORY_STATE } from '../../../store/category/types';
import { getAllCategories } from '../../../store/category/actions';

import Category from './Category';

const createTestStore = () => {
    return createStore(
        combineReducers({
            category
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Router>
                <Category />
            </Router>
        </Provider>
    )
    return wrapper;
}

describe('Category', () => {
    let store: ReturnType<typeof createTestStore>;

    it('It should render all 3 category columns.', async () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                categoryLoading: false
            }
        });

        wrapper.update();
        
        expect(wrapper.render().find(`#category-column-one`)).toHaveLength(1);
        expect(wrapper.render().find(`#category-column-two`)).toHaveLength(1);
        expect(wrapper.render().find(`#category-column-three`)).toHaveLength(1);
    });

    it('It should render header in every column', () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                categoryLoading: false
            }
        });

        wrapper.update();

        expect(wrapper.render().find(`#category-header-level-one`)).toHaveLength(1);
        expect(wrapper.render().find(`#category-header-level-two`)).toHaveLength(1);
        expect(wrapper.render().find(`#category-header-level-three`)).toHaveLength(1);
    });

    it('It should render Add Modal with default values on press of add button.', () => {
        store = createTestStore();
        let wrapper = setup(store);
        
        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                categoryLoading: false,
                selectedTierOne: 'test',
                selectedTierTwo: 'test',
                selectedTierThree: 'test',
            }
        });

        wrapper.update();

        const ColumnOneAddButton = wrapper.find("#category-column-one-add-button").at(0);
        const ColumnTwoAddButton = wrapper.find("#category-column-two-add-button").at(0);
        const ColumnThreeAddButton = wrapper.find("#category-column-three-add-button").at(0);
        
        ColumnOneAddButton.simulate('click');
        let addModalLevelOneIsOpen =  store.getState().category.modalTitle === 'Add Category' &&  store.getState().category.modalImage.path === '' && store.getState().category.selectedLevel === 'Level 1' && store.getState().category.modalAddOrEditIsOpen === true ? true : false;
        
        ColumnTwoAddButton.simulate('click');
        let addModalLevelTwoIsOpen = store.getState().category.modalTitle === 'Add Category' &&  store.getState().category.modalImage.path === '' && store.getState().category.selectedLevel === 'Level 2' && store.getState().category.modalAddOrEditIsOpen === true ? true : false;
       
        ColumnThreeAddButton.simulate('click');
        let addModalLevelThreeIsOpen =  store.getState().category.modalTitle === 'Add Category' &&  store.getState().category.modalImage.path === '' && store.getState().category.selectedLevel === 'Level 3' && store.getState().category.modalAddOrEditIsOpen === true ? true : false;
        
        expect(addModalLevelOneIsOpen && addModalLevelTwoIsOpen && addModalLevelThreeIsOpen).toBe(true);

    })

    it('It should render Edit Modal with selected category values on press of edit button on category level 1', () => {
        store = createTestStore();
        let wrapper = setup(store);

        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                tierOneCategories: [
                    {
                        name: `Test Tier 1`,
                        h1Thumbnail: {
                            name: 'Test Tier 1',
                            path: 'Test Tier 1',
                            size: 0,
                            type: 'type/image'
                        },
                        h2: [
                            {
                                name: 'Test Tier 2',
                                h2Thumbnail: {
                                    name: 'Test Tier 2',
                                    path: 'Test Tier 2',
                                    size: 0,
                                    type: 'type/image'
                                },
                                h3: [
                                    'Test Tier 3'
                                ]
                            }
                        ]
                    }
                ],
                categoryLoading: false
            }
        });

        wrapper.update();
        const ColumnOneEditButton = wrapper.find(`#category-row-edit-button-${store.getState().category.tierOneCategories[0].name}`.replace(/\s+/g, '-').toLowerCase()).at(0);
        ColumnOneEditButton.simulate('click');

        expect({ modalTitle : store.getState().category.modalTitle, modalImage: store.getState().category.modalImage.path, modalCategoryName: store.getState().category.modalCategoryName, selectedLevel: store.getState().category.selectedLevel, modalAddOrEditIsOpen: store.getState().category.modalAddOrEditIsOpen })
        .toEqual({ modalTitle: 'Edit', modalImage: store.getState().category.tierOneCategories[0].h1Thumbnail.path, modalCategoryName: store.getState().category.tierOneCategories[0].name, selectedLevel: 'Level 1', modalAddOrEditIsOpen: true})
    })

    it('It should render Edit Modal with selected category values on press of edit button on category level 2', () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                tierTwoCategories: [
                    {
                        name: 'Test Tier 2',
                        h2Thumbnail: {
                            name: 'Test Tier 2',
                            path: 'Test Tier 2',
                            size: 0,
                            type: 'type/image'
                        },
                        h3: [
                            'Test Tier 3'
                        ]
                    }
                ],
                categoryLoading: false
            }
        });

        wrapper.update();
        const ColumnContainer = wrapper.find("#category-column-two").at(0);
        const EditButton = ColumnContainer.find(`#category-row-edit-button-${store.getState().category.tierTwoCategories[0].name}`.replace(/\s+/g, '-').toLowerCase()).at(0);
        EditButton.simulate('click');
        wrapper.update();

        const { tierTwoCategories, modalTitle, modalImage, modalCategoryName, selectedLevel, modalAddOrEditIsOpen } = store.getState().category;

        expect(JSON.stringify({ modalTitle: 'Edit', modalImage: tierTwoCategories[0].h2Thumbnail.path, modalCategoryName: tierTwoCategories[0].name, selectedLevel: 'Level 2', modalAddOrEditIsOpen: true}))
        .toBe(JSON.stringify( { modalTitle, modalImage: modalImage.path, modalCategoryName, selectedLevel, modalAddOrEditIsOpen } ));
    })

    it('It should render Edit Modal with selected category values on press of edit button on category level 3', () => {
        store = createTestStore();
        const wrapper = setup(store);
        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                tierThreeCategories: [
                    'Test Tier 3'
                ],
                categoryLoading: false
            }
        });

        wrapper.update();
        const ColumnContainer = wrapper.find("#category-column-three").at(0);
        const EditButton = ColumnContainer.find(`#category-row-edit-button-${store.getState().category.tierThreeCategories[0]}`.replace(/\s+/g, '-').toLowerCase()).at(0);
        EditButton.simulate('click');
        wrapper.update();

        const { tierThreeCategories, modalTitle, modalImage, modalCategoryName, selectedLevel, modalAddOrEditIsOpen } = store.getState().category;

        expect(JSON.stringify({ modalTitle: 'Edit', modalImage: '', modalCategoryName: tierThreeCategories[0], selectedLevel: 'Level 3', modalAddOrEditIsOpen: true}))
        .toBe(JSON.stringify( { modalTitle, modalImage: modalImage.path, modalCategoryName, selectedLevel, modalAddOrEditIsOpen } ));
    })

    it('It should render Delete Modal on press of delete button', () => {
        store = createTestStore();
        let wrapper = setup(store);

        const INITIAL_STATE = { ...store.getState().category }

        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                tierOneCategories: [
                    {
                        name: `Test Tier 1`,
                        h1Thumbnail: {
                            name: 'Test Tier 1',
                            path: 'Test Tier 1',
                            size: 0,
                            type: 'type/image'
                        },
                        h2: [
                            {
                                name: 'Test Tier 2',
                                h2Thumbnail: {
                                    name: 'Test Tier 2',
                                    path: 'Test Tier 2',
                                    size: 0,
                                    type: 'type/image'
                                },
                                h3: [
                                    'Test Tier 3'
                                ]
                            }
                        ]
                    }
                ],
                tierTwoCategories: [
                    {
                        name: 'Test Tier 2',
                        h2Thumbnail: {
                            name: 'Test Tier 2',
                            path: 'Test Tier 2',
                            size: 0,
                            type: 'type/image'
                        },
                        h3: [
                            'Test Tier 3'
                        ]
                    }
                ],
                tierThreeCategories: [
                    'Test Tier 3'
                ],
                categoryLoading: false
            }
        });

        wrapper.update();

        const ColumnOneContainer = wrapper.find("#category-column-one").at(0);
        const ColumnTwoContainer = wrapper.find("#category-column-two").at(0);
        const ColumnThreeContainer = wrapper.find("#category-column-three").at(0);
        const ColumnOneDeleteButton = ColumnOneContainer.find(`#category-row-delete-button-${store.getState().category.tierOneCategories[0].name}`.replace(/\s+/g, '-').toLowerCase()).at(0);
        const ColumnTwoDeleteButton = ColumnTwoContainer.find(`#category-row-delete-button-${store.getState().category.tierTwoCategories[0].name}`.replace(/\s+/g, '-').toLowerCase()).at(0);
        const ColumnThreeDeleteButton = ColumnThreeContainer.find(`#category-row-delete-button-${store.getState().category.tierThreeCategories[0]}`.replace(/\s+/g, '-').toLowerCase()).at(0);
        ColumnOneDeleteButton.simulate('click');
        ColumnTwoDeleteButton.simulate('click');
        ColumnThreeDeleteButton.simulate('click');

        ColumnOneDeleteButton.simulate('click');
        let addModalLevelOneIsOpen = store.getState().category.modalDeleteIsOpen === true && store.getState().category.selectedLevel === 'Level 1';

        wrapper = setup(store)
        store.dispatch({ type: SET_CATEGORY_STATE, payload: INITIAL_STATE })
        ColumnTwoDeleteButton.simulate('click');
        let addModalLevelTwoIsOpen = store.getState().category.modalDeleteIsOpen === true && store.getState().category.selectedLevel === 'Level 2';

        wrapper = setup(store)
        store.dispatch({ type: SET_CATEGORY_STATE, payload: INITIAL_STATE })
        ColumnThreeDeleteButton.simulate('click');
        let addModalLevelThreeIsOpen = store.getState().category.modalDeleteIsOpen === true && store.getState().category.selectedLevel === 'Level 3';


        expect(addModalLevelOneIsOpen && addModalLevelTwoIsOpen && addModalLevelThreeIsOpen).toBe(true);
    })

    it('It should be able to search case insensitive', () => {
        store = createTestStore();
        const wrapper = setup(store); 
        
        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                tierOneCategories: [
                    {
                        name: `Test Tier 1`,
                        h1Thumbnail: {
                            name: 'Test Tier 1',
                            path: 'Test Tier 1',
                            size: 0,
                            type: 'type/image'
                        },
                        h2: [
                            {
                                name: 'Test Tier 2',
                                h2Thumbnail: {
                                    name: 'Test Tier 2',
                                    path: 'Test Tier 2',
                                    size: 0,
                                    type: 'type/image'
                                },
                                h3: [
                                    'Test Tier 3'
                                ]
                            }
                        ]
                    }
                ],
                tierTwoCategories: [
                    {
                        name: 'Test Tier 2',
                        h2Thumbnail: {
                            name: 'Test Tier 2',
                            path: 'Test Tier 2',
                            size: 0,
                            type: 'type/image'
                        },
                        h3: [
                            'Test Tier 3'
                        ]
                    }
                ],
                tierThreeCategories: [
                    'Test Tier 3'
                ],
                categoryLoading: false
            }
        });

        wrapper.update();

        const SearchInputColumnOne = wrapper.find('#product-search-field-level-one').at(0).find('input').at(0);
        SearchInputColumnOne.simulate('change', { target: { value: 'TeSt' } }); // Simulate on change
        const SearchInputColumnOneValue = 'TeSt'; // manual update since this is an uncontrolled component

        const filteredTierOne = filter(store.getState().category.tierOneCategories, (c) => {
            const categoryName = (c as HierarchyOne).name.toLowerCase();
            return categoryName.indexOf(SearchInputColumnOneValue.toLowerCase()) > -1
        });

        const tierOnePassed = filteredTierOne.length === 1;

        const SearchInputColumnTwo = wrapper.find('#product-search-field-level-two').at(0).find('input').at(0);
        SearchInputColumnTwo.simulate('change', { target: { value: 'TeSt' } }); // Simulate on change
        const SearchInputColumnTwoValue = 'TeSt'; // manual update since this is an uncontrolled component
        
        const filteredTierTwo = filter(store.getState().category.tierTwoCategories, (c) => {
            const categoryName = (c as HierarchyTwo).name.toLowerCase();
            return categoryName.indexOf(SearchInputColumnOneValue.toLowerCase()) > -1
        });

        const tierTwoPassed = filteredTierTwo.length === 1;

        const SearchInputColumnThree = wrapper.find('#product-search-field-level-three').at(0).find('input').at(0);
        SearchInputColumnThree.simulate('change', { target: { value: 'TeSt' } }); // Simulate on change
        const SearchInputColumnThreeValue = 'TeSt'; // manual update since this is an uncontrolled component
        
        const filteredTierThree = filter(store.getState().category.tierThreeCategories, (c) => {
            const categoryName = (c as string).toLowerCase();
            return categoryName.indexOf(SearchInputColumnOneValue.toLowerCase()) > -1
        });

        const tierThreePassed = filteredTierThree.length === 1;

        expect(tierOnePassed && tierTwoPassed && tierThreePassed).toBe(true);
    });

    it('It should be able to search on specific category level', () => {
        store = createTestStore();
        const wrapper = setup(store); 
        
        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                tierOneCategories: [
                    {
                        name: `Test Tier 1`,
                        h1Thumbnail: {
                            name: 'Test Tier 1',
                            path: 'Test Tier 1',
                            size: 0,
                            type: 'type/image'
                        },
                        h2: [
                            {
                                name: 'Test Tier 2',
                                h2Thumbnail: {
                                    name: 'Test Tier 2',
                                    path: 'Test Tier 2',
                                    size: 0,
                                    type: 'type/image'
                                },
                                h3: [
                                    'Test Tier 3'
                                ]
                            }
                        ]
                    }
                ],
                tierTwoCategories: [
                    {
                        name: 'Test Tier 2',
                        h2Thumbnail: {
                            name: 'Test Tier 2',
                            path: 'Test Tier 2',
                            size: 0,
                            type: 'type/image'
                        },
                        h3: [
                            'Test Tier 3'
                        ]
                    }
                ],
                tierThreeCategories: [
                    'Test Tier 3'
                ],
                categoryLoading: false
            }
        });

        wrapper.update();

        const { tierOneCategories, tierTwoCategories, tierThreeCategories } = store.getState().category;

        const SearchInputColumnOne = wrapper.find('#product-search-field-level-one').at(0).find('input').at(0);
        SearchInputColumnOne.simulate('change', { target: { value: 'Non Existing' } }); // Simulate on change
        const SearchInputColumnOneValue = 'Non Existing'; // manual update since this is an uncontrolled component

        const filteredTierOne = filter(store.getState().category.tierOneCategories, (c) => {
            const categoryName = (c as HierarchyOne).name.toLowerCase();
            return categoryName.indexOf(SearchInputColumnOneValue.toLowerCase()) > -1
        });

        const SearchInputColumnTwo = wrapper.find('#product-search-field-level-two').at(0).find('input').at(0);
        SearchInputColumnTwo.simulate('change', { target: { value: 'Non Existing' } }); // Simulate on change
        const SearchInputColumnTwoValue = 'Non Existing'; // manual update since this is an uncontrolled component
        
        const filteredTierTwo = filter(store.getState().category.tierTwoCategories, (c) => {
            const categoryName = (c as HierarchyTwo).name.toLowerCase();
            return categoryName.indexOf(SearchInputColumnTwoValue.toLowerCase()) > -1
        });

        const SearchInputColumnThree = wrapper.find('#product-search-field-level-three').at(0).find('input').at(0);
        SearchInputColumnThree.simulate('change', { target: { value: 'Non Existing' } }); // Simulate on change
        const SearchInputColumnThreeValue = 'Non Existing'; // manual update since this is an uncontrolled component

        const filteredTierThree = filter(store.getState().category.tierThreeCategories, (c) => {
            const categoryName = (c as string).toLowerCase();
            return categoryName.indexOf(SearchInputColumnTwoValue.toLowerCase()) > -1
        });

        const tierOnePass = filteredTierOne.length !== tierOneCategories.length;
        const tierTwoPass = filteredTierTwo.length !== tierTwoCategories.length;
        const tierThreePass = filteredTierThree.length !== tierThreeCategories.length;

        expect(tierOnePass && tierTwoPass && tierThreePass).toBe(true);
    });

    it('It should display the filtered results on change text of search field', () => {
        store = createTestStore();
        const wrapper = setup(store); 
        
        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                tierOneCategories: [
                    {
                        name: `Test Tier 1`,
                        h1Thumbnail: {
                            name: 'Test Tier 1',
                            path: 'Test Tier 1',
                            size: 0,
                            type: 'type/image'
                        },
                        h2: [
                            {
                                name: 'Test Tier 2',
                                h2Thumbnail: {
                                    name: 'Test Tier 2',
                                    path: 'Test Tier 2',
                                    size: 0,
                                    type: 'type/image'
                                },
                                h3: [
                                    'Test Tier 3'
                                ]
                            }
                        ]
                    }
                ],
                tierTwoCategories: [
                    {
                        name: 'Test Tier 2',
                        h2Thumbnail: {
                            name: 'Test Tier 2',
                            path: 'Test Tier 2',
                            size: 0,
                            type: 'type/image'
                        },
                        h3: [
                            'Test Tier 3'
                        ]
                    }
                ],
                tierThreeCategories: [
                    'Test Tier 3'
                ],
                categoryLoading: false
            }
        });

        wrapper.update();

        const ColumnOneContainer = wrapper.find("#category-column-one").at(0);
        const ColumnTwoContainer = wrapper.find("#category-column-two").at(0);
        const ColumnThreeContainer = wrapper.find("#category-column-three").at(0);
        const SearchInputColumnOne = ColumnOneContainer.find('#product-search-field-level-one').at(0).find('input').at(0);
        const SearchInputColumnTwo = ColumnTwoContainer.find('#product-search-field-level-two').at(0).find('input').at(0);
        const SearchInputColumnThree = ColumnThreeContainer.find('#product-search-field-level-three').at(0).find('input').at(0);
        SearchInputColumnOne.simulate('change', { target: { value: 'Test' } }); // Simulate on change
        SearchInputColumnTwo.simulate('change', { target: { value: 'Test' } }); // Simulate on change
        SearchInputColumnThree.simulate('change', { target: { value: 'Test' } }); // Simulate on change
        
        wrapper.update();

        expect(wrapper.render().find(`#category-row-button-${store.getState().category.tierOneCategories[0].name.replace(/\s+/g, '-').toLowerCase()}`)).toHaveLength(1);
        expect(wrapper.render().find(`#category-row-button-${store.getState().category.tierTwoCategories[0].name.replace(/\s+/g, '-').toLowerCase()}`)).toHaveLength(1);
        expect(wrapper.render().find(`#category-row-button-${store.getState().category.tierThreeCategories[0].replace(/\s+/g, '-').toLowerCase()}`)).toHaveLength(1);
    });

    it('It should display the selected category even the search input does not matched with the selected category', () => {
        store = createTestStore();
        const wrapper = setup(store); 
        
        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                tierOneCategories: [
                    {
                        name: `Test Tier 1`,
                        h1Thumbnail: {
                            name: 'Test Tier 1',
                            path: 'Test Tier 1',
                            size: 0,
                            type: 'type/image'
                        },
                        h2: [
                            {
                                name: 'Test Tier 2',
                                h2Thumbnail: {
                                    name: 'Test Tier 2',
                                    path: 'Test Tier 2',
                                    size: 0,
                                    type: 'type/image'
                                },
                                h3: [
                                    'Test Tier 3'
                                ]
                            }
                        ]
                    }
                ],
                tierTwoCategories: [
                    {
                        name: 'Test Tier 2',
                        h2Thumbnail: {
                            name: 'Test Tier 2',
                            path: 'Test Tier 2',
                            size: 0,
                            type: 'type/image'
                        },
                        h3: [
                            'Test Tier 3'
                        ]
                    }
                ],
                tierThreeCategories: [
                    'Test Tier 3'
                ],
                selectedTierOne: 'Test Tier 1',
                selectedTierTwo: 'Test Tier 2',
                categoryLoading: false
            }
        });

        wrapper.update();

        const SearchInputColumnOne = wrapper.find('#product-search-field-level-one').at(0).find('input').at(0);
        const SearchInputColumnTwo = wrapper.find('#product-search-field-level-two').at(0).find('input').at(0);
        SearchInputColumnOne.simulate('change', { target: { value: 'Non Existing' } }); // Simulate on change
        SearchInputColumnTwo.simulate('change', { target: { value: 'Non Existing' } }); // Simulate on change
        const selectedTierOneIndex = findIndex(store.getState().category.tierOneCategories, (tier1) => tier1.name === store.getState().category.selectedTierOne);
        const selectedTierTwoIndex = findIndex(store.getState().category.tierTwoCategories, (tier2) => tier2.name === store.getState().category.selectedTierTwo);
        const tierOnePass = selectedTierOneIndex > -1 ? true : false;
        const tierTwoPass = selectedTierTwoIndex > -1 ? true : false;
        expect(tierOnePass && tierTwoPass).toBe(true);
    });

    it(`It should display 'No Category Available' message if there's no category match on search`, () => {
        store = createTestStore();
        let wrapper = setup(store); 

        const INITIAL_STATE = { ...store.getState().category }
        
        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                tierOneCategories: [
                    {
                        name: `Test Tier 1`,
                        h1Thumbnail: {
                            name: 'Test Tier 1',
                            path: 'Test Tier 1',
                            size: 0,
                            type: 'type/image'
                        },
                        h2: [
                            {
                                name: 'Test Tier 2',
                                h2Thumbnail: {
                                    name: 'Test Tier 2',
                                    path: 'Test Tier 2',
                                    size: 0,
                                    type: 'type/image'
                                },
                                h3: [
                                    'Test Tier 3'
                                ]
                            }
                        ]
                    }
                ],
                tierTwoCategories: [
                    {
                        name: 'Test Tier 2',
                        h2Thumbnail: {
                            name: 'Test Tier 2',
                            path: 'Test Tier 2',
                            size: 0,
                            type: 'type/image'
                        },
                        h3: [
                            'Test Tier 3'
                        ]
                    }
                ],
                tierThreeCategories: [
                    'Test Tier 3'
                ],
                categoryLoading: false
            }
        });

        wrapper.update();
        const SearchInputColumnOne = wrapper.find('#product-search-field-level-one').at(0).find('input').at(0);
        SearchInputColumnOne.simulate('change', { target: { value: 'Non Existing' } }); // Simulate on change
        wrapper.update();

        let tierOnePass = wrapper.render().find(`#category-nocatavail-level-one`).html() === 'No Category Available';
        
        wrapper = setup(store)
        store.dispatch({ type: SET_CATEGORY_STATE, payload: INITIAL_STATE })
        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                selectedTierOne: 'Test Tier 1',
                categoryLoading: false
            }
        });
        wrapper.update();
        const SearchInputColumnTwo = wrapper.find('#product-search-field-level-two').at(0).find('input').at(0);
        SearchInputColumnTwo.simulate('change', { target: { value: 'Non Existing' } }); // Simulate on change
        wrapper.update();
        let tierTwoPass = wrapper.render().find(`#category-nocatavail-level-two`).html() === 'No Category Available';

        wrapper = setup(store)
        store.dispatch({ type: SET_CATEGORY_STATE, payload: INITIAL_STATE })
        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                selectedTierOne: 'Test Tier 1',
                selectedTierTwo: 'Test Tier 2',
                categoryLoading: false
            }
        });
        wrapper.update();
        const SearchInputColumnThree = wrapper.find('#product-search-field-level-three').at(0).find('input').at(0);
        SearchInputColumnThree.simulate('change', { target: { value: 'Non Existing' } }); // Simulate on change
        wrapper.update();
        let tierThreePass = wrapper.render().find(`#category-nocatavail-level-three`).html() === 'No Category Available';

        expect(tierOnePass && tierTwoPass && tierThreePass).toBe(true)
    });

    it(`It should display all the category if the search field is blank`, () => {
        store = createTestStore();
        let wrapper = setup(store); 
        
        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                tierOneCategories: [
                    {
                        name: `Test Tier 1`,
                        h1Thumbnail: {
                            name: 'Test Tier 1',
                            path: 'Test Tier 1',
                            size: 0,
                            type: 'type/image'
                        },
                        h2: [
                            {
                                name: 'Test Tier 2',
                                h2Thumbnail: {
                                    name: 'Test Tier 2',
                                    path: 'Test Tier 2',
                                    size: 0,
                                    type: 'type/image'
                                },
                                h3: [
                                    'Test Tier 3'
                                ]
                            }
                        ]
                    }
                ],
                tierTwoCategories: [
                    {
                        name: 'Test Tier 2',
                        h2Thumbnail: {
                            name: 'Test Tier 2',
                            path: 'Test Tier 2',
                            size: 0,
                            type: 'type/image'
                        },
                        h3: [
                            'Test Tier 3'
                        ]
                    }
                ],
                tierThreeCategories: [
                    'Test Tier 3'
                ],
                categoryLoading: false
            }
        });

        wrapper.update();
        const SearchInputColumnOne = wrapper.find('#product-search-field-level-one').at(0).find('input').at(0);
        const SearchInputColumnTwo = wrapper.find('#product-search-field-level-two').at(0).find('input').at(0);
        const SearchInputColumnThree = wrapper.find('#product-search-field-level-three').at(0).find('input').at(0);
        SearchInputColumnOne.simulate('change', { target: { value: '' } }); // Simulate on change
        SearchInputColumnTwo.simulate('change', { target: { value: '' } }); // Simulate on change
        SearchInputColumnThree.simulate('change', { target: { value: '' } }); // Simulate on change

        let tierOnePass = store.getState().category.tierOneCategories.length === 1;
        let tierTwoPass = store.getState().category.tierTwoCategories.length === 1;
        let tierThreePass = store.getState().category.tierThreeCategories.length === 1;

        expect(tierOnePass && tierTwoPass && tierThreePass).toBe(true);
    });
});


describe('Category CRUD', () => {
    let store: ReturnType<typeof createTestStore>;
    const testImage = { path: 'test.png', type: 'image/png', size: 0, name: 'test.png' }
    it(`It should be able to add/update new category in column level one with media`, () => {
        store = createTestStore();
        const wrapper = setup(store);
        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                categoryLoading: false,
            }
        })

        wrapper.update();
        const ColumnOneAddButton = wrapper.find('#category-column-one-add-button').at(0);
        ColumnOneAddButton.simulate('click');
        
        const CategoryNameInput = wrapper.find("#category-addedit-modal").at(0).find('#category-name-input').at(0).find('input').at(0);
        CategoryNameInput.simulate('change', { target: { value: 'testcategorylevelone' }});

        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                modalImage: testImage
            }
        })

        const comparator = { modalCategoryName: 'testcategorylevelone', modalImage: testImage };
        const { modalCategoryName, modalImage  } = store.getState().category;
        expect({ modalCategoryName, modalImage }).toEqual(comparator);
    });

    it(`It should be able to add/update new category in column level two with media`, () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                categoryLoading: false,
                tierOneCategories: [{
                    name: 'Tier One Test',
                    h1Thumbnail: { path: 'test.png', type: 'image/png', size: 0, name: 'test.png' },
                    h2: []
                }],
                selectedTierOne: 'Tier One Test'
            }
        })

        wrapper.update();
        const ColumnOneAddButton = wrapper.find('#category-column-two-add-button').at(0);
        ColumnOneAddButton.simulate('click');
        
        const CategoryNameInput = wrapper.find("#category-addedit-modal").at(0).find('#category-name-input').at(0).find('input').at(0);
        CategoryNameInput.simulate('change', { target: { value: 'testcategoryleveltwo' }});
        
        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                modalImage: testImage,
            }
        });

        const comparator = { modalCategoryName: 'testcategoryleveltwo', modalImage: testImage };
        const { modalCategoryName, modalImage  } = store.getState().category;
        expect({ modalCategoryName, modalImage }).toEqual(comparator);
    });
    
    it(`It should be able to add/update new category in column level three without media`, () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                categoryLoading: false,
                selectedTierOne: 'Tier One Test',
                selectedTierTwo: 'Tier Two Test',
                tierOneCategories: [{
                    name: 'Tier One Test',
                    h1Thumbnail: { path: 'test.png', type: 'image/png', size: 0, name: 'test.png' },
                    h2: [{ name: 'Tier Two Test', h2Thumbnail: testImage, h3: [] }]
                }],
            }
        })

        wrapper.update();
        const ColumnOneAddButton = wrapper.find('#category-column-three-add-button').at(0);
        ColumnOneAddButton.simulate('click');

        const CategoryNameInput = wrapper.find("#category-addedit-modal").at(0).find('#category-name-input').at(0).find('input').at(0);
        CategoryNameInput.simulate('change', { target: { value: 'testcategorylevelthree' }});

        const comparator = { modalCategoryName: 'testcategorylevelthree' };
        const { modalCategoryName } = store.getState().category;
        expect({ modalCategoryName }).toEqual(comparator);
    });

    it(`It should be able to delete a category for all levels`, () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_CATEGORY_STATE,
            payload: {
                categoryLoading: false,
                selectedTierOne: 'Tier One Test',
                selectedTierTwo: 'Tier Two Test',
                tierOneCategories: [{
                    name: 'Tier One Test',
                    h1Thumbnail: { path: 'test.png', type: 'image/png', size: 0, name: 'test.png' },
                    h2: [{ name: 'Tier Two Test', h2Thumbnail: testImage, h3: ['Tier Three Test'] }]
                }],
            }
        })

        wrapper.update();
        wrapper.find('#category-row-delete-button-tier-one-test').at(0).simulate('click');
        expect(store.getState().category.modalDeleteIsOpen).toBe(true);
        wrapper.find('#category-delete-cancel-btn').at(0).find('button').simulate('click');

        wrapper.find('#category-row-delete-button-tier-two-test').at(0).simulate('click');
        expect(store.getState().category.modalDeleteIsOpen).toBe(true);
        wrapper.find('#category-delete-cancel-btn').at(0).find('button').simulate('click');

        wrapper.find('#category-row-delete-button-tier-three-test').at(0).simulate('click');
        expect(store.getState().category.modalDeleteIsOpen).toBe(true);
    });
})
