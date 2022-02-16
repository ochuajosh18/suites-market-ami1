import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

export const ReportBaseContainer = withStyles(
    () => ({
        root: {
            boxSizing: 'border-box',
        }
    })
)(Box);


export const ReportContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            boxSizing: 'border-box',
            padding: '16px 32px',
            flexDirection: 'column'
        }
    })
)(Box);

export const ReportInputContainer = withStyles(
    () => ({
        root: {
            position: 'relative',
            display: 'flex',
            boxSizing: 'border-box',
            width: '100%',
            height: 48,
            alignItems: 'center',
            '& .MuiInputBase-root': {
                width: '100%',
                marginRight: 16,
                '&.MuiInputBase-formControl': {
                    paddingLeft: 10
                },
                '&:before': {
                    borderBottom: 'none'
                },
                '&:after': {
                    borderBottom: 'none'
                },
                '&:hover:before': {
                    borderBottom: 'none'
                }
            },
            '& .MuiSelect-icon': {
                right: 8
            },
            
            '& .selected-disabled': {
                color: '#969696'
            },
            '& .MuiFormHelperText-root.Mui-error': {
                display: 'none'
            },
            '& .MuiInputAdornment-root.MuiInputAdornment-positionEnd': {
                marginRight: 8
            },
            '& .MuiAutocomplete-popupIndicator': {
                marginRight: 4
            }
        }
    })
)(Box);

export const ReportInputSelect = withStyles(
    () => ({
        root: {
            width: '100%',
            border: '1px solid #E5E5E5',
            borderRadius: 5,
            padding: 12,
        }
    })
)(Select);

export const ReportInputSelectItem = withStyles(
    () => ({
       
    })
)(MenuItem);

export const ReportDateRangeBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }
    })
)(Box);

export const ReportViewButton = withStyles(
    () => ({
        root: {
            minWidth: 96,
            textTransform: 'none',
            boxSizing: 'border-box',
            padding: '10px 0 11px',
            backgroundColor: SYMPHONY_PRIMARY_COLOR,
            color: '#FFF'
        }
    })
)(Button);


export const ReportTableContainer = withStyles(
    () => ({
        root: {
            boxSizing: 'border-box',
            marginTop: 16,
            height: 'calc(100vh - 324px)',
            position:'relative',
            '& .MuiInputBase-root': {
                '&:before': {
                    borderBottom: 'none'
                },
                '&:after': {
                    borderBottom: 'none'
                },
                '&:hover:before': {
                    borderBottom: 'none'
                }
            }
            
        }
    })
)(Box);

export const ReportTableLoadingContainer = withStyles(
    () => ({
        root: {
            position: 'absolute',
            display: 'flex',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.02)',
            zIndex: 1000
        }
    })
)(Box);

export const ReportTableTitleContainer = withStyles(
    () => ({
        root: {
            fontSize: 24,
            fontWeight: 'bold'
        }
    })
)(Box);

export const ReportHeaderButton = withStyles(
    () => ({
        root: {
            marginLeft: 16,
            minWidth: 96,
            textTransform: 'none',
            boxSizing: 'border-box',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E5E5',
            height: 48,
            fontWeight: 'bold',
            '& .MuiIcon-root': {
                fontSize: 14
            }
        }
    })
)(Button);

export const SummaryReportContainer = withStyles(
    () => ({
        root: {
            height: 'calc(100vh - 192px)',
            overflowY: 'auto',
            display: 'flex',
            boxSizing: 'border-box',
            padding: 16,
            backgroundColor: '#F3F7FE',
            flexWrap: 'wrap'
        }
    })
)(Box);

export const SummaryReportChartContainer = withStyles(
    () => ({
        root: {
            backgroundColor: '#FFF',
            borderRadius: 8,
            padding: '16px 24px',
            boxSizing: 'border-box',
            width: 250,
            height: 320,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 16
        }
    })
)(Box);