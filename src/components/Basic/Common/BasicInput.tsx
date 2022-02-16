import React from 'react';
import { AutocompletePair, RenderTree } from '../../../store/fields/types';
import {
    KeyboardDatePicker
} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Chip from '@material-ui/core/Chip';
import {
    BasicField, 
    DropdownField, 
    IconRadioButton, 
    BasicMultilineField, 
    BasicSwitch, 
    BasicFieldDateRangeBox,
    BasicExpandedField
} from './BasicCommonComponents';
import { BasicProductMedia } from '../../../store/basicproduct/types';
import { MediaInputType } from '../../../store/system/types';
import BasicMedia from './BasicMedia';
import BasicMap from './BasicMap';
import { Moment } from 'moment';
import { MarkerProps } from '@react-google-maps/api';

interface OptionInterface {
    title: string; 
    value: string | boolean;
} 

interface CustomerInputProps {
    label: string;
    placeholder?: string;
    value: string | Array<string> | boolean | Array<MediaInputType>;
    type: 'text' | 'multiline' | 'readonly' | 'radio' | 'dropdown' | 'searchable' | 'mediainput' | 'switch' | 'daterange' | 'map' | 'freeinput';
    options?: OptionInterface[]
    mediaLabel?: string;
    mediaType?: 'IMAGE' | 'VIDEO' | 'PDF' | 'ALL';
    mediaClick?: (media: MediaInputType) => void;
    disableMediaLabel?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onAutocompleteChange?: (e: React.ChangeEvent<{}>, value: any | AutocompletePair) => void;
    onRadioButtonChange?: (value: boolean) => void;
    numberOnly?: boolean;
    autocompleteList?: Array<AutocompletePair>;
    autocompleteDefault?: string;
    radioTrueText?: string;
    radioFalseText?: string;
    dateRangeValueFrom?: Moment;
    dateRangeValueTo?: Moment;
    treeItems?: RenderTree | Array<RenderTree>;
    mapMarkers?: Array<MarkerProps>
    mapMarkerLabel?: string;
    onMapClick?: (data: { lat: number, lng: number }) => void;
    onDateChange?: (type: 'startDate' | 'endDate', value: string) => void;
}

export default (props: CustomerInputProps) => {
    React.useEffect(() => {}, [props.options]);
    const labelTop = props.type === 'multiline' || props.type === 'mediainput';
    return (
        <Grid container style={{ alignItems: labelTop ? 'flex-start' : 'center', marginTop: 16 }}>
            <Grid item xs={3} style={{ paddingTop: labelTop ? 8 : 0 }}>
                <Typography>{props.label}</Typography>
            </Grid>
            <Grid item xs={9}>
                {props.type === 'text' &&
                    <BasicField
                        fullWidth
                        variant="outlined"
                        placeholder={props.placeholder}
                        value={props.value}
                        onChange={props.onChange}
                        onBlur={props.onBlur}
                        type={props.numberOnly ? 'number' : 'default'}
                    />
                }
                {props.type === 'multiline' &&
                    <BasicMultilineField
                        fullWidth
                        variant="outlined"
                        placeholder={props.placeholder}
                        value={props.value}
                        multiline
                        rows={6}
                        onChange={props.onChange}
                        onBlur={props.onBlur}
                    />
                }
                {props.type === 'readonly' &&
                    <Typography style={{ paddingLeft: 25 }}>
                        {props.value}
                    </Typography>
                }
                {props.type === 'dropdown' &&
                    <DropdownField
                        value={props.value}
                        onChange={props.onAutocompleteChange}
                        options={props.autocompleteList ? props.autocompleteList as any : []}
                        getOptionLabel={(item: any) => { return typeof item === 'string' ? item : item.label }}
                        getOptionSelected={(option: any) =>  {
                            return option.value === props.value
                        }}
                        placeholder={props.placeholder}
                        renderInput={(params) => <BasicField {...params} placeholder={props.placeholder} variant="outlined" value={props.value} />}
                        selectOnFocus
                        defaultValue={props.autocompleteDefault}
                        autoSelect
                    />
                }
                {props.type === 'freeinput' &&
                     <DropdownField
                        multiple={true}
                        value={props.value}
                        options={props.autocompleteList ? props.autocompleteList.map((option) => option.label) : []}
                        freeSolo={true}
                        renderTags={(value: Array<unknown>, getTagProps) =>
                            value.map((option: unknown, index: number) => (
                              <Chip variant="outlined" label={option as string} {...getTagProps({ index })} />
                            ))
                        }
                        filterSelectedOptions={true}
                        onChange={props.onAutocompleteChange}
                        renderInput={(params) => <BasicExpandedField {...params} placeholder={props.placeholder} variant="outlined" value={props.value} />}
                    />
                }
                {props.type === 'radio' &&
                    <Grid container style={{ paddingLeft: 25 }}>
                        <Grid item md={4} xs={6}>
                            {props.radioTrueText ? props.radioTrueText : 'Yes'}
                            <IconRadioButton style={{ marginLeft: 16 }} onClick={() => { if(props.onRadioButtonChange) props.onRadioButtonChange(true); }}>
                                {props.value === true ?
                                    <FiberManualRecordIcon htmlColor="#30B700" style={{ fontSize: "2rem"}} />
                                :
                                    <RadioButtonUncheckedIcon htmlColor="#707070"  style={{ fontSize: 26 }} />
                                }
                            </IconRadioButton>
                        </Grid>
                        <Grid item md={8} xs={6}> 
                            {props.radioFalseText ? props.radioFalseText : 'No'}
                            <IconRadioButton style={{ marginLeft: 16 }} onClick={() => { if(props.onRadioButtonChange) props.onRadioButtonChange(false); }}>
                                {props.value === false ?
                                    <FiberManualRecordIcon htmlColor="#30B700" style={{ fontSize: "2rem"}} />
                                :
                                    <RadioButtonUncheckedIcon htmlColor="#707070"  style={{ fontSize: 26 }} />
                                }
                            </IconRadioButton>
                        </Grid>
                    </Grid>
                }
                {props.type === 'mediainput' &&
                    <BasicMedia
                        media={props.value as Array<BasicProductMedia>}
                        label={props.mediaLabel}
                        disableMediaLabel={props.disableMediaLabel}
                        mediaType={props.mediaType}
                        onChange={props.onChange as ((e: React.ChangeEvent<HTMLInputElement>) => void)}
                        mediaClick={props.mediaClick}
                    />
                }
                {props.type === 'switch' &&
                    <BasicSwitch
                        onClick={props.onClick}
                        onChange={props.onChange}
                        checked={props.value as boolean}
                    />
                }
                {props.type === 'daterange' &&
                    <BasicFieldDateRangeBox>
                        <Box style={{ paddingRight: 16, display: 'flex', alignItems: 'center' }}>
                            Start
                        </Box>
                        <KeyboardDatePicker 
                            value={props.dateRangeValueFrom} 
                            onChange={(date, value) => {
                                if (props.onDateChange) props.onDateChange('startDate', value as string);
                            }} 
                            format="DD/MM/YYYY"
                            TextFieldComponent={(props) =>
                                <BasicField
                                    {...props}
                                    variant="outlined"
                                    placeholder="DD/MM/Year"    
                                    value={props.value}
                                    style={{ maxWidth: 180 }}
                                />
                            }
                            maxDate={props.dateRangeValueTo}
                            keyboardIcon={<ArrowDropDownIcon />}
                            KeyboardButtonProps={{ style: { padding: 2 }}}
                        />
                        <Box style={{ padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                            End
                        </Box>
                        <KeyboardDatePicker 
                            value={props.dateRangeValueTo} 
                            onChange={(date, value) => {
                                if (props.onDateChange) props.onDateChange('endDate', value as string);
                            }} 
                            format="DD/MM/YYYY"
                            TextFieldComponent={(props) =>
                                <BasicField
                                    {...props}
                                    variant="outlined"
                                    placeholder="DD/MM/Year"
                                    value={props.value}
                                    style={{ maxWidth: 180 }}
                                />
                            }
                            minDate={props.dateRangeValueFrom}
                            keyboardIcon={<ArrowDropDownIcon />}
                            KeyboardButtonProps={{ style: { padding: 2 }}}
                        />
                    </BasicFieldDateRangeBox>
                }
                {props.type === 'map' &&
                    <BasicMap
                        markers={props.mapMarkers || []}
                        onMapClick={props.onMapClick}
                        markerLabel={props.mapMarkerLabel || ''}
                    />
                }
            </Grid>
        </Grid>
    )
}