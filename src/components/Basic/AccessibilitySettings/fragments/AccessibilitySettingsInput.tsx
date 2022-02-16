import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AccessibilitySettingsField } from './AccessibilitySettingsComponents'

interface AccessibilitySettingsInputProps {
    label: string;
    value: string | boolean;
    type: 'text' | 'readonly' ;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default (props: AccessibilitySettingsInputProps) => {
    return (
        <Grid container style={{ alignItems: 'center', marginTop: 16 }}>
            <Grid item xs={3}>
                <Typography>{props.label}</Typography>
            </Grid>
            <Grid item xs={9}>
                {props.type === 'text' &&
                    <AccessibilitySettingsField
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

            </Grid>
        </Grid>
    )
}