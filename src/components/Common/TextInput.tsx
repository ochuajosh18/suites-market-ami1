import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles({
    root: {
        width:'100%',
        marginBottom: 20,
        '& fieldset': {
            borderColor: 'green!important' as any
        },
        '& label': {
            color: 'green!important' as any
        }
    },
    error: {
        width:'100%',
        marginBottom: 20,
        '& fieldset': {
            borderColor: 'red!important' as any
        },
        '& label': {
            color: 'red!important' as any
        }
    },
    default: {
        width:'100%',
        marginBottom: 20,
        '& fieldset': {
            borderColor: 'gray!important' as any
        },
        '& label': {
            color: 'gray!important' as any
        }
    }
});

export default function CustomizedInputs(props) {
    const classes = useStyles();
    const { value, error, required, label, variant, onChange, helperText, type, notFocus } = props
    const textFieldClassName = clsx({
        [classes.default]: !error && notFocus ,
        [classes.error]: error,
        [classes.root]: !error
    })

    return (
        <TextField
            variant={variant}
            label={label}
            className={textFieldClassName}
            error={error}
            required={required}
            onChange={onChange}
            value={value}
            helperText={helperText}
            type={type}
        />
    );
}
