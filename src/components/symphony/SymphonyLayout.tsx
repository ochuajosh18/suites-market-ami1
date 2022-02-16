import React from 'react';
import Box from '@material-ui/core/Box';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SymphonyLayout {
    children: string | JSX.Element | JSX.Element[];
}

export default (props: SymphonyLayout) => (
    <Box
        style={{ 
            height: 'calc(100vh - 120px)',
            width: "100vw", 
            paddingLeft: '300px',
            boxSizing:"border-box",
            display:"flex",
            flexDirection:"column",
            overflow: 'hidden'
        }}
    >   
        {props.children}
        <ToastContainer />
    </Box>
)