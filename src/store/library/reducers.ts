import {
    SET_LIBRARY_STATE,
    LibraryState,
    LibraryAction
} from './types';

const INITIAL_STATE: LibraryState = {
    image: { name: '', type: '', path: '', size: 0 },
    description: '',
    aboutUsLoading: false,
    helpDeskLoading: false,
    faqLoading: false,
    faqs: [],
    selectedFaq: -1,
    addFaq: false
}

export default (state = INITIAL_STATE, action: LibraryAction): LibraryState => {
    switch (action.type) {
        case SET_LIBRARY_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}