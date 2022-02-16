import React from 'react';
import { Field } from '../../store/fields/types';
import { AutocompleteKeyPair, GenericMedia } from '../../store/system/types';
import { BasicProduct, BasicProductSku } from '../../store/basicproduct/types';
import { CustomerContact, Geolocation, ICustomer } from '../../store/customer/types';
import { Distributor } from '../../store/distributor/types';
import { Salesperson } from '../../store/salesperson/types';

import { 
    SymphonyViewInputContainer,
    SymphonyInputGridContainer,
    SymphonyInputGridItemContainer,
    SymphonyInputLabelGridContainer
} from './SymphonyCommonComponents';
import SymphonyInput, { SymphonyInputType } from './SymphonyInput';
import SymphonyMediaInput from './SymphonyMediaInput';
import SalesMap from '../sales/common/SalesMap';
import { toastWarning } from '../../modules/Toast';

import { Moment } from 'moment';
import map from 'lodash/map';
import find from 'lodash/find';
import filter from 'lodash/filter';
import FIELD_TYPES from './fields/fields.json';

interface SymphonyModuleFieldRendererProps {
    fields: Array<Field>;
    section: string;
    onEntityInput: (field: string, value: string | boolean | [number, number] | GenericMedia | Array<GenericMedia> | undefined | Geolocation) => void;
    entity: { [name: string]: string | boolean | Array<string> | GenericMedia | Array<GenericMedia> } | ICustomer | Salesperson | BasicProduct | BasicProductSku | Distributor | CustomerContact;
    customEntityList?: Array<ICustomer> | Array<Salesperson>;
    customEntityType?: 'CUSTOMERS' | 'SALESPERSONS';
    onMediaDelete?: (path: string, fileName?: string) => void;
}

const SymphonyModuleFieldRenderer = (props: SymphonyModuleFieldRendererProps) => {
    const { fields, section, entity, customEntityList, customEntityType, onEntityInput, onMediaDelete } = props;
    const numberRegex: RegExp = /^(\s*|\d+)$/
    const addDecimal = (input: string): string =>   parseFloat(isNaN(parseFloat(input)) ? '0.00' : input).toFixed(2);
    return (
        <SymphonyViewInputContainer key={`${section}-section`}>
            {map(filter(fields, (f) => f.section === section), (f) => {
                const ft = find(FIELD_TYPES, { value: f.type });
                switch(f.type) {
                    case 'Input Text':
                    case 'Input Email':
                    case 'Input Number':
                    case 'Input Phone':
                    case 'View':
                        return (
                            <SymphonyInput
                                key={f.name}
                                disabled={f.type === 'View' || f.disabled}
                                id={`${f.name}-input`}
                                type="text"
                                label={f.title}
                                value={entity[f.name] as string || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    if (['Input Phone', 'Input Number'].includes(f.type)) {
                                        onEntityInput(f.name,  numberRegex.test(e.target.value) ? e.target.value : entity[f.name] as string);
                                    }
                                    else {
                                        onEntityInput(f.name, e.target.value);
                                    }
                                }}
                                onBlur={() => {
                                    if (f.name.toLowerCase().indexOf('price') > -1 && f.type === 'Input Number') {
                                        onEntityInput(f.name, addDecimal(entity[f.name] as string));
                                    }
                                }}
                            />
                        );
                    case 'Input Range':
                        return (
                            <SymphonyInput
                                key={f.name}
                                id={`${f.name}-input`}
                                type="decoratedtextrange"
                                label={f.title}
                                value=""
                                disabled={f.disabled}
                                decoratedTextRangeOneId={`${f.minName}-input`}
                                decoratedTextRangeTwoId={`${f.maxName}-input`}
                                decoratedTextRangeOverrideDisabledOne={f.minDisabled}
                                decoratedTextRangeOverrideDisabledTwo={f.maxDisabled}
                                decoratedTextRangeOneValue={entity[f.minName as string]}
                                decoratedTextRangeTwoValue={entity[f.maxName as string]}
                                decoratedTextOneChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    onEntityInput(f.minName as string, numberRegex.test(e.target.value) ? e.target.value : entity[f.name] as string);
                                }}
                                decoratedTextTwoChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    onEntityInput(f.maxName as string, numberRegex.test(e.target.value) ? e.target.value : entity[f.name] as string);
                                }}
                                onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    const isMin = e.currentTarget.id === f.minName;
                                    if (f.name.toLowerCase().indexOf('price') > -1) {
                                        onEntityInput(!isMin ? f.minName! : f.maxName!, addDecimal(entity[!isMin ? f.minName! : f.maxName!] as string));
                                    }
                                }}
                            />
                        );
                    case 'Dropdown':
                    case 'Searchable Dropdown':
                        if (customEntityList && customEntityType) {
                            return (
                                <SymphonyInput
                                    key={f.name}
                                    id={`${f.name}-input`}
                                    type={ft ? ft.type as SymphonyInputType : 'text'}
                                    label={f.title}
                                    value={entity[f.name] as string || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                        onEntityInput(f.name, e.target.value);
                                    }}
                                    autocompleteOptions={map(customEntityList as Array<Salesperson>, (v) => ({ value: v.id, label: `${v.name} (${v.displayId})` }))}
                                    onAutocompleteChange={(e: React.ChangeEvent<{}>, v: AutocompleteKeyPair | null) => {
                                        props.onEntityInput(f.name, v ? v.value : (entity[f.name] as string || ''))
                                    }}
                                    selectOptions={map(f.values, (v) => ({ value: v, label: v }))}
                                    selectOnchange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                        onEntityInput(f.name, e.target.value as string);
                                    }}
                                />
                            )
                        }
                        return (
                            <SymphonyInput
                                key={f.name}
                                id={`${f.name}-input`}
                                type={ft ? ft.type as SymphonyInputType : 'text'}
                                label={f.title}
                                value={entity[f.name] as string || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    onEntityInput(f.name, e.target.value);
                                }}
                                autocompleteOptions={map(f.values, (v) => ({ value: v, label: v }))}
                                onAutocompleteChange={(e: React.ChangeEvent<{}>, v: AutocompleteKeyPair | null) => {
                                    props.onEntityInput(f.name, v ? v.value : (entity[f.name] as string || ''))
                                }}
                                selectOptions={map(f.values, (v) => ({ value: v, label: v }))}
                                selectOnchange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                    onEntityInput(f.name, e.target.value as string);
                                }}
                            />
                        )
                    case 'Radio Button': 
                        return (
                            <SymphonyInput
                                key={f.name}
                                id={`${f.name}-input`}
                                type="radio"
                                label={f.title}
                                radioTrueText={['status', 'isactive'].includes(f.name.toLowerCase()) ? 'Active' : undefined}
                                radioFalseText={['status', 'isactive'].includes(f.name.toLowerCase())  ? 'Inactive' : undefined}
                                value={entity[f.name] as boolean || false}
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    onEntityInput(f.name, e.target.value);
                                }}
                                onRadioButtonChange={(val) => {
                                    onEntityInput(f.name, val);
                                }}
                            />
                        )
                    case 'Geolocation': 
                        return (
                            <SymphonyInputGridContainer key={`${f.name}`} container={true}>
                                <SymphonyInputLabelGridContainer item={true} xs={12}>
                                    {f.title}
                                </SymphonyInputLabelGridContainer>
                                <SymphonyInputGridItemContainer item={true} xs={12}>
                                    <SalesMap
                                        markerLabel={entity.name ? entity.name as string : ''}
                                        markers={entity[f.name] ? 
                                            [
                                                { 
                                                    position: {
                                                        lat: entity[f.name]!.latitude,
                                                        lng: entity[f.name]!.longitude
                                                    }
                                                }
                                            ]
                                        :
                                            []
                                        }
                                        onMapClick={(data) => {
                                            onEntityInput(f.name, { longitude: data.lng, latitude: data.lat, address: ''} as Geolocation);
                                        }}
                                    />
                                </SymphonyInputGridItemContainer>
                            </SymphonyInputGridContainer>
                        )
                    case 'Image':
                        return (
                             <SymphonyMediaInput
                                key={`${f.name}`}
                                mediaList={entity[f.name] ? [(entity[f.name] as GenericMedia)] : []}
                                imageOnly={true}
                                imageOnlyHeader={f.title}
                                imageOnlyAddText="Change Image"
                                onMediaInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.files) {
                                        onEntityInput(f.name, { ...(entity[f.name] as GenericMedia), file: e.target.files[0] } as GenericMedia);
                                    }
                                }}
                            />
                        )
                    case 'Multimedia':
                        return (
                            <SymphonyMediaInput
                                key={`${f.name}`}
                                mediaList={entity[f.name] ? Array.isArray(entity[f.name]) ? entity[f.name] : [entity[f.name]] as Array<GenericMedia> : []}
                                onMediaDelete={onMediaDelete ? onMediaDelete : (path: string, fileName?: string) => {
                                    if (Array.isArray(entity[f.name])) {
                                        const newMedia = filter(entity[f.name] as Array<GenericMedia>, (m) => fileName && m.file ? m.file.name !== fileName : m.path !== path);
                                        onEntityInput(f.name, newMedia);
                                    }
                                    else {
                                        onEntityInput(f.name, (null as unknown) as string);
                                    }
                                }}
                                accepts={f.accepts}
                                label={f.title}
                                isMultiple={f.isMultiple}
                                onMediaInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.files && f.accepts) {
                                        const selectedFile = e.target.files[0];
                                        const accepted = map(f.accepts, (a) => a.split('/')[0].toLowerCase());
                                        if (!accepted.includes(selectedFile.type.split('/')[0].toLowerCase())) {
                                            toastWarning("Invalid file type");
                                            return;
                                        }
                                        
                                        const newMedia = {
                                            path: '',
                                            size: selectedFile.size,
                                            name: selectedFile.name,
                                            type: selectedFile.type,
                                            file: selectedFile
                                        };
                                        onEntityInput(
                                            f.name, 
                                            // new
                                            typeof entity[f.name] === 'undefined' || !f.isMultiple ? [newMedia] : 
                                            // update
                                            [
                                                ...entity[f.name] as Array<GenericMedia>,
                                                newMedia
                                            ] as Array<GenericMedia>
                                        );
                                    }
                                }}
                            />
                        )
                    case 'Date Picker': 
                        return (
                            <SymphonyInput
                                key={f.name}
                                id={`${f.name}-input`}
                                type="datepicker"
                                label={f.title}
                                value={entity[f.name] as string}
                                onDatePickerChange={(date, value) => {
                                    onEntityInput(f.name, date ? (date as Moment).format('YYYY-MM-DD') : undefined);
                                }}
                                datepickerRange={f.validRange || 'Open'}
                            />
                        )
                }
            })}
        </SymphonyViewInputContainer>
    )
}

export default SymphonyModuleFieldRenderer;