import React from 'react';
import { Redirect } from 'react-router-dom';
import { SymphonyBackButton } from './SymphonyCommonComponents';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

interface BackButtonProps {
    to: string;
    overrideClick?: () => void;
}

const Back = ({ to, overrideClick } : BackButtonProps) => {
    const [shallRedirect, setShallRedirect] = React.useState(false);
    return shallRedirect ? <Redirect to={to} /> : (
        <SymphonyBackButton 
            onClick={() => {
                if (overrideClick) overrideClick();
                else setShallRedirect(true);
            }}
        >
            <ArrowBackIcon />
        </SymphonyBackButton>
    )
}

export default Back;