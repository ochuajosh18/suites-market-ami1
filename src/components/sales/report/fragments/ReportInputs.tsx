import React from 'react';
import { ReportTab } from '../../../../store/salesreport/types';
import { SymphonyTextField } from '../../../symphony/SymphonyCommonComponents';
import SymphonyInput from '../../../symphony/SymphonyInput';

import { 
    ReportInputContainer,
    ReportInputSelect,
    ReportInputSelectItem,
    ReportViewButton
} from './ReportComponents';

import DateRangeRoundedIcon from '@material-ui/icons/DateRangeRounded';
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from '@material-ui/pickers';
import RemoveIcon from '@material-ui/icons/Remove';

import moment from 'moment';
import find from 'lodash/find';

interface ReportInputProps {
    activeTab: ReportTab
    type: string;
    salesperson: string;
    salespersonList: Array<{ label: string, value: string }>;
    dateStart: string;
    dateEnd: string;
    onReportInput: (field: string, value: string) => void;
    onViewClick: () => void;
}

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


export default (props: ReportInputProps) => {
    const salespersonOptions = [{ label: 'All Salespersons', value: 'All' }, ...props.salespersonList];
    let salespersonValue = find(salespersonOptions, { value: props.salesperson });
    salespersonValue = salespersonValue ? salespersonValue :  { label: '', value: '' }
    const { datePicker } = useStyles();
    return (
        <ReportInputContainer>
            <ReportInputSelect 
                value={props.type} 
                displayEmpty={true}
                inputProps={{ 'aria-label': 'Without label' }} 
                className={!props.type ? 'selected-disabled' : ''}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    props.onReportInput('reportType', e.target.value as string)
                }}
            >
                <ReportInputSelectItem value="" disabled>Choose report type</ReportInputSelectItem>
                <ReportInputSelectItem value="CALL_VISIT_MEETING">Call Visit Meeting</ReportInputSelectItem>
                <ReportInputSelectItem value="CALL_VISIT_PROFILING">Call Visit Profiling</ReportInputSelectItem>
                {props.activeTab === 'SUMMARY' ? 
                    [<ReportInputSelectItem key="cusreport" value="CUSTOMER">Customer Report</ReportInputSelectItem>]
                :
                    [<ReportInputSelectItem key="tfo" value="TFO">TFO</ReportInputSelectItem>]
                }
            </ReportInputSelect>
            <ReportInputContainer>
                <SymphonyInput
                    id="salesperson-searchable-dropdown"
                    value={salespersonValue.value}
                    type="searchabledropdown"
                    autocompleteOptions={salespersonOptions}
                    label=""
                    onAutocompleteChange={(e, v) => {
                        if (v) {
                            props.onReportInput('reportSalesperson', v.value as string)
                        }
                    }}
                />
                {/* <Autocomplete
                    id="salesperson-searchable-dropdown"
                    value={salespersonValue}
                    options={salespersonOptions}
                    renderOption={(option) => option.label }
                    getOptionLabel={(option) => option.label }
                    fullWidth={true}
                    style={{ marginRight: 16, position: 'relative' }}
                    renderInput={(props) => <SymphonyTextField {...props} placeholder="Choose Salesperson" />}
                    onChange={(e, v) => {
                        if (v) {
                            props.onReportInput('reportSalesperson', v.value as string)
                        }
                    }}
                /> */}
            </ReportInputContainer>
            <KeyboardDatePicker 
                fullWidth={true}
                value={props.dateStart ? moment(props.dateStart, 'DD/MM/YYYY') : null} 
                onChange={(date, value) => {
                    props.onReportInput('reportDateStart', value as string)
                }} 
                format="DD/MM/YYYY"
                TextFieldComponent={(props) =>
                    <SymphonyTextField
                        {...props}
                        placeholder="Start Date"    
                        value={props.value}
                    />
                }
                maxDate={props.dateEnd ? moment(props.dateEnd, 'DD/MM/YYYY') : undefined}
                keyboardIcon={<DateRangeRoundedIcon />}
                KeyboardButtonProps={{ style: { padding: 2 }}}
                DialogProps={{ className: datePicker }}
                clearable={true}
            />
            <RemoveIcon htmlColor="#A1A1A1" />
            <KeyboardDatePicker 
                fullWidth={true}
                value={props.dateEnd ? moment(props.dateEnd, 'DD/MM/YYYY') : null} 
                onChange={(date, value) => {
                    props.onReportInput('reportDateEnd', value as string)
                }} 
                format="DD/MM/YYYY"
                TextFieldComponent={(props) =>
                    <SymphonyTextField
                        {...props}
                        placeholder="End Date"
                        value={props.value}
                    />
                }
                minDate={moment(props.dateStart, 'DD/MM/YYYY')}
                keyboardIcon={<DateRangeRoundedIcon />}
                KeyboardButtonProps={{ style: { padding: 2 }}}
                DialogProps={{ className: datePicker }}
                clearable={true}
            />
            <ReportViewButton onClick={props.onViewClick}>
                View
            </ReportViewButton>
        </ReportInputContainer>
    )
}