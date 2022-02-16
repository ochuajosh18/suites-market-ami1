import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';

import {
    Box,
    TextField,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography,
} from '@material-ui/core';

import { AppState } from '../../store';
import { fetchReview, onChangeSearchReview } from '../../store/review/actions'

import SymphonyLayout from '../symphony/SymphonyLayout';
import { LoginState } from '../../store/login/types';
import { ReviewState } from '../../store/review/types';

interface ProductReviewProps {
    login: LoginState;
    review: ReviewState;
    fetchReview: typeof fetchReview;
    onChangeSearchReview: typeof onChangeSearchReview;
};

const HeaderTableCell = withStyles(() => ({
    root: {
        backgroundColor: '#757575',
        color: '#f5f5f5',
        borderLeft: '1px solid #9e9e9e',
        borderRight: '1px solid #9e9e9e',
    },
}))(TableCell);

class ProductReview extends Component<ProductReviewProps> {

    componentDidMount() {
        this.props.fetchReview();
    }

    _renderProductReview = () => {
        return _.map(this.props.review.productReview, (review) => {
            return (
                <TableRow>
                    <TableCell>
                        <Typography>
                            {review.customerName}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>
                            {review.productName}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>
                            {review.comment}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>
                            {review.orderNumber}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>
                            {review.date}
                        </Typography>
                    </TableCell>
                </TableRow>
            )
        })
    }

    _onChangeSearchReview = (event) => {
        if(event.target.value.length <= 0) {
            this.props.fetchReview()
        }
        else {
            this.props.onChangeSearchReview(event.target.value);
        }
    } 

    render() {
        return (
            <SymphonyLayout>
                <Box p={2}>
                    <TextField
                        className="round-border1"
                        fullWidth
                        label="Search"
                        variant="outlined"
                        onChange={this._onChangeSearchReview.bind(this)}
                    />
                </Box>
                <Box>
                    <TableContainer component={Box} py={1}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <HeaderTableCell>
                                        Customer Name
                                    </HeaderTableCell>
                                    <HeaderTableCell>
                                        Product Name
                                    </HeaderTableCell>
                                    <HeaderTableCell>
                                        Review Details
                                    </HeaderTableCell>
                                    <HeaderTableCell>
                                        Order Number
                                    </HeaderTableCell>
                                    <HeaderTableCell>
                                        Date
                                    </HeaderTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this._renderProductReview()
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </SymphonyLayout>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        login: state.login,
        review: state.review
    };
};

export default connect(mapStateToProps, {
    fetchReview,
    onChangeSearchReview
})(ProductReview);
