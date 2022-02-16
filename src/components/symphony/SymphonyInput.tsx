import React from 'react';
import { AutocompleteKeyPair } from '../../store/system/types';
// common
import {
    SymphonyInputLabelGridContainer,
    SymphonyInputGridContainer,
    SymphonyInputGridItemContainer,
    SymphonyTextField,
    SymphonyDropdownSearchableField,
    SymphonyIconRadioButton,
    SymphonySelect,
    SymphonyInputChip,
    SymphonyFilterSlider,
    SymphonyFormCheckboxContainer,
    SymphonyInputCheckbox
} from './SymphonyCommonComponents';
import SymphonyCKEditor from './SymphonyCKEditor';
import { SYMPHONY_PRIMARY_COLOR } from './Colors';

// material
import Box from '@material-ui/core/Box';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RemoveIcon from '@material-ui/icons/Remove';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import makeStyles from '@material-ui/styles/makeStyles';
import createStyles from '@material-ui/styles/createStyles';
import { DatePicker } from '@material-ui/pickers';

// util
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import map from 'lodash/map';
import moment, { Moment } from 'moment';
// import filter from 'lodash/filter';

export type SymphonyInputType = 'text' | 'password' | 'decoratedtext' | 'decoratedtextrange' | 'multiline' | 'checkboxes' | 'searchabledropdown' | 'freeinput' |'radio' | 'radiolist' | 'select' | 'slider' | 'datepicker';

interface SymphonyInputProps {
    id?: string;
    type: SymphonyInputType;
    value: string | Array<string> | AutocompleteKeyPair | boolean | Array<AutocompleteKeyPair>;
    label: string;
    inputAdornment?: string | JSX.Element | Array<JSX.Element>;
    disabled?: boolean;
    placeholder?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onAutocompleteChange?: (e: React.ChangeEvent<{}>, value: AutocompleteKeyPair | null) => void;
    onfreeAutocompleteChange?: (e: React.ChangeEvent<{}>, value: Array<unknown>) => void;
    autocompleteOptions?: Array<AutocompleteKeyPair>;
    autocompleteFreeInput?: boolean;
    disableCustomerPopover?: boolean;
    richText?: boolean;
    onRichTextInput?: (evt) => void;
    onRadioButtonChange?: (value: boolean) => void;
    radioTrueText?: string;
    radioFalseText?: string;
    decoratedTextRangeOneId?: string;
    decoratedTextRangeTwoId?: string;
    decoratedTextRangeOneValue?: string;
    decoratedTextRangeTwoValue?: string;
    decoratedTextRangeOverrideDisabledOne?: boolean;
    decoratedTextRangeOverrideDisabledTwo?: boolean;
    decoratedTextOneChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    decoratedTextTwoChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    selectOptions?: Array<AutocompleteKeyPair>;
    selectOnchange?: (e: React.ChangeEvent<{ value: unknown }>) => void;
    maxLength?: number;
    radioListItems?: Array<string | AutocompleteKeyPair>;
    radioListValues?: Array<string | AutocompleteKeyPair>;
    radioListOrientation?: 'horizontal' | 'vertical';
    onRadioListInput?: (val: string | AutocompleteKeyPair) => void;
    sliderValue?: Array<number>;
    sliderMin?: number;
    sliderMax?: number;
    sliderOnChange?: (e: any, newValue: number | Array<number>) => void;
    checkboxesValues?: Array<AutocompleteKeyPair>;
    onCheckboxChange?: (e: React.ChangeEvent<{}>, checked: boolean) => void;
    checkboxesSingleOnly?: boolean;
    checkboxesRow?: boolean;
    onDatePickerChange?: (date: unknown, value: unknown) => void;
    datepickerRange?: 'Past' | 'Past To Present' | 'Open' | 'Present To Future' | 'Future' | string;
    currency?: string;
}

// date picker styles
const useStyles = makeStyles(() => createStyles({
    datePicker: {
        '& .MuiPickersDatePickerRoot-toolbar': {
            backgroundColor: '#181E28'
        },
        '& .MuiPickersToolbarText-toolbarTxt': {
            backgroundColor: '#181E28',
            color: '#FFF'
        },
        '& .MuiPickersDay-daySelected': {
            backgroundColor: '#181E28'
        }
    }
}));

const SymphonyInput = (props: SymphonyInputProps) => {
    const [passVisible, setPassVisible] = React.useState(false);
    const { datePicker } = useStyles(); 
    const { 
        id, 
        label, 
        value, 
        inputAdornment,
        richText, 
        type, 
        placeholder, 
        disabled, 
        autocompleteOptions, 
        autocompleteFreeInput,
        disableCustomerPopover,
        radioFalseText,
        radioTrueText,
        radioListOrientation,
        radioListItems,
        radioListValues,
        decoratedTextRangeOneId,
        decoratedTextRangeTwoId,
        decoratedTextRangeOneValue,
        decoratedTextRangeTwoValue,
        decoratedTextRangeOverrideDisabledOne,
        decoratedTextRangeOverrideDisabledTwo,
        sliderValue,
        sliderMin,
        sliderMax,
        sliderOnChange,
        decoratedTextOneChange,
        decoratedTextTwoChange,
        onChange, 
        onKeyDown,
        onBlur,
        onAutocompleteChange, 
        onfreeAutocompleteChange,
        onRadioButtonChange,
        onRichTextInput,
        onRadioListInput,
        checkboxesValues,
        onCheckboxChange,
        checkboxesSingleOnly,
        checkboxesRow,
        onDatePickerChange,
        datepickerRange
    } = props;
    const searchableDropdownValueIndex = findIndex(props.autocompleteOptions, { value: value as string });
    const searchableDropdownValue = searchableDropdownValueIndex > -1  && autocompleteOptions ? autocompleteOptions[searchableDropdownValueIndex] : null;
    const currency = props.currency ? props.currency : '';
    let filteredChipOptions: Array<string> = [];
    if (type === 'freeinput') {
        filteredChipOptions = map(value as Array<AutocompleteKeyPair>, (o) => o.value);
    }

    let minDate: Moment | undefined = undefined;
    let maxDate: Moment | undefined = undefined;
    if (type === 'datepicker' && datepickerRange) {
        switch (datepickerRange) {
            case 'Past': 
                maxDate = moment().subtract(1, 'days');
                break;
            case 'Past To Present':
                maxDate = moment();
                break;
            case 'Present To Future':
                minDate = moment();
                break;
            case 'Future': 
                minDate = moment().add(1, 'days');
                break;
        }
    }
    return (
        <SymphonyInputGridContainer container={true} style={{ marginBottom: label ? 20 : '0px!important' }}>
            {label &&
                <SymphonyInputLabelGridContainer className="symphony-input-label" item={true} xs={12}>
                    {label}
                </SymphonyInputLabelGridContainer>
            }
            <SymphonyInputGridItemContainer item={true} xs={12} style={{ paddingTop: label ? 6 : 0 }}>
                {type === 'text' &&
                    <SymphonyTextField
                        id={id}
                        type="text"
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        onBlur={onBlur}
                        fullWidth={true}
                        disabled={disabled}
                        placeholder={placeholder}
                        value={value as string}
                        autoComplete="none"
                        inputProps={{ maxLength:  props.maxLength ? props.maxLength : 999 }}
                    />
                }
                {type === 'password' &&
                    <SymphonyTextField
                        id={id}
                        type={passVisible ? 'text' : 'password'}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        onBlur={onBlur}
                        fullWidth={true}
                        disabled={disabled}
                        placeholder={placeholder}
                        value={value as string}
                        autoComplete="new-password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment className={disabled ? 'disabled-adornment' : ''} position="end">
                                    {passVisible ? 
                                        <VisibilityIcon onClick={() => setPassVisible(false)} />
                                    :
                                        <VisibilityOffIcon onClick={() => setPassVisible(true)} />
                                    }
                                </InputAdornment>
                            )
                        }}
                    />
                }
                {type === 'decoratedtext' &&
                    <SymphonyTextField
                        id={id}
                        type="text"
                        onKeyDown={onKeyDown}
                        onChange={onChange}
                        onBlur={onBlur}
                        fullWidth={true}
                        disabled={disabled}
                        placeholder={placeholder}
                        value={value as string}
                        InputProps={{
                            startAdornment: <InputAdornment className={disabled ? 'disabled-adornment' : ''} position="start">{inputAdornment}</InputAdornment>,
                        }}
                    />
                }
                {type === 'decoratedtextrange' &&
                    <>
                        <SymphonyTextField
                            id={decoratedTextRangeOneId}
                            type="text"
                            onChange={decoratedTextOneChange}
                            onBlur={onBlur}
                            onKeyDown={onKeyDown}
                            fullWidth={true}
                            disabled={disabled || decoratedTextRangeOverrideDisabledOne}
                            placeholder={placeholder}
                            value={decoratedTextRangeOneValue as string || ''}
                            InputProps={{
                                startAdornment: <InputAdornment className={(disabled || decoratedTextRangeOverrideDisabledOne) ? 'disabled-adornment' : ''} position="start">{inputAdornment}</InputAdornment>,
                            }}
                        />
                        <RemoveIcon style={{ margin: '0 16px' }} htmlColor="#A1A1A1" />
                        <SymphonyTextField
                            id={decoratedTextRangeTwoId}
                            type="text"
                            onChange={decoratedTextTwoChange}
                            onBlur={onBlur}
                            onKeyDown={onKeyDown}
                            fullWidth={true}
                            disabled={disabled || decoratedTextRangeOverrideDisabledTwo}
                            placeholder={placeholder}
                            value={decoratedTextRangeTwoValue as string || ''}
                            InputProps={{
                                startAdornment: <InputAdornment className={(disabled || decoratedTextRangeOverrideDisabledTwo) ? 'disabled-adornment' : ''} position="start">{inputAdornment}</InputAdornment>,
                            }}
                        />
                    </>
                }
                {type === 'multiline' && !richText &&
                    <SymphonyTextField
                        id={id}
                        multiline={true}
                        value={value as string}
                        type="text"
                        onKeyDown={onKeyDown}
                        onChange={onChange}
                        fullWidth={true}
                        disabled={disabled}
                        placeholder={placeholder}
                    />
                }
                {type === 'multiline' && richText &&
                    <SymphonyCKEditor
                        value={value as string}
                        onChange={onRichTextInput ? onRichTextInput : () => {}}
                    />
                }
                {type === 'select' &&
                    <SymphonySelect 
                        id={id}
                        disabled={disabled}
                        value={props.value}
                        inputProps={{ 'aria-label': 'With out label' }}
                        onChange={props.selectOnchange}
                        displayEmpty={true}
                    >
                        {map(props.selectOptions, (option) => (
                            <MenuItem key={option.value} value={option.value} id={option.value.replace(/ +/g, '_')}>
                                { option.label }
                            </MenuItem>
                        ))}
                    </SymphonySelect>
                }
                {type === 'searchabledropdown' &&
                   <Autocomplete 
                        id={id}
                        value={searchableDropdownValue}
                        options={autocompleteOptions || []}
                        renderOption={(option) => option.label}
                        getOptionLabel={(option) => option.label}
                        fullWidth={true}
                        renderInput={(props) => <SymphonyDropdownSearchableField {...props} placeholder={placeholder} />}
                        onChange={onAutocompleteChange}
                        PopperComponent={!disableCustomerPopover ? (props) => {
                            const { className, anchorEl, style, ...rest } = props;
                            return (
                                <Box {...rest} id={`${id}-autocomplete-list`}  style={{ ...props.style, position: 'absolute', top: 46, width: '100%', left: 0, right: 0, zIndex: 1300 }}>
                                    {props.children}
                                </Box>
                            )
                        } : undefined}
                    />
                }
                {props.type === 'freeinput' &&
                     <Autocomplete 
                        id={id}
                        multiple={true}
                        // @ts-ignore
                        value={value as Array<string | AutocompleteKeyPair> || []}
                        options={autocompleteOptions ? autocompleteOptions : []}
                        freeSolo={autocompleteFreeInput ?? true}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
                        renderTags={(value: Array<{ label: string, value: string }>, getTagProps) =>
                            value.map((option: { label: string, value: string }, index: number) => (
                                <SymphonyInputChip variant="outlined" label={option.label} {...getTagProps({ index })} />
                            ))
                        }
                        getOptionSelected={(o) => filteredChipOptions.includes(o.value)}
                        getOptionLabel={(o: { label: string, value: string }) => o.label}
                        style={{ width: '100%' }}
                        filterSelectedOptions={true}
                        onChange={onfreeAutocompleteChange}
                        renderInput={(props) => 
                            <SymphonyDropdownSearchableField 
                                {...props} 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
                                placeholder={placeholder} 
                            />
                        }
                    />
                }
                {type === 'radio' &&
                    <Box display="inline">
                        <SymphonyIconRadioButton id={`${id}-radio-true`} style={{ marginRight: 8 }} onClick={() => { if(onRadioButtonChange) onRadioButtonChange(true); }}>
                            {props.value === true ?
                                <CheckCircleIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />
                            :
                                <RadioButtonUncheckedIcon htmlColor="#969696" />
                            }
                        </SymphonyIconRadioButton>
                        <Box display="inline" marginRight="16px">{radioTrueText ? radioTrueText : 'Yes'}</Box>
                        <SymphonyIconRadioButton id={`${id}-radio-false`} style={{ marginRight: 8 }} onClick={() => { if(onRadioButtonChange) onRadioButtonChange(false); }}>
                            {props.value === false ?
                                <CheckCircleIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />
                            :
                                <RadioButtonUncheckedIcon htmlColor="#969696"  />
                            }
                        </SymphonyIconRadioButton>
                        <Box display="inline" marginRight="16px">{radioFalseText ? radioFalseText : 'No'}</Box>
                    </Box>
                }
                {type === 'radiolist' &&
                    <Box display="flex" flexDirection={(radioListOrientation && radioListOrientation === 'vertical' ? 'column' : 'row')} flexWrap="wrap">
                        {radioListItems && radioListValues &&
                            map(radioListItems, (i) => (
                                <Box key={`${JSON.stringify(i)}-item`} display="flex" alignItems="center" >
                                    <SymphonyIconRadioButton 
                                        id={`radio-list-${typeof i === 'string' ? i.toLowerCase().replace(/ +/g, '_') : i.value.toLowerCase().replace(/ +/g, '_')}`} 
                                        onClick={() => { if(onRadioListInput) onRadioListInput(i); }}
                                    >
                                        {typeof i === 'string' ? (radioListValues.includes(i) ?
                                            <CheckCircleIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />
                                        :
                                            <RadioButtonUncheckedIcon htmlColor="#969696" />
                                        ): (find(radioListValues as Array<AutocompleteKeyPair>, { value: i.value }) ? 
                                            <CheckCircleIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />
                                        :
                                            <RadioButtonUncheckedIcon htmlColor="#969696" />
                                        )}
                                    </SymphonyIconRadioButton>
                                    <Box display="inline" marginRight="16px">{typeof i === 'string' ? i : i.label}</Box>
                                </Box>
                            
                            ))
                        }
                    </Box>
                }
                {type === 'slider' && 
                    <SymphonyFilterSlider
                        id={id}
                        key={id}
                        defaultValue={sliderValue}
                        onChangeCommitted={sliderOnChange}
                        min={sliderMin}
                        max={sliderMax}
                        marks={[{ value: sliderMin!, label: `${currency} ${sliderMin!.toString()}`}, { value: sliderMax!, label: `${currency} ${sliderMax!.toString()}`} ]}
                        valueLabelDisplay="auto"
                    />
                }
                {type === 'checkboxes' &&
                    <SymphonyFormCheckboxContainer>
                        <FormControl component="fieldset">
                            <FormGroup row={checkboxesRow ?? true}>
                                {map(checkboxesValues as Array<AutocompleteKeyPair>, (c) => (
                                    <FormControlLabel
                                        control={<SymphonyInputCheckbox checked={Boolean(find(value as Array<AutocompleteKeyPair>, { value: c.value }))} value={c.value} />}
                                        label={c.label}
                                        onChange={onCheckboxChange}
                                        disabled={checkboxesSingleOnly && (value as Array<unknown>).length === 1 && !(Boolean(find(value as Array<AutocompleteKeyPair>, { value: c.value })))}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                    </SymphonyFormCheckboxContainer>
                }
                {type === 'datepicker' && 
                    <DatePicker
                        id={id}
                        key={id}
                        value={value ? moment(value as string) : null} 
                        // @ts-ignore
                        onChange={onDatePickerChange} 
                        DialogProps={{ className: datePicker }}
                        format="YYYY-MM-DD"
                        TextFieldComponent={(props) =>
                            <SymphonyTextField
                                {...props}
                                placeholder="Year/MM/DD"
                            />
                        }
                        minDate={minDate}
                        maxDate={maxDate}
                        clearable={true}
                        keyboardIcon={<ArrowDropDownIcon />}
                        KeyboardButtonProps={{ style: { padding: 2 }}}
                    />
                }
            </SymphonyInputGridItemContainer>
        </SymphonyInputGridContainer>
    )
}

export default SymphonyInput;