import React from 'react';
import { Field, FieldSection } from '../../../../store/fields/types';
import { AutocompleteKeyPair } from '../../../../store/system/types';
import { toastWarning } from '../../../../modules/Toast';

import {
    FieldDialog,
    FieldDialogTitle,
    FieldDialogContent,
    FieldDialogActions,
    FieldDialogCancelButton,
    FieldDialogSaveButton
} from './FieldsComponents';

import SymphonyInput from '../../SymphonyInput';

import moment from 'moment';
import map from 'lodash/map';
import filter from 'lodash/filter';
import FIELD_TYPES from '../fields.json';

interface FieldEditDialogInterface {
    action: 'ADD' | 'UPDATE';
    open: boolean;
    onClose: () => void;
    activeField?: Field;
    sections: Array<FieldSection>;
    onActiveFieldEdit: (field: string, value: string | boolean | Array<string> | Array<AutocompleteKeyPair>) => void;
    onActiveFieldSave: (field: Field) => void;
}

const FieldEditDialog = (props: FieldEditDialogInterface) => {
    const { action, open, onClose, activeField, sections, onActiveFieldEdit, onActiveFieldSave} = props;
    return (
        <FieldDialog fullWidth={true} maxWidth="xs" open={open} onClose={onClose}>
            {activeField &&
                <>
                    <FieldDialogTitle>{action === 'ADD' ? 'Add New' : 'Edit'} Field</FieldDialogTitle>
                    <FieldDialogContent>
                        <SymphonyInput 
                            id="field-crud-name-input"
                            type="text"
                            value={activeField.title}
                            label="Field Name"
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                onActiveFieldEdit('title', e.target.value);
                            }}
                        />
                        <SymphonyInput 
                            id="field-crud-type-input"
                            type="select"
                            value={activeField.type}
                            label="Field Type"
                            selectOptions={filter(FIELD_TYPES, (f) => !['Multimedia', 'Searchable Dropdown'].includes(f.value))}
                            selectOnchange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                onActiveFieldEdit('type', e.target.value as string);
                            }}
                        />
                        {(activeField.type === 'Dropdown' || activeField.type === 'Searchable Dropdown') && 
                            <>
                                <SymphonyInput 
                                    id="field-crud-dynamicvalues-input"
                                    type="freeinput"
                                    value={map(activeField.values, (s) => ({ label: s, value: s }))}
                                    label="Dropdown Values"
                                    autocompleteFreeInput={true}
                                    autocompleteOptions={map(activeField.values, (s) => ({ label: s, value: s }))}
                                    onfreeAutocompleteChange={(e: React.ChangeEvent<{}>, v: Array<unknown>) => {
                                        if (v) {
                                            const val = map(v, (c) => !(c as AutocompleteKeyPair).value ? c as string : (c as AutocompleteKeyPair).value );
                                            onActiveFieldEdit('values', val);
                                            if (activeField.defaultValue && v.indexOf(activeField.defaultValue) === -1) {
                                                toastWarning('Default value was reset');
                                                onActiveFieldEdit('values', [] as Array<string>)
                                            }
                                        }
                                        else {
                                            onActiveFieldEdit('values', [] as Array<string>)
                                        }
                                    }}
                                />
                                <SymphonyInput 
                                    id="field-crud-dynamicdefaultvalue-input"
                                    type="searchabledropdown"
                                    value={activeField.defaultValue as string || ''}
                                    label="Default Value"
                                    autocompleteOptions={map(activeField.values, (v) => ({ label: v, value: v }))}
                                    onAutocompleteChange={(e: React.ChangeEvent<{}>, v: AutocompleteKeyPair | null) => {
                                        props.onActiveFieldEdit('defaultValue', v ? v.value : (activeField.defaultValue as string || ''))
                                    }}
                                    disableCustomerPopover={true}
                                />
                            </>
                        }
                        {activeField.type === 'Multimedia' && 
                            <>
                                <SymphonyInput 
                                    id="field-crud-required-input"
                                    type="radio"
                                    value={activeField.isMultiple as boolean}
                                    label="Variant"
                                    radioTrueText="Multiple"
                                    radioFalseText="Single"
                                    onRadioButtonChange={(val: boolean) => {
                                        onActiveFieldEdit('isMultiple', val);
                                    }}
                                />
                                <SymphonyInput 
                                    id="field-crud-multimediacheckbox-input"
                                    type="checkboxes"
                                    value={activeField.accepts ? map(activeField.accepts, (s) => ({ label: s, value: s })) : []}
                                    label="Accepts"
                                    checkboxesSingleOnly={!activeField.isMultiple}
                                    checkboxesValues={[{ label: 'Images', value: 'image/*' }, { label: 'Videos', value: 'video/*' }, { label: 'Brochures', value: 'application/pdf' }]}
                                    // @ts-ignore
                                    onCheckboxChange={(e: React.ChangeEvent<{ value: string }>) => {
                                        const accepts = activeField.accepts ? activeField.accepts : [];
                                        onActiveFieldEdit('accepts', accepts.includes(e.target.value) ? filter(accepts, (a: string) => a !== e.target.value) : [...accepts, e.target.value] )
        
                                    }}
                                />
                            </>
                        }
                        {activeField.type === 'Date Picker' && 
                            <SymphonyInput 
                                id="field-crud-datepickerrange-input"
                                type="radiolist"
                                value=""
                                label="Accepted Date Range"
                                radioListValues={activeField.validRange ? [activeField.validRange] : []}
                                radioListItems={['Past', 'Past To Present', 'Open', 'Present To Future', 'Future']}
                                radioListOrientation="vertical"
                                onRadioListInput={(val: string | AutocompleteKeyPair) => {
                                    onActiveFieldEdit('validRange', moment(val as string).format('YYYY-MM-DD'));
                                }}
                            />
                        }
                        
                        <SymphonyInput 
                            id="field-crud-required-input"
                            type="radio"
                            value={activeField.isRequired}
                            label="Required"
                            onRadioButtonChange={(val: boolean) => {
                                onActiveFieldEdit('isRequired', val);
                            }}
                        />
                        {((action === 'UPDATE' && activeField.section) || action === 'ADD') &&
                            <SymphonyInput 
                                id="field-crud-section-input"
                                type="searchabledropdown"
                                value={activeField.section as string}
                                label="Section"
                                autocompleteOptions={map(sections, (s) => ({ label: s.name, value: s.name }))}
                                onAutocompleteChange={(e: React.ChangeEvent<{}>, v: AutocompleteKeyPair | null) => {
                                    props.onActiveFieldEdit('section', v ? v.value : '')
                                }}
                                disableCustomerPopover={true}
                            />
                        }
                    </FieldDialogContent>
                    <FieldDialogActions>
                        <FieldDialogCancelButton id="field-crud-cancel-btn" onClick={onClose}>
                            Cancel
                        </FieldDialogCancelButton>
                        <FieldDialogSaveButton id="field-crud-save-btn" onClick={() => {
                            onActiveFieldSave(activeField);
                        }}>
                            Save
                        </FieldDialogSaveButton>
                    </FieldDialogActions>
                </>
            }
        </FieldDialog>
    )
}

export default FieldEditDialog;