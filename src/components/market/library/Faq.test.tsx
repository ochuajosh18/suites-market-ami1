import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import libraryReducer from '../../../store/library/reducers';
import systemReducer from '../../../store/system/reducers';
import { SET_LIBRARY_STATE } from '../../../store/library/types';
import Faq from './Faq';

const createTestStore = () => {
    return createStore(
        combineReducers({
            library: libraryReducer,
            system: systemReducer
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Router>
                <Faq />
            </Router>
        </Provider>
    )
    return wrapper;
}

jest.mock('react-beautiful-dnd', () => ({
    DragDropContext: ({ children }) => <div>{children}</div>,
    Droppable: ({ children }) => children(
        { // provider
            draggableProps: { // snapshot
                style: {},
                isDraggingOver: false
            },
            innerRef: jest.fn()
        },
        {
            isDraggingOver: false
        }
    ),
    Draggable: ({ children }) => children({
        draggableProps: {
          style: {},
        },
        innerRef: jest.fn()
    })
}));

describe('FAQ UI', () => {
    let store: ReturnType<typeof createTestStore>;

    it('It should be able to render FAQ header', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
    
        expect(Header.render().find(`#faq-header-title`)).toHaveLength(1);
    });

    it('It should be able to render add button', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
    
        expect(Header.render().find(`#faq-add-btn`)).toHaveLength(1);
    });

    it('It should be able to render faq item', () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                faqLoading: false,
                faqs: [{
                    question: 'test',
                    answer: 'test',
                    isActive: true
                }]
            }
        })
    
        expect(wrapper.render().find(`#faq-box-0`)).toHaveLength(1);
    });
});

describe('FAQ crud', () => {
    let store: ReturnType<typeof createTestStore>;

    it('It should be able to add faq', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
        const addBtn = Header.find('#faq-add-btn').at(0);
        addBtn.simulate('click');
        
        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                faqLoading: false
            }
        })

        expect(store.getState().library.addFaq).toBe(true);
        wrapper.update()
    });

    it('It should be able to update faq', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const faq = {
            question: 'test',
            answer: 'test',
            isActive: true
        }

        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                faqLoading: false,
                faqs: [faq]
            }
        })
        wrapper.update()

        wrapper.find(`#faq-list-edit-button-0`).at(0).simulate('click')
        expect(store.getState().library.activeFaq).toBe(faq);

        wrapper.update()
        wrapper.find(`#faq-approval-confirm-btn`).at(0).simulate('click')
        expect(store.getState().system.systemDialogOpen).toBe(true);
    });

    it('It should be able to delete faq', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const faq = {
            question: 'test',
            answer: 'test',
            isActive: true
        }

        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                faqLoading: false,
                faqs: [faq]
            }
        })
        wrapper.update()

        wrapper.find(`#faq-list-edit-button-0`).at(0).simulate('click')
        expect(store.getState().library.activeFaq).toBe(faq);

        wrapper.update()
        wrapper.find(`#select-faq-delete-button`).at(0).simulate('click')
        expect(store.getState().system.systemDialogOpen).toBe(true);
    });
});
