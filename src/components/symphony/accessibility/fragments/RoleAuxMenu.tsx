import React from 'react';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

interface RoleAuxMenuProps {
    roleId: string;
    children: JSX.Element | Array<JSX.Element>;
}

const RoleAuxMenu = (props: RoleAuxMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'aux-popover' : undefined;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return (
        <div style={{ position: 'relative' }}>
            <IconButton id={`aux-button-${props.roleId}`} onClick={handleClick} style={{ padding: 0, position: 'absolute', width: 24, height: 24, top: -2, left: 50}}>
                <MoreVertIcon style={{ width: 24, height: 24 }} />
            </IconButton>
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
                PaperProps={{
                    style: {
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }}
            >
                {props.children}
            </Popover>
        </div>
    )
}

export default RoleAuxMenu;