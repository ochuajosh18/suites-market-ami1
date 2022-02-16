import React from 'react';
import { PermissionTab } from '../../../../store/applicationsettings/types';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import Tooltip from '@material-ui/core/Tooltip';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import {
    PermissionIconButton,
    PermissionsRowContainer,
    PermissionsRow
} from './ApplicationSettingsComponents';
import map from 'lodash/map';

interface PermissionTabsInterface {
    editing: boolean;
    tabs: Array<PermissionTab>;
    onSortEnd: ({ oldIndex, newIndex }) => Array<PermissionTab>;
}


const DraggableHandle = SortableHandle(() => (
    <PermissionIconButton style={{ position: 'absolute', right: -40, top: 0, bottom: 0, width: 40 }}>
        <Tooltip 
            title="Drag and Drop to Rearrange Fields" 
            aria-label="drag-and-drop"
            placement="left"
            arrow
        >
            <DragIndicatorIcon fontSize="large" htmlColor="#B2B2B2" />
        </Tooltip>
    </PermissionIconButton>
));

const DragIcon = (props: { editing: boolean }) => {
    if(props.editing) {
        return <DraggableHandle />;
    }
    return null;
}

const SortableItem = SortableElement(({ field, editing }) => {
    return (
        <PermissionsRowContainer>
            <PermissionsRow>
                {field.label}
            </PermissionsRow>
            <DragIcon editing={editing} />
        </PermissionsRowContainer>
    )
});

const SortableList = SortableContainer(({ items, editing }) => {
    return (
        <ul style={{ padding: 0, margin: 0  }}>
            {map(items, (item, index) => (
                <SortableItem
                    index={parseInt(index, 10)}
                    key={`item-${item.id}`}
                    field={item}
                    editing={editing}
                    collection={item.section}
                />
            ))}
        </ul>
    );
});

export default (props: PermissionTabsInterface) => {
    return (
        <SortableList 
            items={props.tabs} 
            editing={props.editing} 
            lockAxis="y"
            useDragHandle
            onSortEnd={props.onSortEnd}
        />
    )
}