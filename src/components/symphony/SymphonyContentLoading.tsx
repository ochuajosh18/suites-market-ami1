import React from 'react';
import { SymphonyContentLoadingContainer } from './SymphonyCommonComponents';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SYMPHONY_PRIMARY_COLOR } from './Colors';

const SymphonyContentLoading = ({ overrideHeight }: { overrideHeight?: string }) => (
    <SymphonyContentLoadingContainer height={overrideHeight ?? ''}>
        <CircularProgress style={{ color: SYMPHONY_PRIMARY_COLOR }} />
    </SymphonyContentLoadingContainer>
)

export default SymphonyContentLoading;