import { GenericMedia } from "../system/types";

export interface HelpDesk {
    helpDeskEmail: string;
    helpDeskAddress: string;
    helpDeskPrimaryContact: string;
    helpDeskSecondaryContact: string;
    helpDeskFax: string;
    helpDeskImage: GenericMedia;
    helpDeskOpening: string;
    helpDeskClosing: string;
    helpDeskDateUpdated: string;
}

export interface Faq {
    question: string;
    answer: string;
    isActive: boolean;
}

export interface LibraryState {
    image: GenericMedia;
    description: string;
    aboutUsLoading: boolean;
    helpDeskLoading: boolean;
    activeHelpDesk?: HelpDesk;
    faqLoading: boolean;
    faqs: Array<Faq>;
    selectedFaq: number;
    activeFaq?: Faq;
    addFaq: boolean;
}

export interface LibraryStateInput {
    [name: string]: string | number | boolean | undefined | GenericMedia | HelpDesk | Faq | Array<Faq>;
}

export const SET_LIBRARY_STATE ='set_library_state';

export interface SetLibraryStateAction {
    type: typeof SET_LIBRARY_STATE;
    payload: LibraryStateInput
}

export type LibraryAction = SetLibraryStateAction;