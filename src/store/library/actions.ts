import { AppThunk } from '..';
import { toastError, toastSuccess } from '../../modules/Toast';
import {
    SET_LIBRARY_STATE,
    LibraryStateInput,
    LibraryAction,
    Faq
} from './types';
import axios from 'axios';
import moment from 'moment';

const API_URL = process.env.REACT_APP_API_URL;

export const setLibraryState = (data: LibraryStateInput): LibraryAction => ({
    type: SET_LIBRARY_STATE,
    payload: data
});

export const getAboutUs = () : AppThunk => {
    return async (dispatch, getState) => {
        dispatch({ type: SET_LIBRARY_STATE, payload: { aboutUsLoading: true }});
        try {
            const aboutUs = await axios.get(`${API_URL}/library/about-us`);
            if (aboutUs.status === 200) {
                dispatch({
                    type: SET_LIBRARY_STATE,
                    payload: {
                        image: { type: 'image/png', name: '', path: aboutUs.data.image, size: 0 },
                        description: aboutUs.data.description
                    }
                })
            }
        } catch (e) {
            console.log(e);
            toastError(e.toString());
        } finally {
            dispatch({ type: SET_LIBRARY_STATE, payload: { aboutUsLoading: false }});
        }
    }
}

export const saveAboutUs = () : AppThunk => {
    return async (dispatch, getState) => {
        try {
            const { description, image } = getState().library;

            let body : { image?: string, description?: string }= {
                description,
            }

            let uploadFail = false;
            if (typeof image.file !== 'undefined') {
                const mediaForm = new FormData();
                mediaForm.append('media', image.file!);
                try {
                    const upRes = await axios.post(`${API_URL}/media/upload/about-us`, mediaForm);
                    if (upRes.status === 200) {
                        body = {
                            ...body,
                            image: upRes.data.image as string
                        }
                    }
                } catch (e) {
                    if(e.response.data.error.message === "Each file cannot exceed 5mb") toastError('File cannot exceed 5mb');
                    uploadFail = true;
                }
            }

            if (!uploadFail) {
                const updateAboutUs = await axios.put(`${API_URL}/library/about-us`, body);
    
                if (updateAboutUs.status === 204) {
                    toastSuccess('About us successfully updated');
                    dispatch(getAboutUs());
                }
            }

        } catch (e) {
            console.log(e);
            toastError(e.toString());
        }
    }
}

export const getHelpDesk = () : AppThunk => {
    return async (dispatch, getState) => {
        dispatch({ type: SET_LIBRARY_STATE, payload: { helpDeskLoading: true }})
        try {
            const helpDeskInfo = await axios.get(`${API_URL}/library/help-desk`);
            if (helpDeskInfo.status === 200) {
                dispatch({
                    type: SET_LIBRARY_STATE,
                    payload: {
                        activeHelpDesk: {
                            ...getState().library.activeHelpDesk,
                            helpDeskEmail: helpDeskInfo.data.email,
                            helpDeskAddress: helpDeskInfo.data.address,
                            helpDeskPrimaryContact: helpDeskInfo.data.contactNumber,
                            helpDeskSecondaryContact: helpDeskInfo.data.secondaryContactNumber,
                            helpDeskFax: helpDeskInfo.data.fax,
                            helpDeskImage: { name: '', type: 'image/png', path: helpDeskInfo.data.image, size: 0 },
                            helpDeskOpening: helpDeskInfo.data.openingTime,
                            helpDeskClosing: helpDeskInfo.data.closingTime,
                            helpDeskDateUpdated: helpDeskInfo.data.dateUpdated
                        }
                    }
                })
            }
        } catch (e) {
            console.log(e);
            toastError(e.toString());
        } finally {
            dispatch({ type: SET_LIBRARY_STATE, payload: { helpDeskLoading: false }})
        }
    }
}

export const updateHelpDesk = () : AppThunk => {
    return async (dispatch, getState) => {
        try {
            const { activeHelpDesk } = getState().library;
            if (activeHelpDesk) {
                const { helpDeskAddress, helpDeskClosing, helpDeskOpening, helpDeskPrimaryContact, helpDeskSecondaryContact, helpDeskEmail, helpDeskImage, helpDeskFax } = activeHelpDesk;
                let body : { address: string, closingTime: string, openingTime: string, contactNumber: string, secondaryContactNumber: string, fax: string, dateUpdated: string, email: string, image?: string } = {
                    address: helpDeskAddress,
                    closingTime: helpDeskClosing,
                    openingTime: helpDeskOpening,
                    contactNumber: helpDeskPrimaryContact,
                    secondaryContactNumber: helpDeskSecondaryContact,
                    fax: helpDeskFax,
                    dateUpdated: moment().toISOString(),
                    email: helpDeskEmail,
                }

                // Upload help desk image
                let uploadFail = false;
                if (typeof helpDeskImage.file !== 'undefined') {
                    const mediaForm = new FormData();
                    mediaForm.append('media', helpDeskImage.file!);
                    try {
                        const upRes = await axios.post(`${API_URL}/media/upload/help-desk`, mediaForm);
                        if (upRes.status === 200) {
                            console.log(upRes)
                            body = {
                                ...body,
                                image: upRes.data.image as string
                            }
                            console.log(body)
                        }
                    } catch (e) {
                        if(e.response.data.error.message === "Each file cannot exceed 5mb") toastError('File cannot exceed 5mb');
                        uploadFail = true;
                    }
                }
                
                if (!uploadFail) {
                    console.log(body)
                    const upRes = await axios.put(`${API_URL}/library/help-desk`, body);
                    if (upRes.status === 204) {
                        toastSuccess('Helpdesk successfully updated');
                        dispatch(getHelpDesk());
                    }
                }
            }
        } catch (e) {
            console.log(e);
            toastError(e.toString());
        }
    }
}

export const getFaqs = () : AppThunk => {
    return async (dispatch) => {
        dispatch({ type: SET_LIBRARY_STATE, payload: { faqLoading: true }});
        try {
            const faqs = await axios.get(`${API_URL}/library/faq`);
            if (faqs.status === 200) {
                dispatch({
                    type: SET_LIBRARY_STATE,
                    payload: { faqs: faqs.data }
                })
            }
        } catch (e) {
            console.log(e);
            toastError(e.toString());
        } finally {
            dispatch({ type: SET_LIBRARY_STATE, payload: { faqLoading: false }});
        }
    }
}

export const deleteFaq = () : AppThunk => {
    return async (dispatch, getState) => {
        try {
            const { faqs, selectedFaq } = getState().library;
            faqs.splice(selectedFaq, 1);
            const result = await axios.put(`${API_URL}/library/faq`,{faq: faqs} );
            if (result.status === 204) {
                toastSuccess('FAQ successfully deleted');
                dispatch({ type: SET_LIBRARY_STATE, payload: {selectedFaq: -1}});
            }
        } catch (e) {
            console.log(e);
            toastError(e.toString());
        } 
    }
}

export const saveFaq = () : AppThunk => {
    return async (dispatch, getState) => {
        try {
            const { faqs, selectedFaq, activeFaq } = getState().library;
            if(selectedFaq === -1) {
                faqs.push(activeFaq as Faq)
            } else {
                faqs[selectedFaq] = activeFaq!
            }
            const result = await axios.put(`${API_URL}/library/faq`,{faq: faqs} );
            if (result.status === 204) {
                dispatch({ type: SET_LIBRARY_STATE, payload: {selectedFaq: -1, addFaq: false}});
                toastSuccess(`FAQ successfully ${selectedFaq === -1 ? "saved" : "updated"}`);
            }
        } catch (e) {
            console.log(e);
            toastError(e.toString());
        } 
    }
}

export const updateFaqOrder = () : AppThunk => {
    return async (dispatch, getState) => {
        try {
            await axios.put(`${API_URL}/library/faq`,{faq: getState().library.faqs} );
        } catch (e) {
            console.log(e);
            toastError(e.toString());
        } 
    }
}