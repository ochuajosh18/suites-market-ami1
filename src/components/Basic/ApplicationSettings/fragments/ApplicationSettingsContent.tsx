import React from 'react';
import Grid from '@material-ui/core/Grid';
import BasicInput from '../../Common/BasicInput';

export default () => {
    return (
        <Grid container={true}>
            <Grid item={true} xs={8}>
                <BasicInput
                    label="Color Theme"
                    value=""
                    placeholder="Select Primary Here"
                    type="dropdown"
                />
                <BasicInput
                    label=""
                    value=""
                    placeholder="Select Secondary Here"
                    type="dropdown"
                />
                <BasicInput
                    label="Currency"
                    value=""
                    placeholder="Select Here"
                    type="dropdown"
                />
                <BasicInput
                    label="Logo / Images"
                    value=""
                    placeholder="Select Secondary Here"
                    type="mediainput"
                    mediaType="IMAGE"
                    mediaLabel="Add Image"
                />
            </Grid>
        </Grid>
    )
}