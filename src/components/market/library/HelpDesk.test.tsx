import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import libraryReducer from '../../../store/library/reducers';
import systemReducer from '../../../store/system/reducers';
import { SET_LIBRARY_STATE } from '../../../store/library/types';
import { SET_SYSTEM_STATE } from '../../../store/system/types';
import HelpDesk from './HelpDesk';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
console.warn = jest.fn

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
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <Provider store={store}>
                <Router>
                    <HelpDesk />
                </Router>
            </Provider>
        </MuiPickersUtilsProvider>
    )
    return wrapper;
}

describe('Helpdesk UI', () => {
    let store: ReturnType<typeof createTestStore>;

    it('It should be able to render about us header', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
    
        expect(Header.render().find(`#helpdesk-header-title`)).toHaveLength(1);
    });

    it('It should be able to render save button', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
        expect(Header.render().find(`#helpdesk-save-btn`)).toHaveLength(1);
    });

    it('It should be able to render help desk subheader', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);

        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                helpDeskLoading: false,
                activeHelpDesk: {
                    helpDeskEmail: 'raphael@test.com',
                    helpDeskAddress: 'Test Address',
                    helpDeskPrimaryContact: '09123456789',
                    helpDeskSecondaryContact: '09213456789',
                    helpDeskFax: '12345',
                    helpDeskImage: { name: '', type: 'image/png', path: 'testpath', size: 0 },
                    helpDeskOpening: '08:05 AM',
                    helpDeskClosing: '06:30 PM',
                    helpDeskDateUpdated: 'Test',
                }
            }
        })

        expect(wrapper.render().find(`#helpdesk-header`)).toHaveLength(1);

    });

    it('It should be able to render date updated', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
        
        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                helpDeskLoading: false,
                activeHelpDesk: {
                    helpDeskEmail: 'raphael@test.com',
                    helpDeskAddress: 'Test Address',
                    helpDeskPrimaryContact: '09123456789',
                    helpDeskSecondaryContact: '09213456789',
                    helpDeskFax: '12345',
                    helpDeskImage: { name: '', type: 'image/png', path: 'testpath', size: 0 },
                    helpDeskOpening: '08:05 AM',
                    helpDeskClosing: '06:30 PM',
                    helpDeskDateUpdated: 'Test',
                }
            }
        })

        expect(wrapper.render().find(`#helpdesk-sub-header`)).toHaveLength(1);

    });

    it('It should be able to render email input', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
        
        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                helpDeskLoading: false,
                activeHelpDesk: {
                    helpDeskEmail: 'raphael@test.com',
                    helpDeskAddress: 'Test Address',
                    helpDeskPrimaryContact: '09123456789',
                    helpDeskSecondaryContact: '09213456789',
                    helpDeskFax: '12345',
                    helpDeskImage: { name: '', type: 'image/png', path: 'testpath', size: 0 },
                    helpDeskOpening: '08:05 AM',
                    helpDeskClosing: '06:30 PM',
                    helpDeskDateUpdated: 'Test',
                }
            }
        })

        expect(wrapper.render().find(`#helpdesk-email-input`)).toHaveLength(1);
    });

    it('It should be able to render address input', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
        
        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                helpDeskLoading: false,
                activeHelpDesk: {
                    helpDeskEmail: 'raphael@test.com',
                    helpDeskAddress: 'Test Address',
                    helpDeskPrimaryContact: '09123456789',
                    helpDeskSecondaryContact: '09213456789',
                    helpDeskFax: '12345',
                    helpDeskImage: { name: '', type: 'image/png', path: 'testpath', size: 0 },
                    helpDeskOpening: '08:05 AM',
                    helpDeskClosing: '06:30 PM',
                    helpDeskDateUpdated: 'Test',
                }
            }
        })

        expect(wrapper.render().find(`#helpdesk-address-input`)).toHaveLength(1);
    });

    it('It should be able to render primary contact input', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
        
        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                helpDeskLoading: false,
                activeHelpDesk: {
                    helpDeskEmail: 'raphael@test.com',
                    helpDeskAddress: 'Test Address',
                    helpDeskPrimaryContact: '09123456789',
                    helpDeskSecondaryContact: '09213456789',
                    helpDeskFax: '12345',
                    helpDeskImage: { name: '', type: 'image/png', path: 'testpath', size: 0 },
                    helpDeskOpening: '08:05 AM',
                    helpDeskClosing: '06:30 PM',
                    helpDeskDateUpdated: 'Test',
                }
            }
        })

        expect(wrapper.render().find(`#helpdesk-primarycontact-input`)).toHaveLength(1);
    });

    it('It should be able to render secondary contact input', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
        
        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                helpDeskLoading: false,
                activeHelpDesk: {
                    helpDeskEmail: 'raphael@test.com',
                    helpDeskAddress: 'Test Address',
                    helpDeskPrimaryContact: '09123456789',
                    helpDeskSecondaryContact: '09213456789',
                    helpDeskFax: '12345',
                    helpDeskImage: { name: '', type: 'image/png', path: 'testpath', size: 0 },
                    helpDeskOpening: '08:05 AM',
                    helpDeskClosing: '06:30 PM',
                    helpDeskDateUpdated: 'Test',
                }
            }
        })

        expect(wrapper.render().find(`#helpdesk-secondarycontact-input`)).toHaveLength(1);
    });

    it('It should be able to render fax input', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
        
        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                helpDeskLoading: false,
                activeHelpDesk: {
                    helpDeskEmail: 'raphael@test.com',
                    helpDeskAddress: 'Test Address',
                    helpDeskPrimaryContact: '09123456789',
                    helpDeskSecondaryContact: '09213456789',
                    helpDeskFax: '12345',
                    helpDeskImage: { name: '', type: 'image/png', path: 'testpath', size: 0 },
                    helpDeskOpening: '08:05 AM',
                    helpDeskClosing: '06:30 PM',
                    helpDeskDateUpdated: 'Test',
                }
            }
        })

        expect(wrapper.render().find(`#helpdesk-fax-input`)).toHaveLength(1);
    });

    it('It should be able to render opening time picker', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
        
        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                helpDeskLoading: false,
                activeHelpDesk: {
                    helpDeskEmail: 'raphael@test.com',
                    helpDeskAddress: 'Test Address',
                    helpDeskPrimaryContact: '09123456789',
                    helpDeskSecondaryContact: '09213456789',
                    helpDeskFax: '12345',
                    helpDeskImage: { name: '', type: 'image/png', path: 'testpath', size: 0 },
                    helpDeskOpening: '08:05 AM',
                    helpDeskClosing: '06:30 PM',
                    helpDeskDateUpdated: 'Test',
                }
            }
        })

        expect(wrapper.render().find(`#helpdesk-opening-timepicker`)).toHaveLength(1);
    });

    it('It should be able to render closing time picker', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
        
        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                helpDeskLoading: false,
                activeHelpDesk: {
                    helpDeskEmail: 'raphael@test.com',
                    helpDeskAddress: 'Test Address',
                    helpDeskPrimaryContact: '09123456789',
                    helpDeskSecondaryContact: '09213456789',
                    helpDeskFax: '12345',
                    helpDeskImage: { name: '', type: 'image/png', path: 'testpath', size: 0 },
                    helpDeskOpening: '08:05 AM',
                    helpDeskClosing: '06:30 PM',
                    helpDeskDateUpdated: 'Test',
                }
            }
        })

        expect(wrapper.render().find(`#helpdesk-closing-timepicker`)).toHaveLength(1);
    });
    
    it('It should be able to render media input', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
        
        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                helpDeskLoading: false,
                activeHelpDesk: {
                    helpDeskEmail: 'raphael@test.com',
                    helpDeskAddress: 'Test Address',
                    helpDeskPrimaryContact: '09123456789',
                    helpDeskSecondaryContact: '09213456789',
                    helpDeskFax: '12345',
                    helpDeskImage: { name: '', type: 'image/png', path: 'testpath', size: 0 },
                    helpDeskOpening: '08:05 AM',
                    helpDeskClosing: '06:30 PM',
                    helpDeskDateUpdated: 'Test',
                }
            }
        })

        expect(wrapper.render().find(`#media-add-image`)).toHaveLength(1);
    });

});

describe('Updated Helpdesk', () => {
    let store: ReturnType<typeof createTestStore>;

    it('It should be able to update about us with proper validation', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
        const SaveBtn = Header.find('#helpdesk-save-btn').at(0);

        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                helpDeskLoading: false,
                activeHelpDesk: {
                    helpDeskEmail: 'invalid email',
                    helpDeskAddress: 'Test Address',
                    helpDeskPrimaryContact: '09123456789',
                    helpDeskSecondaryContact: '09213456789',
                    helpDeskFax: '12345',
                    helpDeskImage: { name: '', type: 'image/png', path: 'testpath', size: 0 },
                    helpDeskOpening: '08:05 AM',
                    helpDeskClosing: '06:30 PM',
                    helpDeskDateUpdated: 'Test',
                }
            }
        })
        SaveBtn.simulate('click');
        expect(store.getState().system.systemDialogOpen).toBe(false);

        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                activeHelpDesk: {
                    ...store.getState().library.activeHelpDesk,
                    helpDeskEmail: 'raphael@test.com',
                }
            }
        })
        SaveBtn.simulate('click');
        expect(store.getState().system.systemDialogOpen).toBe(true);

        
        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                activeHelpDesk: {
                    ...store.getState().library.activeHelpDesk,
                    helpDeskAddress: '',
                }
            }
        })

        store.dispatch({ type: SET_SYSTEM_STATE, payload: { systemDialogOpen: false }})
        wrapper.update();
        SaveBtn.simulate('click');
        expect(store.getState().system.systemDialogOpen).toBe(false);
    });
});