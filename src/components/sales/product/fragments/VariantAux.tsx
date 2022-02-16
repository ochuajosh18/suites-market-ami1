import React from 'react';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

interface SalesAuxMenuProps {
    children: JSX.Element | Array<JSX.Element>;
}

const SalesAuxMenu = (props: SalesAuxMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'aux-popover' : undefined;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        event.preventDefault();
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton className="variants-aux-btn" onClick={handleClick} style={{ width: 32, height: 32 }}>
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
                PaperProps={{ style: { display: 'flex', flexDirection: 'column', padding: 8 } }}
            >
                {props.children}
            </Popover>
        </div>
    )
}

export default SalesAuxMenu