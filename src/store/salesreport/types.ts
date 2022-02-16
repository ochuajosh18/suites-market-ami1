export type DynamicBasicReportType = 
string | 
boolean |
Array<ReportValuePair> |
Array<unknown> |
CallVisitData |
TopSellingProductsData |
Array<SalespersonCallVisitData> |
TotalSalesData |
undefined;
export type ReportValuePair = { label: string, value: string };
export type ReportTab = 'SUMMARY' | 'TRANSACTION';

// summary report types
export interface CallVisitData {
    complete: number;
    completePercentage: number;
    incomplete: number;
    incompletePercentage: number;
    total: number;
}

export interface TopSellingProductsData {
    products: Array<{ name: string; qty: number; percentage: number }>;
    total: number;
}

export interface TotalSalesData {
    totalSales: number;
    difference: number;
    differencePercentage: number;
    monthlySales: Array<{ month: string; total: number; }>;
}

export interface SalespersonCallVisitData {
    count: number;
    salespersonName: string;
}

export interface BasicReportType<T> {
    [key: string]: T;
}

export interface BasicReportStateInput {
    [name: string]: DynamicBasicReportType
}

export interface ReportState extends BasicReportType<DynamicBasicReportType> {
    activeTab: ReportTab;
    reportDateStart: string;
    reportDateEnd: string;
    reportType: string;
    reportSalesperson: string;
    reportSalespersonList: Array<ReportValuePair>;
    reportData: Array<unknown>
    reportLoading: boolean;
    callVisitSummaryLoading: boolean;
    callVisitData?: CallVisitData;
    callVisitMonth: string;
    topSellingProductsLoading: boolean;
    topSellingProductsData?: TopSellingProductsData;
    topSellingProductsMonth: string;
    salespersonCallVisitLoading: boolean;
    salespersonCallVisitData: Array<SalespersonCallVisitData>;
    salespersonCallVisitMonth: string;
    totalSalesLoading: boolean;
    totalSalesData?: TotalSalesData;
    totalSalesMonthFrom: string;
    totalSalesMonthTo: string;
    totalSalesYear: string;
}

export const SET_REPORT_STATE = 'set_report_state';

export interface setReportStateAction {
    type: typeof SET_REPORT_STATE;
    payload: BasicReportStateInput;
}

export type ReportAction = setReportStateAction;
