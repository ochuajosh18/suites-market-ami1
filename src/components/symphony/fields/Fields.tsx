import React from 'react';
import { connect } from 'react-redux';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { AppState } from '../../../store';
import { FieldsState, Field, FieldDialogType } from '../../../store/fields/types';
import { setFieldsState, loadModuleFields, saveModuleFields } from '../../../store/fields/actions';
import { AutocompleteKeyPair, SystemState } from '../../../store/system/types';
import { setSystemState, resetSystemDialog } from '../../../store/system/actions';
import { toastSuccess, toastWarning } from '../../../modules/Toast';

// common components
import {
    SymphonyTabs,
    SymphonyTab,
    SymphonyContainer,
    SymphonyTabsContainer,
    SymphonyViewContainer,
    SymphonyHeaderButton
}  from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout  from '../../symphony/SymphonyLayout';
import SymphonyContentLoading from '../../symphony/SymphonyContentLoading';
import { SYMPHONY_PRIMARY_COLOR } from '../Colors';

// local
import { FieldsAddSectionButton, DraggableContainer } from './fragments/FieldsComponents';
import FieldEditDialog from './fragments/FieldEditDialog';
import FieldSections from './fragments/FieldSections';
import FieldElements from './fragments/FieldElements';

// material
import Box from '@material-ui/core/Box';
import AddIcon from '@material-ui/icons/Add';

// util
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';
import map from 'lodash/map';
import find from 'lodash/find';
import { stringValidator } from '../../../utils/validators';

interface FieldsProps {
    loadModuleFields: typeof loadModuleFields;
    saveModuleFields: typeof saveModuleFields;
    setFieldsState: typeof setFieldsState;
    setSystemState: typeof setSystemState;
    resetSystemDialog: typeof resetSystemDialog;
    fields: FieldsState;
    system: SystemState;
}

const MAPPED_MANAGE: { [type: string]: string } = {
    product_management: 'product',
    product_variants_management: 'product_sku',
    customer_management: 'customer',
    contact_management: 'customer_contact',
    salesperson_management: 'salesperson'
};

class CustomerView extends React.Component<FieldsProps> {

    componentDidMount = () => {
        this.props.setSystemState({
            headerEndButton: <Box display="flex">
                <FieldsAddSectionButton
                    id="field-add-section-btn"
                    onClick={this._onAddSectionClick.bind(this)}
                    startIcon={<AddIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />}
                >
                    New Section
                </FieldsAddSectionButton>
                <SymphonyHeaderButton 
                    id="field-save-module-btn"
                    onClick={this._onSaveClick.bind(this)}
                    style={{ border: `1px solid ${SYMPHONY_PRIMARY_COLOR}` }}
                >
                    Save
                </SymphonyHeaderButton>
            </Box>,
            shallRedirect: false,
            redirectTo: ''
        });

        this.props.loadModuleFields('product');
    }

    componentWillUnmount = () => {
        this.props.setSystemState({ header: undefined, headerEndButton: undefined });
        this.props.setFieldsState({ activeModule: 'Product Management' });
    }

    _onTabChange = (tab: string) => {
        this.props.setFieldsState({ activeModule: tab });
        this.props.loadModuleFields(MAPPED_MANAGE[tab.toLowerCase().replace(/ +/g, '_')])
    }

    _onSaveClick = () => {
        this.props.setSystemState({
            systemDialogOpen: true,
            systemDialogMaxWidth: 'xs',
            systemDialogTitle: 'Save Fields',
            systemOverrideTitle: 'Confirm',
            systemDialogContent: 'Please note that saving the module field data is will make permanent changes. Click confirm to continue.',
            systemDialogSimple: true,
            systemDialogConfirm: true,
            systemDialogConfirmAction: () => {
                this.props.saveModuleFields(MAPPED_MANAGE[this.props.fields.activeModule.toLowerCase().replace(/ +/g, '_')]);
                this.props.resetSystemDialog();
            }
        });
    }

    _onAddSectionClick = () => {
        const sections = this.props.fields.sections;
        this.props.setFieldsState({ 
            sections: [...sections,
                {
                    name: `Section ${sections.length + 1}`,
                    fields: []
                }
            ]
         });
    }

    _onDragEnd = (result: DropResult) => {
        const { source, destination  } = result;
        let sourceDroppable = '';
        let destinationDroppable = '';
        let sections = [...this.props.fields.sections]; // clone
        let elements = this.props.fields.elements;
        for (const n of source.droppableId.split('-')[0].split('_')) {
            sourceDroppable +=  `${n[0].toUpperCase()}${n.substr(1)}_`;
        }
        if (destination) {
            for (const n of destination.droppableId.split('-')[0].split('_')) {
                destinationDroppable += `${n[0].toUpperCase()}${n.substr(1)}_`;
            }
        }

        if (destination && source.droppableId === 'sections-droppable') {
            // sort sections
            const section = sections[source.index];
            sections.splice(source.index, 1);
            sections.splice(destination.index, 0, section);
            this.props.setFieldsState({ sections });
            return;
        }

        if (destination && source.droppableId === destination.droppableId && source.index !== destination.index) {
            if (destination.droppableId === 'elements-droppable') {
                // elements re-sort
                const field = elements[source.index];
                elements.splice(source.index, 1);
                elements.splice(destination.index, 0, field);
                this.props.setFieldsState({ elements });
            }
            else { 
                // section re-sort since same droppable container 
                const sectionIndex = findIndex(sections, (s) => s.name.toLowerCase() === sourceDroppable.split('_').join(' ').toLowerCase().trim());
                // same container simply pluck and resort
                let fields = sections[sectionIndex].fields
                const field = sections[sectionIndex].fields[source.index];
                fields.splice(source.index, 1);
                fields.splice(destination.index, 0, field);
                sections[sectionIndex].fields = fields;
            }
        
            this.props.setFieldsState({
                sections
            });
        }

        if (destination && source.droppableId !== destination.droppableId) {
            // different container inject data 
            if (source.droppableId === 'elements-droppable') { // from elements list
                const droppableSectionIndex = findIndex(sections, (s) => s.name.toLowerCase() === destinationDroppable.split('_').join(' ').toLowerCase().trim());
                const field = { ...elements[source.index], section: destinationDroppable.split('_').join(' ').trim() };
                if (find(sections[droppableSectionIndex].fields, { title: field.title })) { toastWarning('Duplicate field name detected'); return }
                sections[droppableSectionIndex].fields.splice(destination.index, 0, field);
                this.props.setFieldsState({
                    sections,
                    elements: filter(elements, (f, i) => i !== source.index)
                });
            }
            else {
                if (destination.droppableId.indexOf('droppable_section') > -1) {
                    // elements to section
                    let sourceSectionIndex = findIndex(sections, (s) => s.name.toLowerCase() === sourceDroppable.split('_').join(' ').toLowerCase().trim());
                    let destinationSectionIndex = findIndex(sections, (s) => s.name.toLowerCase() === destinationDroppable.split('_').join(' ').toLowerCase().trim());
                    const field = sections[sourceSectionIndex].fields[source.index];
                    sections[sourceSectionIndex].fields.splice(source.index, 1);
                    sections[destinationSectionIndex].fields.splice(destination.index, 0, {
                        ...field,
                        section: destinationDroppable.split('_').join(' ').trim()
                    });
                }
                else {
                    // put back to elements list
                    const sectionIndex = findIndex(sections, (s) => s.name.toLowerCase() === sourceDroppable.split('_').join(' ').toLowerCase().trim());
                    let fields = sections[sectionIndex].fields
                    // your field to put in elements list
                    const field = { ...sections[sectionIndex].fields[source.index], section: '' };
                    if (!field.isDefault) { // only move non default fields back
                        // remove your field in the section
                        fields = filter(fields, (f, i) => i !== source.index);
                        sections[sectionIndex].fields = fields;
                        elements.splice(destination.index, 0, field);
                    }
                    else {
                        toastWarning("Cannot unassign default fields");
                    }
                }
                this.props.setFieldsState({
                    sections,
                    elements // inject into elements list
                });
            }
        }
    }

    
    _onSectionNameEdit = (old: string, newVal: string) => {
        const sectionIndex = findIndex(this.props.fields.sections, { name: old });
        if (sectionIndex > -1) {
            let sections = this.props.fields.sections;
            sections[sectionIndex] = { ...sections[sectionIndex], name: newVal };
            for (const f in sections[sectionIndex].fields) {
                sections[sectionIndex].fields[f] = { ...sections[sectionIndex].fields[f], section: newVal }
            }
            this.props.setFieldsState({ sections });
        }
    }

    _onOpenSection = (sectionName: string) => {
        const openSections = this.props.fields.openSections;
        this.props.setFieldsState({
            openSections: openSections.includes(sectionName) ? filter(openSections, (s) => s !== sectionName) : [...openSections, sectionName]
        });
    }

    _onDeleteSectionClick = (sectionName: string) => {
        const { elements, sections  } = this.props.fields;
        this.props.setSystemState({
            systemDialogOpen: true,
            systemDialogMaxWidth: 'xs',
            systemDialogTitle: 'Delete Section',
            systemOverrideTitle: 'Confirm',
            systemDialogContent: 'Please note that delete the section will make permanent changes. Click confirm to continue.',
            systemDialogSimple: true,
            systemDialogConfirm: true,
            systemDialogConfirmAction: () => {
                this.props.setFieldsState({ 
                    sections: filter(sections, (s) => s.name !== sectionName),
                    elements: [...elements, ...filter(sections, (s) => s.name === sectionName)[0].fields]
                });
                toastSuccess('Section deleted');
                this.props.resetSystemDialog();
            }
        });
    }

    _onToggleModal = (open: boolean) => this.props.setFieldsState({ modalVisible: open });

    _onFieldEditClick = (field: Field, type: FieldDialogType) => {
        this.props.setFieldsState({ activeField: field, modalVisible: true, fieldDialogType: type, activeFieldName: field.title, activeFieldSection: field.section });
    }

    _onActiveFieldEdit = (field: string, value: string | boolean | Array<string> | Array<AutocompleteKeyPair>) => {
        const { activeField } = this.props.fields;
        if (activeField) {
            let af: typeof activeField = {
                ...activeField,
                [field]: value
            }
            if (field === 'isMultiple') { af = { ...af, accepts: [] }};
            this.props.setFieldsState({
                activeField: af
            });
        }
    }

    _onFieldDeleteClick = (field: Field) => {
        const { elements, sections } = this.props.fields;
        this.props.setFieldsState({
            sections: map(sections, (s) => ({
                ...s,
                fields: filter(s.fields, (f) => f.name !== field.name)
            })),
            elements: filter(elements, (f) => f.name !== field.name)
        });
    }

    _onActiveFieldSave = (field: Field) => { 
        const { sections, activeFieldName, activeFieldSection, elements, fieldDialogType } = this.props.fields;
        if (!field.title) { toastWarning('Missing field name'); return }
        if (field.title && !(/^[a-zA-Z0-9_ ]*$/.test(field.title))) { toastWarning('Invalid field name'); return }
        if (!field.type) { toastWarning('Missing field type'); return }
        if (field.type === 'dropdown' && (!field.values 
            || (field.values && field.values.length === 0))
        ) { 
            toastWarning('Missing field dropdown values'); return 
        }

        // multimedia validation
        if (field.type === 'Multimedia' && (typeof field.accepts === 'undefined' || (field.accepts && field.accepts.length === 0))) {toastWarning('There should be at least one file type to accept'); return}
        if (field.type === 'Multimedia' && typeof field.isMultiple === 'undefined') {toastWarning('Variant is required'); return}

        if (!field.section && fieldDialogType === 'ADD') {
            // add to elements instead
            if (find(elements, (f) => stringValidator(f.title) === stringValidator(field.title))) { toastWarning('Field name already exist'); return }
            this.props.setFieldsState({ 
                modalVisible: false,
                elements: [...elements, field]
            });
            toastSuccess('Field added');
            return;
        }

        if (!field.section && fieldDialogType === 'UPDATE') {
            if (find(elements, (f) => stringValidator(f.title) === stringValidator(field.title)) && stringValidator(field.title) !== stringValidator(activeFieldName)) { toastWarning('Field name already exist'); return }
            const fieldIndex = findIndex(elements, { title: activeFieldName });
            elements.splice(fieldIndex, 1, field);
            this.props.setFieldsState({ 
                modalVisible: false,
                elements
            });
            toastSuccess('Field updated');
            return;
        }

        if (activeFieldName && activeFieldSection) {
            // update
            const sectionIndex = findIndex(sections, { name: activeFieldSection });
            const fields = sections[sectionIndex].fields;
            const fieldIndex = findIndex(fields, { title: activeFieldName });
            if (field.section !== activeFieldSection) {
                // move field into another section
                sections[sectionIndex].fields.splice(fieldIndex, 1);
                const newSectionIndex = findIndex(sections, { name: field.section as string });
                sections[newSectionIndex].fields.splice(sections[newSectionIndex].fields.length - 1, 0, field);
            }
            else {
                // simple upsert
                if (field.title !== activeFieldName) {
                    if (find(sections[sectionIndex].fields, (f) => stringValidator(f.title) === stringValidator(field.title))) { toastWarning('Field name already exist'); return }
                    // upsert updated field
                    sections[sectionIndex].fields.splice(fieldIndex, 1, field);
                }
                else {
                    // update field
                    sections[sectionIndex].fields[fieldIndex] = { ...field };
                }
            }
            this.props.setFieldsState({ 
                modalVisible: false,
                sections
            });
            toastSuccess('Field updated');
            return;
        }
        // add
        const sectionIndex = findIndex(sections, { name: field.section as string });
        sections[sectionIndex].fields = [...sections[sectionIndex].fields, field];
        this.props.setFieldsState({ 
            modalVisible: false,
            sections
        });
        toastSuccess('Field added');
    }

    render() {
        const { activeModule, sections, elements, modalVisible, fieldDialogType, activeField, fieldsLoading, openSections } = this.props.fields;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyTabsContainer>
                        <SymphonyTabs 
                            id="field-tabs"
                            variant="scrollable"
                            scrollButtons="off"
                            value={activeModule}
                            TabIndicatorProps={{ style: { height: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                        >
                            <SymphonyTab 
                                label="Product Management" 
                                value="Product Management" 
                                onClick={this._onTabChange.bind(this, 'Product Management')}
                                className="field-module-tab"
                            />
                            <SymphonyTab 
                                label="Product Variants Management" 
                                value="Product Variants Management" 
                                onClick={this._onTabChange.bind(this, 'Product Variants Management')}
                                className="field-module-tab"
                            />
                            <SymphonyTab 
                                label="Customer Management" 
                                value="Customer Management"
                                onClick={this._onTabChange.bind(this, 'Customer Management')}
                                className="field-module-tab"
                            />
                            <SymphonyTab 
                                label="Contact Management" 
                                value="Contact Management" 
                                onClick={this._onTabChange.bind(this, 'Contact Management')}
                                className="field-module-tab"
                            />
                            <SymphonyTab 
                                label="Salesperson Management" 
                                value="Salesperson Management"
                                onClick={this._onTabChange.bind(this, 'Salesperson Management')}
                                className="field-module-tab"
                            />
                        </SymphonyTabs>
                    </SymphonyTabsContainer>
                    <SymphonyViewContainer>
                        <DraggableContainer>
                            {fieldsLoading ? <SymphonyContentLoading /> :
                                <DragDropContext onDragEnd={this._onDragEnd}>
                                    <FieldSections 
                                        sections={sections} 
                                        onSectionNameEdit={this._onSectionNameEdit.bind(this)}
                                        onFieldEditClick={this._onFieldEditClick.bind(this)}
                                        onFieldDeleteClick={this._onFieldDeleteClick.bind(this)}
                                        onDeleteSectionClick={this._onDeleteSectionClick.bind(this)}
                                        onOpenClick={this._onOpenSection.bind(this)}
                                        openSections={openSections}
                                    />
                                    <FieldElements 
                                        elements={elements} 
                                        onFieldEditClick={this._onFieldEditClick.bind(this)}
                                        onFieldDeleteClick={this._onFieldDeleteClick.bind(this)}
                                    />
                                </DragDropContext>
                            }
                        </DraggableContainer>
                    </SymphonyViewContainer>
                </SymphonyContainer>
                <FieldEditDialog
                    action={fieldDialogType}
                    open={modalVisible}
                    sections={sections}
                    onClose={this._onToggleModal.bind(this, false)}
                    activeField={activeField}
                    onActiveFieldEdit={this._onActiveFieldEdit.bind(this)}
                    onActiveFieldSave={this._onActiveFieldSave.bind(this)}
                />
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    fields: state.fields,
    system: state.system
});

export default connect(mapStateToProps, {
    loadModuleFields,
    saveModuleFields,
    setFieldsState,
    setSystemState,
    resetSystemDialog
})(CustomerView);