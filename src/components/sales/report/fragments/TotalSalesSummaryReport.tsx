import React from 'react';
import { Line } from 'react-chartjs-2';
import { TotalSalesData } from '../../../../store/salesreport/types';

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
import RemoveIcon from '@material-ui/icons/Remove';
import moment from 'moment';
import map from 'lodash/map';
import filter from 'lodash/filter';

interface TotalSalesSummaryReportProps {
    data?: TotalSalesData;
    loading: boolean;
    monthFrom: string;
    monthTo: string;
    year: string;
    onReportInput: (field: string, value: string) => void;
}

const TotalSalesSummaryReport = (props: TotalSalesSummaryReportProps) => {
    const { data, loading, monthFrom, monthTo, year, onReportInput } = props;
    const [yearAnchorEl, setYearAnchorEl] = React.useState(null);
    const [monthFromAnchorEl, setMonthFromAnchorEl] = React.useState(null);
    const [monthToAnchorEl, setMonthToAnchorEl] = React.useState(null);
    const [shallAnimate, setShallAnimate] = React.useState<boolean | undefined>(undefined);
    const allMonths = moment.months();
    const handleClose = () => {
        setYearAnchorEl(null);
        setMonthFromAnchorEl(null);
        setMonthToAnchorEl(null);
    };

    React.useEffect(() => {
        if (data) {
            setTimeout(() => {
                setShallAnimate(false);
            }, 750);
        }
    }, [data])

    return (
        <SummaryReportChartContainer width="calc(75% - 8px)!important" id="total-sales-report-container">
            <Box display="flex" width="100%" justifyContent="space-between" alignItems="flex-start" marginBottom="16px">
                <Box display="flex" flexDirection="column">
                    <Box fontWeight="bold" fontSize="13px">Total Sales</Box>
                    {data && data.monthlySales.length > 0 && !loading &&
                        <Box display="flex" marginTop="8px" alignItems="center">
                            <Box color="#4C89F5">₱ {data.totalSales}</Box>
                            <Box marginLeft="12px" fontSize="13px" color={data.difference > 0 ? '#EEB868' : '#FF3333'}>{data.difference} ({data.differencePercentage}%)</Box>
                        </Box>
                    }
                </Box>
                <Box display="flex" position="relative" height="14px" alignItems="center">
                    <Box style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 12 }}>
                        <Button 
                            className="report-aux-button" 
                            onClick={(e: React.MouseEvent<any>) => {
                                setYearAnchorEl(e.currentTarget);
                            }} 
                            endIcon={<KeyboardArrowDownIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />}
                            style={{ padding: 0, color: SYMPHONY_PRIMARY_COLOR, marginRight: 16, textTransform: 'none' }}
                        >
                            {year ? year : moment().format('YYYY')}
                        </Button>
                        <Popover
                            id={Boolean(yearAnchorEl) ? 'year-anchor' : undefined}
                            open={Boolean(yearAnchorEl)}
                            anchorEl={yearAnchorEl}
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
                            {map([
                                moment().subtract(2, 'year').format('YYYY'), 
                                moment().subtract(1, 'year').format('YYYY'), 
                                moment().format('YYYY')
                            ], (y) => (
                                <DecoratedPopoverButton
                                    key={`${y}-totalsales-year`}
                                    title={y}
                                    onClick={() => {
                                        onReportInput('totalSalesYear', y);
                                        handleClose();
                                        setShallAnimate(undefined);
                                    }}
                                    style={{ color: SYMPHONY_PRIMARY_COLOR, fontWeight: 'normal', padding: 8 } }
                                >
                                    {y}
                                </DecoratedPopoverButton>
                            ))}
                        </Popover>
                        <Button 
                            className="report-aux-button" 
                            onClick={(e: React.MouseEvent<any>) => {
                                setMonthFromAnchorEl(e.currentTarget);
                            }}
                            endIcon={<KeyboardArrowDownIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />}
                            style={{ padding: 0, color: SYMPHONY_PRIMARY_COLOR, marginRight: 16, textTransform: 'none' }}
                        >
                            {monthFrom ? moment(monthFrom, 'MM').format('MMMM') : moment('01', 'MM').format('MMMM')}
                        </Button>
                        <Popover
                            id={Boolean(monthFromAnchorEl) ? 'monthfrom-anchor' : undefined}
                            open={Boolean(monthFromAnchorEl)}
                            anchorEl={monthFromAnchorEl}
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
                            {map(monthTo ? filter(allMonths, (cm) => moment(cm, 'MMMM').isSameOrBefore(moment(monthTo, 'MM'))) : allMonths, (m) => (
                                <DecoratedPopoverButton
                                    key={`${m}-totalsales-from`}
                                    title={m}
                                    onClick={() => {
                                        onReportInput('totalSalesMonthFrom', moment(m, 'MMMM').format('MM'));
                                        handleClose();
                                        setShallAnimate(undefined);
                                    }}
                                    style={{ color: SYMPHONY_PRIMARY_COLOR, fontWeight: 'normal', padding: 8 } }
                                >
                                    {m}
                                </DecoratedPopoverButton>
                            ))}
                        </Popover>

                        <Box fontSize="12px" marginRight="16px">
                            <RemoveIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />
                        </Box>
                        <Button 
                            className="report-aux-button" 
                            onClick={(e: React.MouseEvent<any>) => {
                                setMonthToAnchorEl(e.currentTarget);
                            }}
                            endIcon={<KeyboardArrowDownIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />}
                            style={{ padding: 0, color: SYMPHONY_PRIMARY_COLOR, textTransform: 'none' }}
                        >
                            {monthTo ? moment(monthTo, 'MM').format('MMMM') : moment('12', 'MM').format('MMMM')}
                        </Button>
                        <Popover
                            id={Boolean(monthToAnchorEl) ? 'monthto-anchor' : undefined}
                            open={Boolean(monthToAnchorEl)}
                            anchorEl={monthToAnchorEl}
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
                            {map(monthFrom ? filter(allMonths, (cm) => moment(cm, 'MMMM').isSameOrAfter(moment(monthFrom, 'MM'))) : allMonths, (m) => (
                                <DecoratedPopoverButton
                                    key={`${m}-totalsales-to`}
                                    title={m}
                                    onClick={() => {
                                        onReportInput('totalSalesMonthTo', moment(m, 'MMMM').format('MM'));
                                        handleClose();
                                        setShallAnimate(undefined);
                                    }}
                                    style={{ color: SYMPHONY_PRIMARY_COLOR, fontWeight: 'normal', padding: 8 } }
                                >
                                    {m}
                                </DecoratedPopoverButton>
                            ))}
                        </Popover>
                    </Box>  
                </Box>
            </Box>
                {loading &&
                    <Box position="absolute" top="0" right="0" left="0" bottom="0" display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress style={{ color: SYMPHONY_PRIMARY_COLOR }} />
                    </Box>
                }
                {data && data.monthlySales.length === 0 && !loading &&
                    <Box position="absolute" top="0" right="0" left="0" bottom="0" display="flex" justifyContent="center" alignItems="center" style={{ pointerEvents: 'none' }}>
                        <Box fontSize="32px" fontWeight="bold" color="#969696">No Data</Box>
                    </Box>
                }
                {data && data.monthlySales.length > 0 && !loading &&
                    <Box display="flex" width="100%" height="100%" justifyContent="space-around" alignItems="center">
                        <Box width="100%" height="240px" position="relative">
                            <Line
                                key="total-sales-chart"
                                options={{
                                    plugins: {
                                        legend: {
                                            display: false
                                        }
                                    },
                                    animation: shallAnimate,
                                    maintainAspectRatio: false,
                                    scales: {
                                        x: {
                                            grid: {
                                                display: false,
                                            }
                                        },
                                        y: {
                                            ticks: {
                                                maxTicksLimit: 6
                                            }
                                        }
                                    },
                                    elements: {
                                        line: {
                                            borderColor: '#4C89F5',
                                            borderWidth: 1.5
                                        },
                                        point: {
                                            borderColor: '#4C89F5',
                                            backgroundColor: '#4C89F5'
                                        }
                                    }
                                }}
                                type=""
                                data={{
                                    labels: map(data.monthlySales, (m) => moment(m.month, 'MM').format('MMM')),
                                    datasets: [{
                                        data: map(data.monthlySales, (m) => m.total),
                                        hoverOffset: 4,
                                    }]
                                }}
                            />
                        </Box>
                        {/* <Box display="flex" alignItems="center" flexDirection="column" minWidth="120px">
                            {map(data.products, (pr, i) => (
                                <Box display="flex" marginBottom="16px" width="100%" justifyContent="space-between" alignItems="center" maxWidth="250px" >
                                    <Box width="8px" height="8px" marginTop="2px" marginRight="8px" bgcolor={DOUGHNUT_COLORS[i]} borderRadius="100%" />
                                    <Box display="flex" width="100%" justifyContent="space-between">
                                        <Box fontSize="12px"color="#AFAFAF" marginRight="8px">{pr.name}</Box>
                                        <Box fontSize="12px" minWidth="100px">{pr.qty.toString()} ({pr.percentage.toString()}%)</Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box> */}
                    </Box>
                }
        </SummaryReportChartContainer>
    )
}

export default TotalSalesSummaryReport;