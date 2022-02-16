import {
    SET_NEWS_STATE,
    NewsAction,
    NewsState,
} from './types'

const INITIAL_STATE: NewsState = {
    activeNews: undefined,
    activeNewsId: '',
    news: [],
    newsSearch: '',
    newsListLoading: false,
    activeNewsSaving: false,
    activeNewsLoading: false,
    mediaPreviewVisible: false
}

export default (state = INITIAL_STATE, action: NewsAction): NewsState => {
    switch (action.type) {
        case SET_NEWS_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}