import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../../store';
import { SystemState } from '../../../../store/system/types';
import { DynamicBasicReportType, ReportState } from '../../../../store/salesreport/types';
import { 
    getTotalCallsSummary, getTopSellingProducts, setReportState, 
    getSalespersonCallVisitSummary, getTotalSales,
    initialSummaryReports
} from '../../../../store/salesreport/actions';

import TotalSalesSummaryReport from './TotalSalesSummaryReport';
import TopSellingProductsReport from './TopSellingProductsReport';
import CallVisitSummaryReport from './CallVisitSummaryReport';
import SalespersonCallVisitSummaryReport from './SalespersonCallVisitSummaryReport';

import { 
    SummaryReportContainer
} from './ReportComponents';

interface SummaryReportProps {
    setReportState: typeof setReportState;
    getTotalSales: typeof getTotalSales;
    getTotalCallsSummary: typeof getTotalCallsSummary;
    getTopSellingProducts: typeof getTopSellingProducts;
    getSalespersonCallVisitSummary: typeof getSalespersonCallVisitSummary;
    initialSummaryReports: typeof initialSummaryReports;
    report: ReportState;
    system: SystemState;
}

class SummaryReport extends React.Component<SummaryReportProps> {
    
    componentDidMount = () => {
        this.props.initialSummaryReports();
    }

    _onSummaryReportInput = (field: string, value: DynamicBasicReportType) => {
        this.props.setReportState({ [field]: value });
        const { totalSalesYear, totalSalesMonthFrom, totalSalesMonthTo } = this.props.report;
        switch (field) {
            case 'callVisitMonth': this.props.getTotalCallsSummary(value as string);
                break;
            case 'topSellingProductsMonth': this.props.getTopSellingProducts(value as string);
                break;
            case 'salespersonCallVisitMonth': this.props.getSalespersonCallVisitSummary(value as string);
                break;
            case 'totalSalesMonthFrom':
                this.props.getTotalSales(totalSalesYear, value as string, totalSalesMonthTo);
                break;
            case 'totalSalesMonthTo':
                this.props.getTotalSales(totalSalesYear, totalSalesMonthFrom, value as string);
                break
            case 'totalSalesYear':
                this.props.getTotalSales(value as string, totalSalesMonthFrom, totalSalesMonthTo);
                break;
        }
    }

    render() {
        const { 
            totalSalesData, totalSalesMonthFrom, totalSalesLoading, totalSalesMonthTo, totalSalesYear,
            callVisitData, callVisitMonth, callVisitSummaryLoading, 
            topSellingProductsLoading, topSellingProductsMonth, topSellingProductsData,
            salespersonCallVisitData, salespersonCallVisitLoading, salespersonCallVisitMonth
        } = this.props.report;
        
        return(
            <SummaryReportContainer>
                <TotalSalesSummaryReport
                    loading={totalSalesLoading}
                    data={totalSalesData}
                    monthFrom={totalSalesMonthFrom}
                    monthTo={totalSalesMonthTo}
                    year={totalSalesYear}
                    onReportInput={this._onSummaryReportInput}
                />
                <CallVisitSummaryReport 
                    month={callVisitMonth}
                    data={callVisitData}
                    loading={callVisitSummaryLoading}
                    onMonthChange={(month: string) => this._onSummaryReportInput('callVisitMonth', month)}
                />
                <TopSellingProductsReport 
                    month={topSellingProductsMonth}
                    data={topSellingProductsData}
                    loading={topSellingProductsLoading}
                    onMonthChange={(month: string) => this._onSummaryReportInput('topSellingProductsMonth', month)}
                />
                <SalespersonCallVisitSummaryReport
                    month={salespersonCallVisitMonth}
                    data={salespersonCallVisitData}
                    loading={salespersonCallVisitLoading}
                    onMonthChange={(month: string) => this._onSummaryReportInput('salespersonCallVisitMonth', month)}
                />
            </SummaryReportContainer>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    report: state.salesreport,
    system: state.system
});

export default connect(mapStateToProps, {
    setReportState,
    getTotalCallsSummary,
    getTopSellingProducts,
    getSalespersonCallVisitSummary,
    getTotalSales,
    initialSummaryReports
})(SummaryReport);