import React from 'react';
import Grid from '@material-ui/core/Grid';
import { 
    CallTypeSettingsFieldMenuBox,
    CallTypeSettingsFieldMenuGrid,
    CallTypeSettingsFieldTextBox
} from './CallTypeSettingsComponents';

interface CallTypeSettingsInput {
    label: string;
    value: string | boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    dragHandle? : JSX.Element | React.ComponentClass<unknown, any>
}

export default (props: CallTypeSettingsInput ) => {
    return (
        <CallTypeSettingsFieldMenuBox>
            <Grid container>
                    <CallTypeSettingsFieldMenuGrid item xs={1}>
                        {props.label}
                    </CallTypeSettingsFieldMenuGrid>
                    <Grid item xs={10}>
                        {/* <CallTypeSettingsFieldInput 
                            variant= 'outlined'
                            size= 'medium'
                            value= {props.value}
                            disabled
                            fullWidth
                        /> */}
                        <CallTypeSettingsFieldTextBox>
                            {props.value}
                        </CallTypeSettingsFieldTextBox>
                    </Grid>
                    <CallTypeSettingsFieldMenuGrid item xs={1}>
                        {props.dragHandle}
                    </CallTypeSettingsFieldMenuGrid>
            </Grid>
        </CallTypeSettingsFieldMenuBox>
    )
}