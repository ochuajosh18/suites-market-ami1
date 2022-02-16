import Box from '@material-ui/core/Box';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';

export const SukiDialogTitle = withStyles(
    () => ({
        root: {
            backgroundColor: '#999898', 
            color: '#FFF', 
            marginBottom: 16, 
            padding: '12px 24px'
        }
    })
)(DialogTitle);

export const ListBox = withStyles(
    () => ({
        root: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 64px)',
            width: '100%',
            borderRight: '2px solid #B7B7B7',
            boxSizing: 'border-box',
            '& ul.MuiList-root': {
                outline: 'none'
            }
        }
    })
)(Box);

export const SearchBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            boxSizing: 'border-box',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '2px solid #B7B7B7',
            paddingRight: 4,
            height: 64
        }
    })
)(Box);

export const DetailHeaderBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            boxSizing: 'border-box',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 64,
            backgroundColor: '#999898',
            color: '#FFF',
            padding: '0 16px'
        }
    })
)(Box);

export const SukiButton = withStyles(
    () => ({
        root: {
            backgroundColor: '#002108', 
            color: '#FFF', 
            marginTop: 8, 
            padding: '8px 12px',
            textTransform: 'none',
            minWidth: 120,
            '&:hover': {
                backgroundColor: '#002108', 
                opacity: 0.8
            },
            '&.Mui-disabled': {
                color: '#FEFEFE', 
                opacity: 0.7
            }
        }
    })
)(Button);