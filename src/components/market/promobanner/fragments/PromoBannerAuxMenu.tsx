import React from 'react';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

interface PromoBannerAuxMenuProps {
    children: JSX.Element | Array<JSX.Element>;
}

const PromoBannerAuxMenu = (props: PromoBannerAuxMenuProps) => {
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
        <div 
            id="promobanner-auxmenu-btn"
            style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <IconButton className="variant-aux-btn" id="promobanner-aux-button" onClick={handleClick} style={{ padding: 0, position: 'absolute', right: -10, width: 24, height: 24 }}>
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
            >
                {props.children}
            </Popover>
        </div>
    )
}

export default PromoBannerAuxMenu;