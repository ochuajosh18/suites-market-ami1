import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import { SET_FIELDS_STATE } from '../../../store/fields/types';
import fields from '../../../store/fields/reducers';
import system from '../../../store/system/reducers';
import Product from './Fields';

const createTestStore = () => {
    return createStore(
        combineReducers({
            fields,
            system
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Router>
                <Product />
            </Router>
        </Provider>
    )
    return wrapper;
}

const setupForCrud = (wrapper: ReturnType<typeof setup>, store: ReturnType<typeof createTestStore>) => {
    wrapper.update();
    store.dispatch({
        type: SET_FIELDS_STATE,
        payload: {
            fieldsLoading: false,
            sections: [{ 
                name: 'Test Section',
                fields: [
                    {
                        id: 'test', 
                        name: 'test_field', 
                        title: 'Test Field', 
                        section: 'Test Section', 
                        row: 0, 
                        type: 'Input Text', 
                        isRequired: false, 
                        isActive: false, 
                        isDefault: true
                    },
                ]
            }],
            elements: [
                {
                    id: 'test_element', 
                    name: 'test_element_field', 
                    title: 'Test Element Field', 
                    section: 0, 
                    row: 0, 
                    type: 'Input Text', 
                    isRequired: false, 
                    isActive: false, 
                    isDefault: false
                },
            ]
        }
    });
    wrapper.update();
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

describe('Field Management UI', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should render the tab modules', () => {
        store = createTestStore();
        const wrapper = setup(store);
        
        expect(wrapper.find('#field-tabs').at(0)).toHaveLength(1);
    });

    it('Should render the sections', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud(wrapper, store);
        expect(wrapper.find('#field-section-container').at(0)).toHaveLength(1);
    });

    it('Should render the elements', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud(wrapper, store);
        
        expect(wrapper.find('#field-elements-container').at(0)).toHaveLength(1);
    });

    it('Should be able to add a field into a section', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud(wrapper, store);

        wrapper.find('#field-element-add-btn').at(0).find('button').at(0).simulate('click');
        wrapper.find('#field-crud-name-input').at(0).find('input').simulate('change', { target: { value: 'New Field Test' }});
        wrapper.find('#field-crud-required-input').at(0).find('#field-crud-required-input-radio-true').at(0).simulate('click');
        store.dispatch({
            type: SET_FIELDS_STATE,
            payload: { 
                activeField: {
                    ...store.getState().fields.activeField!, 
                    section: 'Test Section',
                    type: 'Input Text'
                }
            }
        });

        wrapper.update();
        wrapper.find('#field-crud-save-btn').at(0).simulate('click');
        expect(store.getState().fields.sections[0].fields).toHaveLength(2);
    });

    it('Should be able to edit a field in a section', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud(wrapper, store);

        wrapper.find('#test_element_field-edit-btn').at(0).simulate('click');
        wrapper.find('#field-crud-name-input').at(0).find('input').simulate('change', { target: { value: 'New Field Test' }});
        wrapper.find('#field-crud-required-input').at(0).find('#field-crud-required-input-radio-true').at(0).simulate('click');

        wrapper.update();
        wrapper.find('#field-crud-save-btn').at(0).simulate('click');
        expect({
            ...store.getState().fields.elements[0],
            isRequired: true,
            title: 'New Field Test'
        }).toEqual(store.getState().fields.activeField)
    });

    it('Should be able to render draggable fields', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud(wrapper, store);
       
        expect(wrapper.find('.draggable-field')).not.toHaveLength(1);
    });

    it('Should be able to add a section', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud(wrapper, store);
        
        const AddButtonWrapper = mount(store.getState().system.headerEndButton as JSX.Element);
        AddButtonWrapper.find('#field-add-section-btn').at(0).find('button').simulate('click');
        wrapper.update();
        expect(store.getState().fields.sections).toHaveLength(2);
        AddButtonWrapper.find('#field-add-section-btn').at(0).find('button').simulate('click');
        wrapper.update();
        expect(store.getState().fields.sections).toHaveLength(3);
    });

    it('Should be able to delete a section', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud(wrapper, store);

        // find a section
        const AuxButton = wrapper.find('#field-section-test_section').at(0).find('.field-aux-button').at(0);
        AuxButton.simulate('click');
        
        // delete section
        const DeleteButton = wrapper.find('#field-section-delete-btn').at(0).find('button');
        DeleteButton.simulate('click');
        store.getState().system.systemDialogConfirmAction();
       
        expect(store.getState().fields.sections).toHaveLength(0);
    });

});

describe('Field Management', () => {
    let store: ReturnType<typeof createTestStore>;
    it('Should be able to save module fields', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud(wrapper, store);
        
        const SaveButton = mount(store.getState().system.headerEndButton as JSX.Element);
        SaveButton.find('#field-save-module-btn').at(0).find('button').at(0).simulate('click');
       
        expect(store.getState().system.systemDialogOpen).toBe(true);
    });
})