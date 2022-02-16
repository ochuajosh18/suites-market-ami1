import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Field, FieldDialogType } from '../../../../store/fields/types';
// global
import {
    SymphonyHeaderButton
} from '../../SymphonyCommonComponents'

import {
    FieldElementsContainer,
    FieldElementsHeaderContainer,
    FieldElementsHeaderTextContainer,
    FieldElementSearchInput,
    FieldInstructionContainer,
    ElementsDraggableContainer,
    FieldsDraggablePlaceholderContainer
} from './FieldsComponents';
import FieldRow from './FieldRow';

// material
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';

//util
import map from 'lodash/map';
import find from 'lodash/find';

interface FieldElementsProps {
    elements: Array<Field>;
    onFieldEditClick: (field: Field, type: FieldDialogType) => void;
    onFieldDeleteClick: (field: Field) => void;
}

const FieldElements = (props: FieldElementsProps) => {
    const [search, setSearch] = React.useState('');
    const { elements, onFieldEditClick, onFieldDeleteClick } = props;
    return (
        <FieldElementsContainer id="field-elements-container">
            <FieldElementsHeaderContainer>
                <FieldElementsHeaderTextContainer>
                    Elements
                </FieldElementsHeaderTextContainer>
                <SymphonyHeaderButton
                    id="field-element-add-btn"
                    startIcon={<AddIcon htmlColor="#FFF" />}
                    style={{ width: 140 }}
                    onClick={() => onFieldEditClick({ 
                        id: 'new',
                        title: '',
                        name: '',
                        section: '',
                        type: '',
                        isRequired: false,
                        isDefault: false,
                        isActive: true
                    }, 'ADD')}
                >
                    New Fields
                </SymphonyHeaderButton>
            </FieldElementsHeaderContainer>
            <FieldElementSearchInput 
                id="field-element-search-fld"
                InputProps={{
                    startAdornment: <InputAdornment position="start">
                        <SearchIcon htmlColor="#4D89F5" />
                    </InputAdornment>
                }}
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <FieldInstructionContainer>
                Elements here won't be shown on your app
            </FieldInstructionContainer>
            <Droppable 
                droppableId="elements-droppable"
                renderClone={(provided) => {
                    const field = find(elements, { name: provided.draggableProps['data-rbd-draggable-id'].split('-')[0] });
                    return (
                        <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                        >
                            {field &&
                                <FieldRow
                                    key={field.title}
                                    index={0}
                                    field={field}
                                    title={field.title}
                                    type={field.type}
                                    editable={!field.isDefault}
                                    badgeless={true}
                                    onFieldEditClick={onFieldEditClick}
                                    onFieldDeleteClick={onFieldDeleteClick}
                                />
                            }
                        </div>
                    )
                }}
            >
                {(provided) => (
                    <ElementsDraggableContainer innerRef={provided.innerRef}>
                        {map(elements, (f, i) => (
                            <Draggable 
                                key={`${f.name}-draggable`}
                                draggableId={`${f.name}-draggable`}
                                index={i}
                            >   
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{ ...provided.draggableProps.style, display: f.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ? 'block' : 'none' }}
                                    >
                                        <FieldRow
                                            key={f.title}
                                            field={f}
                                            index={i+1}
                                            title={f.title}
                                            type={f.type}
                                            editable={!f.isDefault}
                                            badgeless={true}
                                            onFieldEditClick={onFieldEditClick}
                                            onFieldDeleteClick={onFieldDeleteClick}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {elements.length === 0 &&
                            <FieldsDraggablePlaceholderContainer width="99%!important">
                                Add new field to create a draggable element
                            </FieldsDraggablePlaceholderContainer>
                        }
                        {provided.placeholder}
                    </ElementsDraggableContainer>
                )}
            </Droppable>
        </FieldElementsContainer>
    )
}

export default FieldElements;