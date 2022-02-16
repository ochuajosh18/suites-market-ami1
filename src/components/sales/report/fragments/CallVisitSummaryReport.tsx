import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { CallVisitData } from '../../../../store/salesreport/types';

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

interface CallVisitSummaryReportProps {
    data?: CallVisitData;
    loading: boolean;
    month: string;
    onMonthChange: (month: string) => void;
}

const CallVisitSummaryReport = (props: CallVisitSummaryReportProps) => {
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
        <SummaryReportChartContainer marginLeft="16px" width="calc(25% - 8px)!important" id="call-visit-summary-report-container">
            <Box display="flex" width="100%" justifyContent="space-between">
                <Box fontWeight="bold" fontSize="13px">Total Call Visits</Box>
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
            <Box display="flex" height="100%" paddingTop="36px">
                {loading &&
                    <Box position="absolute" top="0" right="0" left="0" bottom="0" display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress style={{ color: SYMPHONY_PRIMARY_COLOR }} />
                    </Box>
                }
                {data && data.total === 0 && !loading &&
                    <Box position="absolute" top="0" right="0" left="0" bottom="0" display="flex" justifyContent="center" alignItems="center" style={{ pointerEvents: 'none' }}>
                        <Box fontSize="32px" fontWeight="bold" color="#969696">No Data</Box>
                    </Box>
                }
                {data && !loading &&
                    <>
                        <Doughnut
                            key="callvisit-chart"
                            width={175}
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
                                labels: [`Complete Call`, `Incomplete Call`],
                                datasets: [{
                                    data: [data.complete, data.incomplete],
                                    backgroundColor: [
                                        'rgb(76, 137, 245)',
                                        'rgb(225, 231, 239)'
                                    ],
                                    hoverOffset: 4
                                }]
                            }}
                        />
                        {data && data.total !== 0 &&
                            <Box position="absolute" bottom="16px" right="8px" left="8px" display="flex" justifyContent="space-around" alignItems="center">
                                <Box display="flex">
                                    <Box width="8px" height="8px" marginTop="2px" marginRight="8px" bgcolor="rgb(76, 137, 245)" borderRadius="100%" />
                                    <Box display="flex" flexDirection="column">
                                        <Box fontSize="10px" color="#AFAFAF">Completed Call</Box>
                                        <Box fontSize="10px">{data.complete.toString()}({data.completePercentage.toString()}%)</Box>
                                    </Box>
                                </Box>
                                <Box display="flex">
                                    <Box width="8px" height="8px" marginTop="2px" marginRight="8px" bgcolor="rgb(225, 231, 239)" borderRadius="100%" />
                                    <Box display="flex" flexDirection="column">
                                        <Box fontSize="10px" color="#AFAFAF">Incomplete Call</Box>
                                        <Box fontSize="10px">{data.incomplete.toString()} ({data.incompletePercentage.toString()}%)</Box>
                                    </Box>
                                </Box>
                            </Box>
                        }
                    </>
                }
            </Box>
        </SummaryReportChartContainer>
    )
}

export default CallVisitSummaryReport;