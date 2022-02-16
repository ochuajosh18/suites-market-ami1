import {
    SET_ORDER_MANAGEMENT_STATE,
    OrderManagementInput,
    OrderManagementAction,
    OrderManagementFilter,
    OrderItem
} from './types';
import { AppThunk } from '..';
import { toastError, toastSuccess } from '../../modules/Toast';
import { filterToParams } from '../../utils/filter';
import axios from 'axios';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
const API_URL = process.env.REACT_APP_API_URL;

export const setOrderManagementState = (state: OrderManagementInput): OrderManagementAction => ({
    type: SET_ORDER_MANAGEMENT_STATE,
    payload: state
});

export const getOrders = (filter?: Partial<OrderManagementFilter>, isHistory = false): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_ORDER_MANAGEMENT_STATE,
            payload: { orderLoading: true }
        });

        try {
            const { user } = getState().login;
            if (user) {
                // end query builder
                const userType = getState().system.userType;
                const url = userType === 'Basic' ? `${API_URL}/v1/orders?vendorId=${user.id}` : `${API_URL}/order/getVendorOrdersByVendorId/${user.id}?view=${isHistory ? 'history' : 'manage'}`;
                const orderRes = await axios.get(`${url}${filter ? filterToParams(filter) : ''}`);
                if (orderRes.status === 200) {
                    dispatch({
                        type: SET_ORDER_MANAGEMENT_STATE,
                        payload: { orders: orderRes.data }
                    });

                    if (getState().ordermanagement.filterMinPrice === 0 && orderRes.data.length > 0) {
                        const filterMinPrice = minBy(orderRes.data as Array<OrderItem>, 'totalAmount')!.totalAmount;
                        const filterMaxPrice = maxBy(orderRes.data as Array<OrderItem>, 'totalAmount')!.totalAmount;
                        dispatch({
                            type: SET_ORDER_MANAGEMENT_STATE,
                            payload: { 
                                filterMinPrice,
                                filterMaxPrice
                            }
                        });
                    }
                }
            }
        }
        catch (e) {
            toastError("Loading failed. Please contact your administrator")
        }
        finally {
            dispatch({
                type: SET_ORDER_MANAGEMENT_STATE,
                payload: { orderLoading: false }
            });
        }
    }
}

export const getOrder = (id: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_ORDER_MANAGEMENT_STATE,
            payload: { activeOrderLoading: true }
        });

        try {
            const orderRes = await axios.get(`${API_URL}/v1/orders/${id}`);
            if (orderRes.status === 200) {
                dispatch({
                    type: SET_ORDER_MANAGEMENT_STATE,
                    payload: { activeOrder: orderRes.data }
                });
            }
        }
        catch (e) {
            toastError("Loading failed. Please contact your administrator")
        }
        finally {
            dispatch({
                type: SET_ORDER_MANAGEMENT_STATE,
                payload: { activeOrderLoading: false }
            });
        }
    }
}


export const updateOrder = (id: string, status: string): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_ORDER_MANAGEMENT_STATE,
            payload: { activeOrderLoading: true }
        });

        try {
            const orderRes = await axios.put(`${API_URL}/order/updateOrderStatus/${id}/${status.toUpperCase().replace(/ +/g, '_')}`);
            if (orderRes.status === 204) {
                const { activeFilters } = getState().ordermanagement;
                dispatch(getOrder(id));
                dispatch(getOrders(activeFilters));
                toastSuccess("Order status successfully updated")
            }
        }
        catch (e) {
            toastError("Loading failed. Please contact your administrator")
        }
        finally {
            dispatch({
                type: SET_ORDER_MANAGEMENT_STATE,
                payload: { activeOrderLoading: false }
            });
        }
    }
}
