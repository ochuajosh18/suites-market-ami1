import React from 'react';
import { HelpDesk } from '../../../../store/library/types';
import { GenericMedia } from '../../../../store/system/types';

// Global Components
import { } from '../../../symphony/SymphonyCommonComponents';
import SymphonyInput from '../../../symphony/SymphonyInput';
import SymphonyMediaInput from '../../../symphony/SymphonyMediaInput';

// Local Components
import { 
    LibraryContentContainer,
    LibraryContentHeader,
    SubHeader,
    LibraryInputContainer,
    LibraryInputLabel,
    HelpDeskTimePicker,
    LibraryTextField,
    HelpDeskMediaInputContainer
} from './LibraryCommonComponents';

// Material UI
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Box from '@material-ui/core/Box';
import DateRangeRoundedIcon from '@material-ui/icons/DateRangeRounded';

// Utils
import { toastError } from '../../../../modules/Toast';
import includes from 'lodash/includes';
import moment from 'moment';
import { SYMPHONY_PRIMARY_COLOR, SYMPHONY_SECONDARY_COLOR_DARK } from '../../../symphony/Colors';

interface HelpDeskInformationProps {
    activeHelpDesk: HelpDesk;
    onChangeHelpDeskInput: (property: string, value: string | number | boolean | GenericMedia) => void;
}

const useStyles = makeStyles(() => createStyles({
    timePicker: {
        '& .MuiToolbar-root': {
            backgroundColor: `${SYMPHONY_SECONDARY_COLOR_DARK} !important`
        },
        '& .MuiPickersClock-pin': {
            backgroundColor: SYMPHONY_PRIMARY_COLOR,
            color: '#FFF'
        },
        '& .MuiPickersClockPointer-pointer': {
            backgroundColor: SYMPHONY_PRIMARY_COLOR
        },
        '& .MuiPickersClockNumber-clockNumberSelected': {
            backgroundColor: SYMPHONY_PRIMARY_COLOR
        }
    }
}));

const HelpDeskInformation = (props: HelpDeskInformationProps) => {
    const { timePicker } = useStyles();
    const { helpDeskEmail, helpDeskAddress, helpDeskPrimaryContact, helpDeskSecondaryContact, helpDeskFax, helpDeskOpening, helpDeskClosing, helpDeskImage, helpDeskDateUpdated } = props.activeHelpDesk;
    const numberRegex: RegExp = /^[\d-()+]+$/;

    return (
        <LibraryContentContainer style={{ paddingTop: 15 }}>
            <LibraryContentHeader id="helpdesk-header">Organization Information</LibraryContentHeader>
            <SubHeader id="helpdesk-sub-header" style={{ marginBottom: 15 }}>Last edited on { moment(helpDeskDateUpdated as string).format('DD.MM.YYYY [at] hh:mmA') } </SubHeader>
            <LibraryInputContainer>
                <SymphonyInput 
                    id="helpdesk-email-input"
                    type="text"
                    value={helpDeskEmail}
                    label="Email"
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => props.onChangeHelpDeskInput('helpDeskEmail', e.target.value ) }
                />
            </LibraryInputContainer>
            <LibraryInputContainer>
                <SymphonyInput
                    id="helpdesk-address-input"
                    type="multiline"
                    label="Address"
                    value={helpDeskAddress}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>  props.onChangeHelpDeskInput('helpDeskAddress', e.target.value ) }
                />
            </LibraryInputContainer>
            <LibraryInputContainer>
                <SymphonyInput 
                    id="helpdesk-primarycontact-input"
                    type="text"
                    value={helpDeskPrimaryContact}
                    label="Primary Contact Number"
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        const value = e.target.value as string;
                        if (numberRegex.test(value) || value.length === 0) {
                            props.onChangeHelpDeskInput('helpDeskPrimaryContact', e.target.value ) 
                        }
                    }}
                />
            </LibraryInputContainer>
            <LibraryInputContainer>
                <SymphonyInput 
                    id="helpdesk-secondarycontact-input"
                    type="text"
                    value={helpDeskSecondaryContact}
                    label="Secondary Contact Number"
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        const value = e.target.value as string;
                        if (numberRegex.test(value) || value.length === 0) {
                            props.onChangeHelpDeskInput('helpDeskSecondaryContact', e.target.value )
                        }
                    }}
                />
            </LibraryInputContainer>
            <LibraryInputContainer>
                <SymphonyInput 
                    id="helpdesk-fax-input"
                    type="text"
                    value={helpDeskFax}
                    label="Fax"
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        const value = e.target.value as string;
                        if (numberRegex.test(value) || value.length === 0) {
                            props.onChangeHelpDeskInput('helpDeskFax', e.target.value )
                        }
                    }}
                />
            </LibraryInputContainer>
            <LibraryInputContainer style={{ flexDirection: 'column', paddingTop: 0, width: '43%' }}>
                <LibraryInputLabel>Operating Hours</LibraryInputLabel>
                <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
                    <Box style={{ width: '48%' }}>
                        <HelpDeskTimePicker
                            id="helpdesk-opening-timepicker"
                            label="Opening"
                            mask="__:__ _M"
                            value={helpDeskOpening ? moment(helpDeskOpening, 'hh:mm A') : moment()}
                            onChange={date => props.onChangeHelpDeskInput('helpDeskOpening', moment(date).format('hh:mm A') )}
                            TextFieldComponent={(props) =>
                                <LibraryTextField
                                    {...props}
                                    value={props.value}
                                    disabled
                                />
                            }
                            keyboardIcon={<DateRangeRoundedIcon />}
                            DialogProps={{ className: timePicker }}
                        />
                    </Box>

                    <Box style={{ width: '48%' }}>
                        <HelpDeskTimePicker
                            id="helpdesk-closing-timepicker"
                            label="Closing"
                            mask="__:__ _M"
                            value={helpDeskClosing ? moment(helpDeskClosing, 'hh:mm A') : moment()}
                            onChange={date => props.onChangeHelpDeskInput('helpDeskClosing', moment(date).format('hh:mm A') )}
                            TextFieldComponent={(props) =>
                                <LibraryTextField
                                    {...props}
                                    value={props.value}
                                    disabled
                                />
                            }
                            keyboardIcon={<DateRangeRoundedIcon />}
                            DialogProps={{ className: timePicker }}
                        />
                    </Box>
                </Box> 
            </LibraryInputContainer>
            <LibraryInputContainer>
                <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginTop: 20 }}>
                    <HelpDeskMediaInputContainer>
                        <LibraryInputLabel>Attachment</LibraryInputLabel>
                        <SymphonyMediaInput
                            mediaList={[helpDeskImage]}
                            onMediaInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (e.target.files) {
                                    const file = e.target.files[0];
                                    if (includes(file.type, 'image')) {
                                        if (file.size > 5000000) { toastError('Each file cannot exceed 5mb'); return; };
                                        props.onChangeHelpDeskInput('helpDeskImage', { ...helpDeskImage, type: file.type, file } );
                                        return;
                                    }
                                    toastError('Invalid file type')
                                }
                            }}
                            onMediaDelete={() => {}}
                            imageOnly={true}
                            imageOnlyHeader="Image"
                            imageOnlyAddText="Change Image"
                        />
                    </HelpDeskMediaInputContainer>
                </Box>
            </LibraryInputContainer>
        </LibraryContentContainer>
    )
}

export default HelpDeskInformation;