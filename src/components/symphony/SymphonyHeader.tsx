import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { SystemState } from '../../store/system/types';
import { setSystemState } from '../../store/system/actions';
import { LoginState } from '../../store/login/types';
import { resetLoginState } from '../../store/login/actions';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Divider from '@material-ui/core/Divider';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

interface SymphonyHeaderProps {
    setSystemState: typeof setSystemState;
    resetLoginState: typeof resetLoginState;
    login: LoginState;
    system: SystemState;
}

class SymphonyHeader extends React.Component<SymphonyHeaderProps> {

    HeaderPopup = () => {
        const [anchorEl, setAnchorEl] = React.useState(null);
        const open = Boolean(anchorEl);
        const id = open ? 'header-popover' : undefined;

        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
          };
        
        const handleClose = () => {
            setAnchorEl(null);
        };

        const AccountProfileIcon = () => (
            <AccountCircleIcon style={{ width: 40, height: 40 }} htmlColor="#181E28" />
        )
        const { user } = this.props.login;
        return (
            <>
                <Box onClick={handleClick} style={{ cursor: 'pointer', borderRadius: '50%', width: 40, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <AccountProfileIcon />
                </Box>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Box width="240px" boxSizing="border-box">
                        <Box padding="16px" display="flex" >
                            <Box style={{ borderRadius: '50%', padding: 16, boxSizing: 'border-box', width: 48, height: 48, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <AccountProfileIcon />
                            </Box>
                            <Box paddingLeft="8px">
                                <Box>{`${user.firstName} ${user.lastName}`}</Box>
                                <Box style={{ fontSize: 10, color: '#959595', marginBottom: 8 }}>{`${user.email}`}</Box>
                                <Box style={{ fontSize: 11, color: '#5C5C5C', textDecoration: 'underline' }}>Account Settings</Box>
                            </Box>
                        </Box>
                        <Divider />
                        <Box padding="4px" paddingLeft="16px" display="flex" width="100%">
                            <Button style={{ textTransform: 'none', fontSize: 12 }} onClick={() => this.props.resetLoginState() }>
                                Sign Out
                            </Button>
                        </Box>
                    </Box>
                </Popover>
            </>
        )
    }

    render() {
        const { header, headerText, headerEndButton } = this.props.system;
        return (
            <Box height={120} style={{ backgroundColor: '#F4F6F9' }} display="flex" width="100vw" boxSizing="border-box" paddingLeft="300px" position="relative">
                <Box display="flex" flex="1" justifyContent="space-between" alignItems="flex-end" paddingLeft="32px" paddingRight="32px" width="100%">
                    <Box fontSize="36px" width="100%">{header ? header : headerText?.main }</Box>
                    <Box>{headerEndButton}</Box>
                </Box>
                <Box position="absolute" top="16px" right="26px" >
                    {/* Auxilliary */}
                    <this.HeaderPopup />
                </Box>
            </Box>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    login: state.login,
    system: state.system
});

export default connect(mapStateToProps, {
    setSystemState,
    resetLoginState
})(SymphonyHeader);