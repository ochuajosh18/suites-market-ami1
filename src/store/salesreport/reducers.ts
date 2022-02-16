import {
    SET_REPORT_STATE,
    ReportAction,
    ReportState
} from './types';

const INITIAL_STATE: ReportState = {
    activeTab: 'SUMMARY',
    reportDateStart: '',
    reportDateEnd: '',
    reportSalesperson: '',
    reportType: '',
    reportSalespersonList: [],
    reportData: [],
    reportLoading: false,
    callVisitSummaryLoading: false,
    callVisitMonth: '',
    topSellingProductsLoading: false,
    topSellingProductsMonth: '',
    salespersonCallVisitLoading: false,
    salespersonCallVisitMonth: '',
    salespersonCallVisitData: [],
    totalSalesLoading: false,
    totalSalesMonthFrom: '',
    totalSalesMonthTo: '',
    totalSalesYear: ''
}

export default (state = INITIAL_STATE, action: ReportAction): ReportState => {
    switch (action.type) {
        case SET_REPORT_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}