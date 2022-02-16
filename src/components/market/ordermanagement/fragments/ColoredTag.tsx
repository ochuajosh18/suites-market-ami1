import React from 'react';
import Box from '@material-ui/core/Box';

const ColoredTagRenderer = ({ value }: { value: string }) => {
    let backgroundColor = '#FFF';
    switch (value) {
        case 'Pending': backgroundColor = '#959595'; // gray
            break;
        case 'Shipped':
        case 'Delivered':
        case 'Ready To Ship':  backgroundColor = '#4C89F5'; // blue
            break;
        case 'Cancelled':
        case 'Unpaid': backgroundColor = '#FF4D4D'; // red
            break;
        case 'Paid': 
        case 'Received': backgroundColor = '#00AD4C'; // green
            break;
        case 'Failed Delivery': backgroundColor = '#EEB868'; // yellow
            break;
    }
    return <Box style={{ borderRadius: '50%', width: 12, height: 12, marginRight: 10, backgroundColor }} />
}

export default ColoredTagRenderer;