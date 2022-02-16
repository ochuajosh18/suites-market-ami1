export type DynamicBasicNewsType = 
string | 
boolean |
Array<string> | 
number |
Array<BasicNewsMedia> |
News |
Array<News> | 
React.ChangeEvent<HTMLInputElement> |
BasicNewsMedia |
undefined;

export interface BasicNewsMedia extends BasicNewsType<DynamicBasicNewsType> {
    name: string;
    path: string;
    type: string;
    size: number;
}

export interface BasicNewsType<T> {
    [key: string]: T;
}

export interface BasicNewsStateInput {
    [name: string]: DynamicBasicNewsType
}

export interface News extends BasicNewsType<DynamicBasicNewsType> {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    description: string;
    startDate: string;
    endDate: string;
    brochures: Array<BasicNewsMedia>;
    images: Array<BasicNewsMedia>;
    pdf: Array<BasicNewsMedia>;
    videos: Array<BasicNewsMedia>;
    isActive: boolean;
}

export interface NewsState extends BasicNewsType<DynamicBasicNewsType> {
    activeNewsId: string;
    activeNews: News | undefined;
    news: Array<News>;
    newsSearch: string;
    newsListLoading: boolean;
    activeNewsLoading: boolean;
    mediaPreviewVisible: boolean;
    mediaToPreview?: BasicNewsMedia;
}

export const SET_NEWS_STATE = 'set_news_state';

export interface setNewsStateAction {
    type: typeof SET_NEWS_STATE;
    payload: BasicNewsStateInput;
}

export type NewsAction = setNewsStateAction;
