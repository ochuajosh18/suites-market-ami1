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
    Typography
} from '@material-ui/core';

import { AppState } from '../../store';
import { fetchRating, onChangeSearchRating } from '../../store/review/actions'

import SymphonyLayout from '../symphony/SymphonyLayout';
import { LoginState } from '../../store/login/types';
import { ReviewState } from '../../store/review/types';

interface ProductRatingProps {
    login: LoginState;
    review: ReviewState;
    fetchRating: typeof fetchRating;
    onChangeSearchRating: typeof onChangeSearchRating;
};

const HeaderTableCell = withStyles(() => ({
    root: {
        backgroundColor: '#757575',
        color: '#f5f5f5',
        borderLeft: '1px solid #9e9e9e',
        borderRight: '1px solid #9e9e9e',
    },
}))(TableCell);

class ProductRating extends Component<ProductRatingProps> {

    componentDidMount() {
        this.props.fetchRating();
    }

    _renderProductRating = () => {
        return _.map(this.props.review.productRating, (rating) => {
            return (
                <TableRow>
                    <TableCell>
                        <Typography>
                            {rating.productName}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>
                            {rating.rating}
                        </Typography>
                    </TableCell>
                </TableRow>
            )
        })
    }

    _onChangeSearchRating = (event) => {
        if(event.target.value.length <= 0) {
            this.props.fetchRating()
        }
        else {
            this.props.onChangeSearchRating(event.target.value);
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
                        onChange={this._onChangeSearchRating.bind(this)}
                    />
                </Box>
                <Box>
                    <TableContainer component={Box} py={1}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <HeaderTableCell>
                                        Product Name
                                    </HeaderTableCell>
                                    <HeaderTableCell>
                                        Ratings
                                    </HeaderTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this._renderProductRating()
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
    fetchRating,
    onChangeSearchRating
})(ProductRating);
