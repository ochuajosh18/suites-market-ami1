import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { IconRadioButton } from '../../Basic/Common/BasicCommonComponents';
import { UserField, DropdownField } from './UserComponents';

interface AutocompletePair { 
    label: string;
    value: string;
}

interface UserInputProps {
    label: string;
    value: string | boolean;
    type:  'text' | 'readonly' | 'dropdown' | 'radio';
    radioTrueText?: string;
    radioFalseText?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    autocompleteList?: Array<AutocompletePair>;
    onAutocompleteChange?: (e: React.ChangeEvent<{}>, value: any | AutocompletePair) => void;
    onRadioButtonChange?: (value: boolean) => void;
}

export default (props: UserInputProps) => {
    return (
        <Grid container style={{ alignItems: 'center', marginTop: 16 }}>
            <Grid item xs={3}>
                <Typography>{props.label}</Typography>
            </Grid>
            <Grid item xs={9}>
                {props.type === 'text' &&
                    <UserField
                        fullWidth
                        variant="outlined"
                        value={props.value}
                        onChange={props.onChange}
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
                        getOptionSelected={(option: any) => option === props.value || (option.label && option.label === props.value)}
                        renderInput={(params) => <UserField {...params} variant="outlined" value={props.value} />}
                        selectOnFocus
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
            </Grid>
        </Grid>
    )
}