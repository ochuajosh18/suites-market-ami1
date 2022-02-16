import React from 'react';
import { Bar } from 'react-chartjs-2';
import { SalespersonCallVisitData } from '../../../../store/salesreport/types';

import { 
    SummaryReportChartContainer
} from './ReportComponents';

import { DecoratedPopoverButton } from '../../../symphony/SymphonyCommonComponents';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import moment from 'moment';
import map from 'lodash/map';
import maxBy from 'lodash/maxBy';

interface SalespersonCallVisitSummaryReportProps {
    data?: Array<SalespersonCallVisitData>;
    loading: boolean;
    month: string;
    onMonthChange: (month: string) => void;
}

const SalespersonCallVisitSummaryReport = (props: SalespersonCallVisitSummaryReportProps) => {
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
        <SummaryReportChartContainer marginLeft="16px" width="calc(50% - 8px)!important" id="call-visit-per-salesperson-report-container">
            <Box display="flex" width="100%" justifyContent="space-between">
                <Box fontWeight="bold" fontSize="13px">Top 5 - Call Visits Made per Salesperson</Box>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                    <Button 
                        className="report-aux-button" 
                        onClick={handleClick} 
                        endIcon={<KeyboardArrowDownIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />}
                        style={{ padding: 0, color: SYMPHONY_PRIMARY_COLOR, position: 'absolute', right: -10, width: 24, height: 24, textTransform: 'none' }}
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
                                key={`${m}-callvisit`}
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
            <Box display="flex" height="100%" width="100%" paddingTop="16px" boxSizing="border-box" alignItems="center">
                {loading &&
                    <Box position="absolute" top="0" right="0" left="0" bottom="0" display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress style={{ color: SYMPHONY_PRIMARY_COLOR }} />
                    </Box>
                }
                {data && data.length === 0 && !loading &&
                    <Box position="absolute" top="0" right="0" left="0" bottom="0" display="flex" justifyContent="center" alignItems="center" style={{ pointerEvents: 'none' }}>
                        <Box fontSize="32px" fontWeight="bold" color="#969696">No Data</Box>
                    </Box>
                }
                {data && data.length > 0 && !loading &&
                    <>
                        <Bar
                            key="salesperson-callvisit-chart"
                            
                            options={{
                                plugins: {
                                    legend: {
                                        display: false,
                                        labels: {
                                            font: {
                                                size: 5
                                            },
                                        }
                                    },
                                    tooltip: {
                                        filter: (item) => {
                                            return item.datasetIndex !== 1;
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        stacked: true,
                                        suggestedMax: maxBy(data, (d) => d.count)!.count
                                    },
                                    x: {
                                        ticks: {
                                            font: {
                                                size: 10
                                            }
                                        },
                                        stacked: true
                                    }
                                },
                                barThickness: 10,
                                animation: shallAnimate
                            }}
                            type="bar"
                            data={{

                                labels: map(data, (d) => d.salespersonName),
                                datasets: [
                                    {
                                        label: 'Call Visit',
                                        data: map(data, (d) => d.count),
                                        backgroundColor: [
                                            '#4C89F4',
                                            '#EF777A',
                                            '#49BEA9',
                                            '#EEB868',
                                            '#4ADCB1',
                                        ],
                                    },
                                    {  
                                        label: 'd2',
                                        data: map(data, (d) =>{
                                            if ( maxBy(data, (maxData) => maxData.count)!.count - d.count === 0) return 0.01;
                                            return maxBy(data, (maxData) => maxData.count)!.count - d.count;
                                        }),
                                        backgroundColor: [
                                            '#EDEDED',
                                            '#EDEDED',
                                            '#EDEDED',
                                            '#EDEDED',
                                            '#EDEDED',
                                        ]
                                    }
                                ]
                            }}
                        />
                    </>
                }
            </Box>
        </SummaryReportChartContainer>
    )
}

export default SalespersonCallVisitSummaryReport;