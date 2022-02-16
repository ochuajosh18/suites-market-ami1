import {
    SET_REPORT_STATE,
    BasicReportStateInput,
    ReportAction
} from './types';
import { AppThunk } from '..';
import axios from 'axios';
import map from 'lodash/map';
import moment from 'moment';
const API_URL = process.env.REACT_APP_API_URL;

export const setReportState = (input: BasicReportStateInput): ReportAction => ({
    type: SET_REPORT_STATE,
    payload: input
});


export const loadSalespersonList = (): AppThunk =>  {
    return async (dispatch) => {
        try {
            const res = await axios.get( `${API_URL}/user/salesperson`);
            if (res.data) {
                dispatch({
                    type: SET_REPORT_STATE,
                    payload: { 
                        reportSalespersonList: map(res.data, (salesperson) => ({
                            label: `${salesperson.displayId} - ${salesperson.firstName} ${salesperson.lastName}`,
                            value: salesperson.id
                        }))
                    }
                })
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {

        }
    }
}

export const generateReport = (): AppThunk => {
    return async (dispatch, getState) => {
        const { activeTab, reportType,  reportSalesperson, reportDateStart, reportDateEnd } = getState().salesreport;
        dispatch({
            type: SET_REPORT_STATE,
            payload: { reportLoading: true, reportData: [] }
        });
        const TYPES = {
            CALL_VISIT_MEETING: 'meeting',
            CALL_VISIT_PROFILING: 'customer-profiling',
            TFO: 'tfo',
            CUSTOMER: 'customer'
        }
        try {
            const queryParamObj = {
                salespersonId: reportSalesperson !== 'All' ? reportSalesperson : '',
                startDate: reportDateStart ? moment(reportDateStart, 'DD/MM/YYYY').format("YYYY-MM-DD") : '',
                endDate: reportDateEnd ? moment(reportDateEnd, 'DD/MM/YYYY').format("YYYY-MM-DD") : ''
            }
            let queryParams = '?';
            for (const key of Object.keys(queryParamObj)) {
                queryParams = queryParamObj[key] ? queryParams + `${key}=${queryParamObj[key]}&` : queryParams
            }
            const res = await axios.get( `${API_URL}/report/${activeTab.toLowerCase()}/${TYPES[reportType]}${queryParams}`);
            if (res.data) {
                dispatch({
                    type: SET_REPORT_STATE,
                    payload: { 
                        reportData: res.data
                    }
                })
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            dispatch({
                type: SET_REPORT_STATE,
                payload: { reportLoading: false }
            });
        }
    }
}

export const getTotalCallsSummary = (month = moment().format('MM')): AppThunk => async (dispatch) => {
    dispatch({
        type: SET_REPORT_STATE,
        payload: { callVisitSummaryLoading: true }
    });
    
    try {
        const repRes = await axios.get(`${API_URL}/v1/reports/summary/call-visit?month=${month}`);
        if (repRes.status === 200) {
            dispatch({
                type: SET_REPORT_STATE,
                payload: { callVisitData: repRes.data }
            });
        }
    }
    catch (e) {

    }
    finally {
        dispatch({
            type: SET_REPORT_STATE,
            payload: { callVisitSummaryLoading: false }
        });
    }
}

export const getTopSellingProducts = (month = moment().format('MM')): AppThunk => async (dispatch) => {
    dispatch({
        type: SET_REPORT_STATE,
        payload: { topSellingProductsLoading: true }
    });
    
    try {
        const repRes = await axios.get(`${API_URL}/v1/reports/summary/top-selling-product?month=${month}`);
        if (repRes.status === 200) {
            dispatch({
                type: SET_REPORT_STATE,
                payload: { topSellingProductsData: repRes.data }
            });
        }
    }
    catch (e) {

    }
    finally {
        dispatch({
            type: SET_REPORT_STATE,
            payload: { topSellingProductsLoading: false }
        });
    }
}


export const getSalespersonCallVisitSummary = (month = moment().format('MM')): AppThunk => async (dispatch) => {
    dispatch({
        type: SET_REPORT_STATE,
        payload: { salespersonCallVisitLoading: true }
    });
    
    try {
        const repRes = await axios.get(`${API_URL}/v1/reports/summary/top-salesperson-call-visit?month=${month}`);
        if (repRes.status === 200) {
            dispatch({
                type: SET_REPORT_STATE,
                payload: { salespersonCallVisitData: repRes.data }
            });
        }
    }
    catch (e) {

    }
    finally {
        dispatch({
            type: SET_REPORT_STATE,
            payload: { salespersonCallVisitLoading: false }
        });
    }
}


export const getTotalSales = (year = moment().format('YYYY'), startMonth = '01', endMonth = '12'): AppThunk => async (dispatch) => {
    dispatch({
        type: SET_REPORT_STATE,
        payload: { totalSalesLoading: true }
    });
    
    try {
        const repRes = await axios.get(`${API_URL}/v1/reports/summary/total-sales?year=${year}&startMonth=${startMonth}&endMonth=${endMonth}`);
        if (repRes.status === 200) {
            dispatch({
                type: SET_REPORT_STATE,
                payload: { totalSalesData: repRes.data }
            });
        }
    }
    catch (e) {

    }
    finally {
        dispatch({
            type: SET_REPORT_STATE,
            payload: { totalSalesLoading: false }
        });
    }
}

export const initialSummaryReports = (): AppThunk => async (dispatch) => {
    dispatch(getTotalSales());
    dispatch(getTopSellingProducts());
    dispatch(getSalespersonCallVisitSummary());
    dispatch(getTotalCallsSummary());
}