import { HomeState, HomeAction } from './types';

const INITIAL_STATE: HomeState = {};

export function homeReducer(
    state = INITIAL_STATE,
    action: HomeAction,
): HomeState {
    switch (action.type) {
        default:
            return state;
    }
}
