import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { TopSellingProductsData } from '../../../../store/salesreport/types';

import { DecoratedPopoverButton } from '../../../symphony/SymphonyCommonComponents';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

import { 
    SummaryReportChartContainer
} from './ReportComponents';

import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import moment from 'moment';
import map from 'lodash/map';

interface TopSellingProductsReportProps {
    data?: TopSellingProductsData;
    loading: boolean;
    month: string;
    onMonthChange: (month: string) => void;
}

const DOUGHNUT_COLORS = [
    'rgb(76, 137, 245)',
    'rgb(239, 119, 122)',
    'rgb(73, 190, 169)',
    'rgb(238, 184, 104)',
    'rgb(74, 220, 177)'
];

const TopSellingProductsReport = (props: TopSellingProductsReportProps) => {
    const { data, loading, month, onMonthChange } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [shallAnimate, setShallAnimate] = React.useState<boolean | undefined>(undefined);
    const open = Boolean(anchorEl);
    const id = open ? 'aux-popover' : undefined;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        if (data) {
            setTimeout(() => {
                setShallAnimate(false);
            }, 750);
        }
    }, [data])
    

    return (
        <SummaryReportChartContainer width="calc(50% - 8px)!important" id="top-selling-products-report-container">
            <Box display="flex" width="100%" justifyContent="space-between" alignItems="flex-start">
                <Box display="flex" flexDirection="column">
                    <Box fontWeight="bold" fontSize="13px">Top Selling Products</Box>
                    <Box fontSize="12px" marginTop="4px" color="#969696">Based on QTY Sold</Box>
                </Box>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 12 }}>
                    <Button 
                        className="report-aux-button" 
                        onClick={handleClick} 
                        endIcon={<KeyboardArrowDownIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />}
                        style={{ padding: 0, color: SYMPHONY_PRIMARY_COLOR, position: 'absolute', right: -10,  textTransform: 'none' }}
                    >
                        {month ? moment(month, 'MM').format('MMMM') : moment().format('MMMM')}
                    </Button>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        PaperProps={{ style: { display: 'flex', flexDirection: 'column'  }}}
                    >
                        {map(moment.months(), (m) => (
                            <DecoratedPopoverButton
                                key={`${m}-topsellingproducts`}
                                title={m}
                                onClick={() => {
                                    onMonthChange(moment(m, 'MMMM').format('MM'));
                                    handleClose();
                                    setShallAnimate(undefined);
                                }}
                                style={{ color: SYMPHONY_PRIMARY_COLOR, fontWeight: 'normal', padding: 8 } }
                            >
                                {m}
                            </DecoratedPopoverButton>
                        ))}
                    </Popover>
                </div>  
            </Box>
            
                {loading &&
                    <Box position="absolute" top="0" right="0" left="0" bottom="0" display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress style={{ color: SYMPHONY_PRIMARY_COLOR }} />
                    </Box>
                }
                {data && data.products.length === 0 && !loading &&
                    <Box position="absolute" top="0" right="0" left="0" bottom="0" display="flex" justifyContent="center" alignItems="center" style={{ pointerEvents: 'none' }}>
                        <Box fontSize="32px" fontWeight="bold" color="#969696">No Data</Box>
                    </Box>
                }
                {data && !loading &&
                    <Box display="flex" width="100%" height="100%" justifyContent="space-around" alignItems="center">
                        <Box width="200px" position="relative">
                            <Doughnut
                                key="callvisit-chart"
                                options={{
                                    cutout: '75%',
                                    plugins: {
                                        legend: {
                                            display: false
                                        }
                                    },
                                    animation: shallAnimate
                                }}
                                type=""
                                data={{
                                    labels: map(data.products, (p) => p.name),
                                    datasets: [{
                                        data: map(data.products, (p) => p.qty),
                                        backgroundColor: DOUGHNUT_COLORS,
                                        hoverOffset: 4
                                    }]
                                }}
                            />
                            {data.products.length > 0 &&
                                <Box position="absolute" style={{ pointerEvents: 'none' }} top="0" right="0" bottom="0" left="0" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                                    <Box fontSize="12px" color="#969696" marginBottom="4px">Total Sold</Box>
                                    <Box fontWeight="bold">{data.total.toLocaleString()}</Box>
                                </Box>
                            }
                        </Box>
                        <Box display="flex" alignItems="center" flexDirection="column" minWidth="120px">
                            {map(data.products, (pr, i) => (
                                <Box display="flex" marginBottom="16px" width="100%" justifyContent="space-between" alignItems="center" maxWidth="250px" >
                                    <Box width="8px" height="8px" marginTop="2px" marginRight="8px" bgcolor={DOUGHNUT_COLORS[i]} borderRadius="100%" />
                                    <Box display="flex" width="100%" justifyContent="space-between">
                                        <Box fontSize="12px"color="#AFAFAF" marginRight="8px">{pr.name}</Box>
                                        <Box fontSize="12px" minWidth="100px">{pr.qty.toString()} ({pr.percentage.toString()}%)</Box>
                                    </Box>
                                </Box>
                            ))}
                            {/* <Box display="flex">
                                <Box width="8px" height="8px" marginTop="2px" marginRight="4px" bgcolor="rgb(76, 137, 245)" borderRadius="100%" />
                                <Box display="flex" flexDirection="column">
                                    <Box fontSize="10px" color="#AFAFAF">Completed Call</Box>
                                    <Box fontSize="10px">{data.complete.toString()}({data.completePercentage.toString()}%)</Box>
                                </Box>
                            </Box>
                            <Box display="flex">
                                <Box width="8px" height="8px" marginTop="2px" marginRight="4px" bgcolor="rgb(225, 231, 239)" borderRadius="100%" />
                                <Box display="flex" flexDirection="column">
                                    <Box fontSize="10px" color="#AFAFAF">Incomplete Call</Box>
                                    <Box fontSize="10px">{data.incomplete.toString()} ({data.incompletePercentage.toString()}%)</Box>
                                </Box>
                            </Box> */}
                        </Box>
                    </Box>
                }
        </SummaryReportChartContainer>
    )
}

export default TopSellingProductsReport;