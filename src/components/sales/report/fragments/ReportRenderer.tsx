import React from 'react';
import { ReportTab } from '../../../../store/salesreport/types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { 
    ReportContainer,
    ReportTableContainer,
    ReportTableLoadingContainer,
} from './ReportComponents';
import ReportInputs from './ReportInputs';
import moment from 'moment';
import map from 'lodash/map';
import ReportTable from './ReportTable';
import { CSVLink } from 'react-csv';

interface TransactionReportProps {
    type: string;
    salesperson: string;
    dateStart: string;
    dateEnd: string;
    salespersonList: Array<{ label: string, value: string }>;
    onReportInput: (field: string, value: string) => void;
    onViewClick: () => void;
    activeTab: ReportTab;
    data: Array<unknown>;
    loading: boolean;
    csvRef: React.Ref<CSVLink>;
}

const cellStyle = { textAlign: 'center', wordBreak: 'break-all', fontSize: 12 };
const headerStyle  = { textAlign: 'center' };
const TABLE_COLUMNS = {
    SUMMARY_CALL_VISIT_MEETING: [
        { title: 'Salesperson ID', field: 'salespersonId', cellStyle, headerStyle },
        { title: 'Salesperson Name', field: 'salespersonName', cellStyle, headerStyle },
        { title: 'Incomplete Call Visit', field: 'incompletCallVisit', cellStyle, headerStyle },
        { title: 'Call Visit Completed', field: 'completedCallVisit', cellStyle, headerStyle },
        { title: 'Call Visit Made', field: 'totalCallVisit', cellStyle, headerStyle },
        { title: 'TFO Made in Call Visit', field: 'totalTfo', cellStyle, headerStyle },
        { title: 'TFO Value in Call Visit', field: 'totalPrice', cellStyle, headerStyle },
    ],
    SUMMARY_CALL_VISIT_PROFILING: [
        { title: 'Salesperson ID', field: 'salespersonId', cellStyle, headerStyle },
        { title: 'Salesperson Name', field: 'salespersonName', cellStyle, headerStyle },
        { title: 'Incomplete Call Visit', field: 'incompletCallVisit', cellStyle, headerStyle },
        { title: 'Call Visit Completed', field: 'completedCallVisit', cellStyle, headerStyle },
        { title: 'Call Visit Made', field: 'totalCallVisit', cellStyle, headerStyle },
    ],
    SUMMARY_CUSTOMER: [
        { title: 'Salesperson ID', field: 'salespersonId', cellStyle, headerStyle },
        { title: 'Salesperson Name', field: 'salespersonName', cellStyle, headerStyle },
        { title: 'Total Customers', field: 'totalCustomer', cellStyle, headerStyle },
        { title: 'Total SKU Sold', field: 'skuSold', cellStyle, headerStyle },
        { title: 'Total TFO Count', field: 'tfoCount', cellStyle, headerStyle },
        { title: 'Total TFO Revenue', field: 'revenue', cellStyle, headerStyle },
    ],
    TRANSACTION_CALL_VISIT_MEETING: [
        { title: 'Call Visit Meeting ID', field: 'callVisitMeetingId', cellStyle, headerStyle },
        { title: 'Salesperson ID', field: 'salespersonId', cellStyle, headerStyle },
        { title: 'Salesperson Name', field: 'salespersonName', cellStyle, headerStyle },
        { title: 'Customer ID', field: 'customerId', cellStyle, headerStyle },
        { title: 'Customer Name', field: 'customerName', cellStyle, headerStyle },
        { title: 'Start Call Date', field: 'startDate', cellStyle, headerStyle },
        { title: 'End Call Date', field: 'endDate', cellStyle, headerStyle },
        { title: 'Start Time of Call', field: 'startTime', cellStyle, headerStyle },
        { title: 'End Time of Call', field: 'endTime', cellStyle, headerStyle },
        { title: 'Call Length', field: 'callLength', cellStyle, headerStyle },
    ],
    TRANSACTION_CALL_VISIT_PROFILING: [
        { title: 'Call Visit Profiling ID', field: 'callVisitProfilingId', cellStyle, headerStyle },
        { title: 'Salesperson ID', field: 'salespersonId', cellStyle, headerStyle },
        { title: 'Salesperson Name', field: 'salespersonName', cellStyle, headerStyle },
        { title: 'Customer ID', field: 'customerId', cellStyle, headerStyle },
        { title: 'Customer Name', field: 'customerName', cellStyle, headerStyle },
        { title: 'Start Call Date', field: 'startDate', cellStyle, headerStyle },
        { title: 'End Call Date', field: 'endDate', cellStyle, headerStyle },
        { title: 'Start Time of Call', field: 'startTime', cellStyle, headerStyle },
        { title: 'End Time of Call', field: 'endTime', cellStyle, headerStyle },
        { title: 'Call Length', field: 'callLength', cellStyle, headerStyle },
    ],
    TRANSACTION_TFO: [
        { title: 'TFO ID', field: 'id', cellStyle, headerStyle },
        { title: 'Customer ID', field: 'customerDisplayId', cellStyle, headerStyle },
        { title: 'Customer Name', field: 'customerName', cellStyle, headerStyle },
        { title: 'Salesperson ID', field: 'salespersonId', cellStyle, headerStyle },
        { title: 'Salesperson Name', field: 'salespersonName', cellStyle, headerStyle },
        { title: 'Call Record ID', field: 'callRecordId', cellStyle, headerStyle },
        { title: 'Product Number', field: 'skuNumber', cellStyle, headerStyle },
        { title: 'Product Name', field: 'name', cellStyle, headerStyle },
        { title: 'Size', field: 'size', cellStyle, headerStyle },
        { title: 'Quantity Ordered', field: 'qty', cellStyle, headerStyle },
        { title: 'Total Price', field: 'totalPrice', cellStyle, headerStyle },
        { title: 'Date Created', field: 'dateCreated', cellStyle, headerStyle },
        { title: 'Time Created', field: 'timeCreated', cellStyle, headerStyle },
    ],
}

export default (props: TransactionReportProps) => {
    const dataSourceKey = `${props.activeTab}_${props.type}`;
    return (
        <ReportContainer>
            <ReportInputs 
                type={props.type}
                salesperson={props.salesperson}
                dateStart={props.dateStart}
                dateEnd={props.dateEnd}
                salespersonList={props.salespersonList}
                onReportInput={props.onReportInput}
                activeTab={props.activeTab}
                onViewClick={props.onViewClick}
            />
            <ReportTableContainer>
                <ReportTable
                    columns={TABLE_COLUMNS[dataSourceKey]}
                    data={typeof TABLE_COLUMNS[dataSourceKey] !== 'undefined' ?map (props.data, (data: any) => ({
                        ...data,
                        startTime: data.startTime ? moment(data.startTime, 'hh:mm:ss').format('hh:mm:ss').slice(0, 8) : '',
                        endTime: data.endTime ? moment(data.endTime, 'hh:mm:ss').format('hh:mm:ss').slice(0, 8) : '',
                        timeCreated: data.timeCreated ? moment(data.timeCreated, 'hh:mm:ss').format('hh:mm:ss').slice(0, 8) : '',
                    })) : []}
                    title="View Table"
                    csvRef={props.csvRef}
                    dataSourceKey={dataSourceKey}
                />
                {props.loading &&
                    <ReportTableLoadingContainer>
                        <CircularProgress size={48} />
                    </ReportTableLoadingContainer>
                }
            </ReportTableContainer>
        </ReportContainer>
    )
}