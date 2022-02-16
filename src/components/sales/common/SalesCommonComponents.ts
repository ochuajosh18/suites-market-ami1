import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/styles';
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';

export const SalesBackButton = withStyles(
    () => ({
        root: {
            color: SYMPHONY_PRIMARY_COLOR,
            padding: 0,
            minWidth: 32,
            marginRight: 16
        }
    })
)(Button);

export const SalesTabs = withStyles(
    () => ({
        root: {
           
        }
    })
)(Tabs);

export const SalesTab = withStyles(
    () => ({
        root: {
            textTransform: 'none',
            fontWeight: 'bold',
            minWidth: 'unset',
            width: 'unset',
            padding: 0,
            marginRight: 16,
            '&.MuiTab-textColorInherit:not(.Mui-selected)': {
                color: '#969696',
                opacity: 1
            }
        }
    })
)(Tab);

export const SalesField = withStyles(
    () => ({
        root: {
            border: '1px solid #E5E5E5',
            borderRadius: 5,
            padding: '6px 0 6px 12px',
            boxSizing: 'border-box',
            backgroundColor: '#FFF',
            height: 44,
            '& input': {
                paddingLeft: 'unset!important'
            },
            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                borderBottom: 'none'
            },
            '& .MuiInput-underline:before': {
                borderBottom: 'none'
            },
            '& .MuiInput-underline:after': {
                borderBottom: 'none'
            },
            '& .MuiInput-underline:hover': {
                borderBottom: 'none'
            }
        }
    })
)(TextField);

export const SalesSectionHeaderContainer = withStyles(
    () => ({
        root: {
            display: 'flex'
        }
    })
)(Box);

export const SalesSectionHeaderTitleContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            fontSize: 20,
            fontWeight: 'bold'
        }
    })
)(Box);

export const SalesSectionHeaderSubTitleContainer = withStyles(
    () => ({
        root: {
            fontSize: 12,
            paddingTop: 4,
            color: '#959595',
            fontWeight: 'normal'
        }
    })
)(Box);

export const SalesInputGridContainer = withStyles(
    () => ({
        root: {
            fontSize: 12,
            color: '#959595',
            marginBottom: 20,
        }
    })
)(Grid);

export const SalesInputLabelGridContainer = withStyles(
    () => ({
        root: {
            fontSize: 12,
            color: '#959595'
        }
    })
)(Grid);

export const SalesInputGridItemContainer = withStyles(
    () => ({
        root: {
            fontSize: 12,
            paddingTop: 6,
            fontWeight: 'normal',
            display: 'flex',
            alignItems: 'center'
        }
    })
)(Grid);

export const SalesTextField = withStyles(
    () => ({
        root: {
            '& input': {
                fontSize: 12,
                border: '1px solid #E5E5E5',
                borderRadius: 5,
                padding: '6px 0 6px 18px!important',
                boxSizing: 'border-box',
                backgroundColor: '#FFF',
                height: 44,
            },
            '& textarea': {
                fontSize: 12,
                border: '1px solid #E5E5E5',
                borderRadius: 5,
                padding: '6px 0 6px 18px!important',
                boxSizing: 'border-box',
                backgroundColor: '#FFF',
                minHeight: 100,
            },
            '& input.Mui-disabled, textarea.Mui-disabled': {
                backgroundColor: '#F8F9FB'
            },
            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                borderBottom: 'none'
            },
            '& .MuiInput-underline:before': {
                borderBottom: 'none'
            },
            '& .MuiInput-underline:after': {
                borderBottom: 'none'
            },
            '& .MuiInput-underline:hover': {
                borderBottom: 'none'
            },
            '& .MuiInputAdornment-root': {
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 0,
                borderColor: '#E5E5E5',
                borderStyle: 'solid',
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                height: 44,
                boxSizing: 'border-box',
                marginRight: 0,
                paddingLeft: 18,
                maxHeight: 'unset',
                '& .MuiTypography-root': {
                    fontSize: '12px!important'
                }
            },
            '& .MuiInput-input.MuiInputBase-inputAdornedStart': {
                borderLeft: 0,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                padding: '6px 0 6px 10px!important'
            }
        }
    })
)(TextField);



export const SalesDropdownSearchableField = withStyles(
    () => ({
        root: {
            border: '1px solid #E5E5E5',
            borderRadius: 5,
            padding: '6px 6px 6px 18px!important',
            boxSizing: 'border-box',
            backgroundColor: '#FFF',
            height: 44,
            '& input': {
                fontSize: 12,
                paddingLeft: '0!important'
            },
            '& input.Mui-disabled': {
                backgroundColor: '#F8F9FB'
            },
            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                borderBottom: 'none'
            },
            '& .MuiInput-underline:before': {
                borderBottom: 'none'
            },
            '& .MuiInput-underline:after': {
                borderBottom: 'none'
            },
            '& .MuiInput-underline:hover': {
                borderBottom: 'none'
            }
        }
    })
)(TextField);

export const DecoratedPopoverButton = withStyles(
    () => ({
        root: {
            padding: 4,
            minWidth: 96,
            textTransform: 'none',
            boxSizing: 'border-box',
            border: 'none',
            height: 32,
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            '& .MuiIcon-root': {
                fontSize: 14
            }
        }
    })
)(Button);

export const SalesIconRadioButton = withStyles(
    () => ({
        root: {
            color: '#FFF',
            textTransform: 'none',
            padding: 0,
            width: 32,
            height: 32
        }
    })
)(IconButton);

export const SalesContainer = withStyles(
    () => ({
        root: {
           backgroundColor: '#F4F6F9',
           display: 'flex',
           flexDirection: 'column',
           height: 'calc(100vh - 120px)',
           width: '100%',
           paddingLeft: 300,
           boxSizing: 'border-box'
        }
    })
)(Box);

export const SalesTabsContainer = withStyles(
    () => ({
        root: {
           boxSizing: 'border-box',
           display: 'flex',
           padding: '24px 32px 0',
           justifyContent: 'space-between',
        }
    })
)(Box);

export const SalesContentContainer = withStyles(
    () => ({
        root: {
           backgroundColor: '#FFFFFF',
           display: 'flex',
           flex: 1,
        }
    })
)(Box);

export const SalesContentLoadingContainer = withStyles(
    () => ({
        root: {
            height: 'calc(100vh - 196px)',
            width: '100%',
            padding: '8px 32px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#A2A2A2'
        }
    })
)(Box);

export const SalesHeaderButton = withStyles(
    () => ({
        root: {
            minWidth: 120,
            textTransform: 'none',
            boxSizing: 'border-box',
            backgroundColor: SYMPHONY_PRIMARY_COLOR,
            color: '#FFF',
            border: '1px solid #E5E5E5',
            height: 48,
            borderRadius: 5,
            fontWeight: 'bold',
            '& .MuiSvgIcon-root': {
                fontSize: '24px!important'
            },
            '&:hover': {
                backgroundColor: SYMPHONY_PRIMARY_COLOR,
            }
        }
    })
)(Button);

// Sales List Common Components
export const SalesListContainer = withStyles(
    () => ({
        root: {
            overflowY: 'auto',
            height: 'calc(100vh - 196px)',
            width: '100%',
            padding: '8px 32px',
            boxSizing: 'border-box'
        }
    })
)(Box);

export const SalesRowsContainer = withStyles(
    () => ({
        root: {
            height: 'calc(100vh - 320px)',
            overflowY: 'auto',
            boxSizing: 'border-box',
            width: '100%',
            position: 'relative',
            '&::-webkit-scrollbar': {
                display: 'none'
            }
        }
    })
)(Box);

export const SalesListRowContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            padding: 12,
            boxSizing: 'border-box',
            width: '100%',
            textAlign: 'left'
        }
    })
)(ButtonBase);

export const SalesListGrid = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
        }
    })
)(Grid);

export const SalesListImageContainer = withStyles(
    () => ({
        root: {
            height: 48, 
            width: 48,
            minWidth: 48,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }
    })
)(Grid);