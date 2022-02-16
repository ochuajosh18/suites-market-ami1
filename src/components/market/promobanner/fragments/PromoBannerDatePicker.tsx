import React from 'react'

// Material UI
import DateRangeRoundedIcon from '@material-ui/icons/DateRangeRounded';
import { makeStyles, createStyles } from "@material-ui/core/styles";

// Local Components
import { 
    PromoBannerTextField, 
    PromoBannerKeyboardDatePicker, 
    PromoBannerDatePickerLabel, 
    PromoBannerDatePickerContainer,
    PromoBannerDatePickerMainContainer
} from './PromoBannerCommonComponents';

import { SYMPHONY_PRIMARY_COLOR, SYMPHONY_SECONDARY_COLOR_DARK } from '../../../symphony/Colors';

// Utils
import moment from 'moment';

interface PromoBannerDatePickerProps {
    startDate: string;
    endDate: string;
    disableStartDate: boolean;
    disableEndDate: boolean;
    onChangeDate: (property: 'startDate' | 'endDate', value: string) => void;
}


const useStyles = makeStyles(() => createStyles({
    datePicker: {
        '& .MuiPickersDatePickerRoot-toolbar': {
            backgroundColor: SYMPHONY_SECONDARY_COLOR_DARK
        },
        '& .MuiPickersToolbarText-toolbarTxt': {
            backgroundColor: SYMPHONY_SECONDARY_COLOR_DARK,
            color: '#FFF'
        },
        '& .MuiPickersDay-daySelected': {
            backgroundColor: SYMPHONY_PRIMARY_COLOR
        }
    }
}));

const PromoBannerDatePicker = (props: PromoBannerDatePickerProps) => {
    const { datePicker } = useStyles();

    return (
        <PromoBannerDatePickerMainContainer>
            <PromoBannerDatePickerContainer>
                <PromoBannerDatePickerLabel>Publish Date</PromoBannerDatePickerLabel>
                <PromoBannerKeyboardDatePicker 
                    id="promobanner-crud-startdate-datepicker"
                    fullWidth
                    value={props.startDate ? moment(props.startDate, 'DD/MM/YYYY') : null} 
                    onChange={(date, value) => {
                        props.onChangeDate('startDate', value as string)
                    }} 
                    format="DD/MM/YYYY"
                    TextFieldComponent={(props) =>
                        <PromoBannerTextField
                            {...props}
                            value={props.value}
                            disabled
                        />
                    }
                    maxDate={props.endDate ? moment(props.endDate, 'DD/MM/YYYY') : undefined}
                    keyboardIcon={<DateRangeRoundedIcon />}
                    KeyboardButtonProps={{ style: { padding: 2 }}}
                    DialogProps={{ className: datePicker }}
                    disabled={props.disableStartDate}
                    disablePast={true}
                    helperText=""
                />
            </PromoBannerDatePickerContainer>
            <PromoBannerDatePickerContainer>
                <PromoBannerDatePickerLabel>End Date</PromoBannerDatePickerLabel>
                <PromoBannerKeyboardDatePicker 
                    id="promobanner-crud-enddate-datepicker"
                    fullWidth
                    value={props.endDate ? moment(props.endDate, 'DD/MM/YYYY') : null} 
                    onChange={(date, value) => props.onChangeDate('endDate', value as string)} 
                    format="DD/MM/YYYY"
                    TextFieldComponent={(props) =>
                        <PromoBannerTextField
                            {...props}  
                            value={props.value}
                            disabled
                        />
                    }
                    minDate={moment(props.startDate, 'DD/MM/YYYY')}
                    keyboardIcon={<DateRangeRoundedIcon />}
                    KeyboardButtonProps={{ style: { padding: 2 }}}
                    DialogProps={{ className: datePicker }}
                    disabled={props.disableEndDate}
                    disablePast={true}
                    helperText=""
                />
            </PromoBannerDatePickerContainer>
        </PromoBannerDatePickerMainContainer>
    )
}

export default PromoBannerDatePicker;
