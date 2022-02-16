import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles({
    default: { 
        border: 0,
        backgroundColor: 'gray',
        height: '10px',
        width: '10px',
        borderRadius: '5px',
        marginRight: 10,
        marginBottom: 10,
        cursor: 'pointer',
    }
});

interface IndicatorProps {
    totalItemLength: number
    lengthPerRow: number
}

export default (props: IndicatorProps) => {
    const classes = useStyles();
    const indicatorClassName = clsx({
        [classes.default]: true
    })
    const { totalItemLength, lengthPerRow } = props;

    let numberOfIndicators = 1;
    let quotient = Math.floor(totalItemLength / lengthPerRow);
    let remainder = totalItemLength & lengthPerRow;

    remainder = remainder > 0 ? 1 : 0
    numberOfIndicators = totalItemLength > lengthPerRow ? quotient + remainder : 1
    let dom: any = []

    for (let index = 0; index < numberOfIndicators; index++) {
        console.log(index)
        dom.push(<button className={indicatorClassName} />)
    }

    console.log(dom)

    return dom;

}