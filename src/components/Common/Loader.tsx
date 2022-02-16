import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { 
    CircularProgress, 
    Box 
} from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        height: '20px!important',
        width: '20px!important'
    },
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default function Loader(props) {
    const classes = useStyles();
    const circularProgressClassName = clsx({
        [classes.root]: true
    })

    const containerClassName = clsx({
        [classes.container]: true
    })
    return (
        <Box className={containerClassName}>
            <CircularProgress color="secondary" className={circularProgressClassName}/>
        </Box>
    )
}
