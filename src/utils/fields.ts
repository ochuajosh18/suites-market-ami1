import { GenericMedia } from '../store/system/types';
import { Field } from '../store/fields/types';
import { BasicProduct, BasicProductSku, DynamicBasicProductInput } from '../store/basicproduct/types';
import { CustomerContact, DynamicBasicCustomerInput, Geolocation, ICustomer } from '../store/customer/types';
import { DynamicSalesSalespersonInput, Salesperson } from '../store/salesperson/types';
import { Distributor, DynamicDistributorType } from '../store/distributor/types';
import axios from 'axios';
import Geocode from 'react-geocode';
import filter from 'lodash/filter';
import { toastWarning } from '../modules/Toast';


type Entity = BasicProduct | BasicProductSku | ICustomer | Salesperson | Distributor;
interface Data {
    [key: string]: DynamicBasicProductInput | DynamicBasicCustomerInput | DynamicSalesSalespersonInput | DynamicDistributorType;
}

export const mediaFieldUploader = async (apiUrl: string, field: Field, entityData: Data | CustomerContact | Distributor, updateData: Data) => {
    const mediaForm = new FormData();
    let shallUpload = false;
    if (field.isMultiple) {
        for (const m of entityData[field.name] as Array<GenericMedia>) {
            if (m.file) {
                mediaForm.append('media', m.file, m.file.name);
                shallUpload = true;
            }
        }
    }
    else {
        if (entityData[field.name]) {
            if ((Array.isArray(entityData[field.name]) && (entityData[field.name] as GenericMedia)[0].file) || (!Array.isArray(entityData[field.name]) && (entityData[field.name] as GenericMedia).file)) {
                shallUpload = true;
            }
            mediaForm.append('media', Array.isArray(entityData[field.name]) ? (entityData[field.name] as GenericMedia)[0].file! : (entityData[field.name] as GenericMedia).file!);
        }
    }
    
    try {
        let key = '';
        if (shallUpload) {
            const upRes = await axios.post(apiUrl, mediaForm); 
            key = typeof upRes.data.media === 'undefined' ? 'avatar' : key;
            key = typeof upRes.data.avatar === 'undefined' ? 'logo' : key;
            key = typeof upRes.data.logo === 'undefined' ? 'media' : key;
            
            return { 
                ...updateData, 
                [field.name]: 
                    field.isMultiple ? 
                        [...filter(entityData[field.name] as Array<GenericMedia>, (f) => typeof f.file === 'undefined'), ...upRes.data[key]] 
                    : 
                        Array.isArray(upRes.data[key]) && upRes.data[key][0] ? upRes.data[key][0] 
                        : typeof upRes.data[key] === 'object' ? upRes.data[key]
                        : entityData[field.name] ? entityData[field.name] : null
            }
        }
        else {
            return updateData; // no change due to no upload
        }
    }
    catch (e) {
        if (e.response && e.response.status === 409) {
            // eslint-disable-next-line
            throw { message: `${field.title}: File size cannot exceed the limit of 5MB`}
        }
        else {
            throw e;
        }
    }
}

export const fieldsValid = (moduleName: string, fields: Array<Field>, entity: Entity): boolean => {
    for (const f of fields) {
        if (f.isRequired && f.type !== 'View') { 
            const fieldType = f.type.toLowerCase();

            if (f.type === 'Input Range') {
                if (entity[f.minName as string] && !entity[f.maxName as string]) { 
                    toastWarning(`Missing max value for ${f.title.toLowerCase()}`);
                    return false;
                }
                if (!entity[f.minName as string] && entity[f.maxName as string]) { 
                    toastWarning(`Missing min value for ${f.title.toLowerCase()}`);
                    return false;
                }
                if (entity[f.minName as string] && entity[f.maxName as string]) { 
                    const min = parseInt(entity[f.minName as string] as string);
                    const max = parseInt(entity[f.maxName as string] as string);
                    if (min >= max) {
                        toastWarning(`Minimum value for ${f.title.toLowerCase()} should be less than maximum`);
                        return false;
                    }
                    if (max <= min) {
                        toastWarning(`Maximum value for ${f.title.toLowerCase()} should be greater than minimum`);
                        return false;
                    }
                }
            }

            if ((fieldType.indexOf('number') > -1 || fieldType.indexOf('range') > -1) && !Boolean(parseFloat(entity[f.name] as string))) {
                // number validation
                toastWarning(`Missing/Invalid ${moduleName} ${f.title.toLowerCase()}`); 
                return Boolean(parseFloat(entity[f.name] as string));
            }
            
            if (!entity[f.name]) {
                // string validation
                toastWarning(`Missing ${moduleName} ${f.title.toLowerCase()}`); 
                return Boolean(entity[f.name] as string); 
            }
        }
    }
    return true;
}

export const reverseGeocode = async (field: Field, entityData: Data | CustomerContact | Distributor ) => {
    const geo = entityData[field.name] as Geolocation;
    const geoRes = await Geocode.fromLatLng(geo.latitude, geo.longitude);
    const address = geoRes.results.length > 0 ? geoRes.results[0].formatted_address : '';
    return { ...entityData, [field.name]: { ...geo, address: address }} as any;
}