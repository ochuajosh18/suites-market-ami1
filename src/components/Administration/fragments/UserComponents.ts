import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/styles';

export const UserField = withStyles(
    () => ({
        root: {
            color: '#FFF',
            textTransform: 'none',
            '& .MuiOutlinedInput-root': {
                '& .MuiOutlinedInput-input': {
                    padding: '10px 14px'
                },
                '& fieldset': { 
                    border: '1px solid #000',
                }
            }
        }
    })
)(TextField);

export const DropdownField = withStyles(
    () => ({
        root: {
            color: '#FFF',
            textTransform: 'none',
            '& .MuiOutlinedInput-root': {
                '& .MuiOutlinedInput-input': {
                    padding: '10px 14px'
                },
                '& fieldset': { 
                    border: '1px solid #000',
                }
            },
            '& .MuiAutocomplete-inputRoot': {
                padding: '0 32px 0 0'
            }
        }
    })
)(Autocomplete);