import moment from 'moment';
import map from 'lodash/map';
import { AutocompleteKeyPair } from '../store/system/types';
export interface Filter {
    [name: string]: string | Array<string> | number | boolean | Array<number> | Array<AutocompleteKeyPair> | undefined;
}

export const filterToParams = (filter: Partial<Filter>, isCsv = false): string => {
    let queryParams = '&';
    const af = Object.keys(filter);
    if (af.length > 0) {
        for (const f in af) {
            const fKey = filter[af[f]];
            if (typeof fKey !== 'undefined') {
                if (Array.isArray(fKey)) {
                    // do array build
                    if (af[f] !== 'paymentMethod') {
                        if (typeof fKey[0] === 'object') {
                            // keypair
                            const mapped = map(fKey as Array<AutocompleteKeyPair>, (o) => o.value);
                            if (isCsv) {
                                for (const m of mapped) {
                                    queryParams += `${af[f]}=${m}&`;
                                }
                            }
                            else queryParams += `${af[f]}=${mapped.join(',')}&`;
                        }
                        else queryParams += `${af[f]}=${fKey.join(',')}&`
                    }
                    else queryParams += `${af[f]}=${fKey.join(',')}&`
                }
                else {
                    // do simple string build
                    if (af[f].toLowerCase().indexOf('date') > -1) {
                        queryParams += `${af[f]}=${moment(fKey as string, 'DD/MM/YYYY').format()}&`;
                    }
                    else {
                        queryParams += `${af[f]}=${fKey}&`;
                    }
                }
            }
        }
    }
    return queryParams.substr(0, queryParams.length - 1);;
}