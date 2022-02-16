import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import { toastError } from '../modules/Toast';
export const stringValidator = (string: string) => string ? string.toLowerCase().trim().split(/\s+/).join(' ') : string; 
export const errorHandler = (e: { response: AxiosResponse<any> }) => {
    if (typeof e.response !== 'undefined' && e.response.data.error && e.response.data.error.message) {
        const m =  e.response.data.error.message;
        if (m.indexOf(':') > -1 && m.split(':')[1]) {
            toastError(m.split(':')[1].trim());
        }
        else {
            toastError("Something went wrong. Please contact the administrator");
        }
    }
    else {
        toastError("Something went wrong. Please contact the administrator");
    }
}

export const initAxiosCancelToken = (cancellableRequest: CancelTokenSource | null): CancelTokenSource => {
    if (cancellableRequest) {
        (cancellableRequest as CancelTokenSource).cancel();
    }
    return axios.CancelToken.source();
}