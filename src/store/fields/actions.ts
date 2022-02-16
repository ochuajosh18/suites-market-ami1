import {
    SET_FIELDS_STATE,
    FieldStateInput,
    FieldsAction,
} from './types';
import { AppThunk } from '..';
import axios from 'axios';
import map from 'lodash/map';
// import find from 'lodash/find';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import {  toastError, toastSuccess } from '../../modules/Toast';
const API_URL = process.env.REACT_APP_API_URL;

export const setFieldsState = (state: FieldStateInput): FieldsAction => ({
    type: SET_FIELDS_STATE,
    payload: state
});

export const loadModuleFields = (module: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_FIELDS_STATE,
            payload: { fieldsLoading: true, sections: [], fields: [], elements: [], openSections: [] }
        });

        try {
            let res =  await axios.get(`${API_URL}/basic-module-fields/${module}`)
            if (res.status === 200) {
                dispatch({
                    type: SET_FIELDS_STATE,
                    payload: { 
                        sections: map(res.data.sections, (s) => ({
                            name: s,
                            fields: filter(res.data.assignedFields, (f) => f.section === s)
                        })),
                        fields: [...res.data.assignedFields],
                        elements: [...res.data.unassignedFields]
                    }
                });
            }
        }
        catch (e) {
            console.log(e, e.response, `${API_URL}/basic-module-fields/${module}`)
            toastError("There was an issue in fetching the module fields")
        }
        finally {
            dispatch({
                type: SET_FIELDS_STATE,
                payload: { fieldsLoading: false }
            });
            
        }
    }
}

export const saveModuleFields = (module: string): AppThunk => {
    return async (dispatch, getState) => {

        dispatch({
            type: SET_FIELDS_STATE,
            payload: { fieldsLoading: true }
        });

        try {
            const { sections, elements } = getState().fields;

            const assignedFields = flatten([
                ...map(sections, (s) => map(s.fields, (sf, i) => ({
                        ...sf,
                        name: sf.name ? sf.name : sf.title.toLowerCase().replace(/ +/g, '_').trim(),
                        row: i + 1
                    })
                ))
            ]);

            let unassignedFields: Array<{ [name: string]: string | number | boolean | undefined | Array<string> }> =  map(elements, (e, i) => ({
                ...e,
                name: e.name ? e.name : e.title.toLowerCase().replace(/ +/g, '_').trim(),
                row: i + 1
            }));

            for (const f of unassignedFields) {
                if (!f.id || (f.id && f.id === 'new')) delete f.id;
                if (!f.section) delete f.section;
            }

            const data = {
                assignedFields,
                sections: map(sections, (s) => s.name),
                unassignedFields
            }

            const res =  await axios.put(`${API_URL}/basic-module-fields/${module}`, data);
            if (res.status === 200 || res.status === 204) {
                toastSuccess("Module fields updated")
                await new Promise(resolve => setTimeout(resolve, 100));
                dispatch(loadModuleFields(module));
            }
        }
        catch (e) {
            console.log(e, e.response)
            if (e.response) {
                toastError("There was an issue in updating the module fields")
            }
            else {
                toastError("Updating module fields failed. Please check your internet connection")
            }
        }
        finally {
            dispatch({
                type: SET_FIELDS_STATE,
                payload: { fieldsLoading: false, fieldsEditing: false }
            });
            
        }
    }
}