import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { ReportState, ReportTab } from '../../../store/salesreport/types';
import { setReportState, loadSalespersonList, generateReport, initialSummaryReports } from '../../../store/salesreport/actions';
import { setSystemState } from '../../../store/system/actions';

import SummaryReport from './fragments/SummaryReport';
import ReportRenderer from './fragments/ReportRenderer';
import { ReportBaseContainer, ReportHeaderButton } from './fragments/ReportComponents';

import { 
    SymphonyTabs,
    SymphonyTab,
    SymphonyTabsContainer
} from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';

import Icon from '@material-ui/core/Icon';
import { toastWarning } from '../../../modules/Toast';
import { CSVLink } from 'react-csv';

import Box from '@material-ui/core/Box';

interface ReportProps {
    setReportState: typeof setReportState;
    setSystemState: typeof setSystemState;
    loadSalespersonList: typeof loadSalespersonList;
    generateReport: typeof generateReport;
    initialSummaryReports: typeof initialSummaryReports;
    salesreport: ReportState;
}

class Report extends React.Component<ReportProps> {
    csvRef;

    constructor(props) {
        super(props);
        this.csvRef = React.createRef<typeof CSVLink>();
    }
    
    componentDidMount = () => {
        this.props.loadSalespersonList()
        // set button
        this.props.setSystemState({
            headerEndButton: () => (
                <Box display="flex">
                    <ReportHeaderButton 
                        endIcon={<Icon className="fas fa-undo" style={{ transform: 'rotate(-45deg)' }} />}
                        onClick={this._onResetClick.bind(this)}
                    >
                        Reset
                    </ReportHeaderButton>
                    <ReportHeaderButton 
                        endIcon={<Icon className="fas fa-file-export" />}
                        onClick={this._onExportClick.bind(this)}
                    >
                        Export
                    </ReportHeaderButton>
                </Box>
            )
        })
    }

    componentWillUnmount = () => {
        this.props.setSystemState({ headerEndButton: undefined })
    }

    _onTabClick = (value: ReportTab) => {
        this.props.setReportState({ activeTab: value, reportType: '', reportSalesperson: '', reportDateStart: '', reportDateEnd: '' });
    }

    _onReportInput = (field: string, value: string) => {
        this.props.setReportState({ [field]: value, reportData: [] })
    }

    _onViewClick = () => {
        const { reportType, reportSalesperson, reportDateStart } = this.props.salesreport;
        if (!reportType) { toastWarning("Please select a report type"); return; }
        if (!reportSalesperson) { toastWarning("Please select a salesperson"); return; }
        if (!reportDateStart) { toastWarning("Please indicate the start date"); return; }
        this.props.generateReport()
    }

    _onResetClick = () => {
        this.props.setReportState({ 
            reportData: [],
            reportType: '', 
            reportSalesperson: '', 
            reportDateStart: '', 
            reportDateEnd: '',
            totalSalesMonthFrom: '',
            totalSalesMonthTo: '',
            totalSalesYear: '',
            salespersonCallVisitMonth: '',
            topSellingProductsMonth: '',
            callVisitMonth: '',
            callVisitData: undefined,
            totalSalesData: undefined,
            salespersonCallVisitData: undefined,
            topSellingProductsData: undefined
        });
        this.props.initialSummaryReports();
    }

    _onExportClick = () => {
        const { reportData } = this.props.salesreport;
        if (reportData.length > 0) {
            if (this.csvRef.current) {
                this.csvRef.current.link.click()
            }
        }
        else {
            toastWarning("Please generate data before exporting ")
        }
    }

    render = () => {
        const { activeTab, reportDateStart, reportDateEnd, reportSalesperson, reportType, reportSalespersonList, reportData, reportLoading } = this.props.salesreport;
        return (
            <SymphonyLayout>
                <ReportBaseContainer style={{ backgroundColor: 'transparent'}}>
                    <SymphonyTabsContainer>
                        <SymphonyTabs
                            value={activeTab}
                            // style={{ padding: '20px 12px 0', backgroundColor: '#F4F6F9' }}
                            TabIndicatorProps={{ style: { height: 3, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                        >
                            <SymphonyTab
                                label="Summary Report"
                                value="SUMMARY"
                                onClick={this._onTabClick.bind(this, 'SUMMARY')}
                            />
                            <SymphonyTab
                                label="Transaction Report"
                                value="TRANSACTION"
                                onClick={this._onTabClick.bind(this, 'TRANSACTION')}
                            /> 
                        </SymphonyTabs>
                    </SymphonyTabsContainer>
                    {activeTab === 'TRANSACTION' &&
                        <ReportRenderer  
                            dateStart={reportDateStart}
                            dateEnd={reportDateEnd}
                            salesperson={reportSalesperson}
                            type={reportType}
                            salespersonList={reportSalespersonList}
                            onReportInput={this._onReportInput.bind(this)}
                            activeTab={activeTab}
                            data={reportData}
                            onViewClick={this._onViewClick.bind(this)}
                            loading={reportLoading}
                            csvRef={this.csvRef}
                        />
                    }
                    {activeTab === 'SUMMARY' &&
                        <SummaryReport />
                    }
                </ReportBaseContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    salesreport: state.salesreport
});

export default connect(mapStateToProps, {
    setReportState,
    setSystemState,
    loadSalespersonList,
    generateReport,
    initialSummaryReports
})(Report)