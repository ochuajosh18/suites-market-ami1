import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles, createStyles } from '@material-ui/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Theme } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

export const AccessibilitySettingsFieldBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            width: '100%',
            heigh: '100%'
        }
    })
)(Box);


export const AccessibilitySettingsFieldHeaderBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            padding: '20px',
            height: 320,
        },
    })
)(Box);


export const AccessibilitySettingsField = withStyles(
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

export const AccessibilitySettingsTypography= withStyles(
    () => ({
        root: {
            fontWeight: 'bold'
        }
    })
)(Typography)

export const AccessibilitySettingsTabsContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }
    })
)(Box);

export const AccessibilityTabContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
        }
    })
)(Box);

export const AccessibilitySettingsTabs = withStyles(
    () => ({
        root: {
          
        }
    })
)(Tabs);

export const AccessibilitySettingsTab = withStyles(
    () => ({
        root: {
            textTransform: 'none',
            fontWeight: 'bold',
            borderBottom: 7,
            borderColor: '#000'
        }
    })
)(Tab);

export const AccessibilityModuleBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            //overflowY: 'auto',
            boxSizing: 'border-box',
            height: 'calc(100vh - 384px)',
            padding:'20px'
        }
    })
)(Box);

export const AccessibilityTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

export const AccessibilityTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: "#C2C1C1",
      color: "#000000",
      fontSize: 16,
    },
    body: {
      fontSize: 16,
    },
  }),
)(TableCell);

export const AccessibilityCheckbox = withStyles(
    () => ({
        root: {
            // '& .MuiSvgIcon-root': {
            // }
            
        }
    })
)(Checkbox);






