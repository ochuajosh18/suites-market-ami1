import React from 'react';
import Box from '@material-ui/core/Box';
// import Sidebar from '../../Common/SideBar';
// import NavigationDrawer from '../../Common/NavigationDrawer';
// import Header from '../../Common/Header';
import { ToastContainer } from 'react-toastify';

interface BasicLayoutProps {
    children: JSX.Element | JSX.Element[]
}

export default (props: BasicLayoutProps) => (
    <Box
        style={{ 
            height: 'calc(100vh - 120px)',
            width: "100vw", 
            paddingLeft: '300px',
            boxSizing:"border-box",
            display:"flex",
            flexDirection:"column"
        }}
    >   
        {props.children}
        <ToastContainer />
    </Box>
)