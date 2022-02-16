import React from 'react';
import { ContactNumber } from '../../../../store/salesperson/types';
import { 
    SymphonyTextField,
    SymphonyInputGridContainer,
    SymphonyInputLabelGridContainer,
    SymphonyInputGridItemContainer,
    SymphonyInputAuxButton
} from '../../../symphony/SymphonyCommonComponents';

// material
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import AddIcon from '@material-ui/icons/Add';

// util
import map from 'lodash/map';
import filter from 'lodash/filter';

interface SalespersonContactInputProps {
    contacts: ContactNumber;
    onContactInput: (data: ContactNumber) => void;
}

const SalespersonContactInput = (props: SalespersonContactInputProps) => {
    const EMPTY: ContactNumber = { primary: '', secondary: '', other: [] };
    const { contacts, onContactInput } = props;
    const [curContact, setCurContact] = React.useState<ContactNumber>(EMPTY);
    const numberRegex: RegExp = /^\d+$/;

    const _onBlur = () => {
        onContactInput({
            ...curContact,
            other: filter(curContact.other, (c) => c.length > 0)
        });
    }

    // eslint-disable-next-line
    React.useEffect(() => { setCurContact(contacts); }, []);

    return (
        <>
            <SymphonyInputGridContainer container={true}>
                <SymphonyInputLabelGridContainer item={true} xs={12}>Primary Contact Number</SymphonyInputLabelGridContainer>
                <SymphonyInputGridItemContainer item={true} xs={12}>
                    <SymphonyTextField
                        id="salesperson-primarycontact-number-input"
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            if (numberRegex.test(e.target.value) || !e.target.value) {
                                setCurContact({ ...curContact, primary: e.target.value });
                            }
                        }}
                        fullWidth={true}
                        value={curContact.primary}
                        autoComplete="none"
                        onBlur={_onBlur}
                    />
                </SymphonyInputGridItemContainer>
            </SymphonyInputGridContainer>
            <SymphonyInputGridContainer container={true}>
                <SymphonyInputLabelGridContainer item={true} xs={12}>Secondary Contact Number</SymphonyInputLabelGridContainer>
                <SymphonyInputGridItemContainer item={true} xs={12}>
                    <SymphonyTextField
                        id="salesperson-secondarycontact-number-input"
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            if (numberRegex.test(e.target.value) || !e.target.value) {
                                setCurContact({ ...curContact, secondary: e.target.value });
                            }
                        }}
                        fullWidth={true}
                        value={curContact.secondary}
                        autoComplete="none"
                        onBlur={_onBlur}
                    />
                </SymphonyInputGridItemContainer>
            </SymphonyInputGridContainer>
            <SymphonyInputGridContainer>
                <SymphonyInputLabelGridContainer item={true} xs={12}>Other Contact Number</SymphonyInputLabelGridContainer>
                    <>
                        {map(curContact.other, (c, i) => (
                            <SymphonyInputGridItemContainer key={`salesperson-other${i}-number-input`} item={true} xs={12} style={{ marginBottom: 8 }}>
                                <SymphonyTextField
                                    id={`salesperson-other${i}-number-input`}
                                    type="text"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                        if (numberRegex.test(e.target.value) || !e.target.value) {
                                            let o = curContact.other;
                                            o[i] = e.target.value;
                                            setCurContact({ ...curContact, other: o });
                                        }
                                    }}
                                    fullWidth={true}
                                    value={c}
                                    autoComplete="none"
                                    onBlur={_onBlur}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton 
                                                    style={{ width: 14, height: 14 }}
                                                    onClick={() => {
                                                        let newOther = curContact.other;
                                                        newOther.splice(i, 1);
                                                        setCurContact({ ...curContact, other: newOther });
                                                    }}
                                                >
                                                    <Icon className="fa fa-trash-alt" style={{ fontSize: 14 }} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </SymphonyInputGridItemContainer>
                        ))} 
                        <SymphonyInputGridItemContainer item={true} xs={12} style={{ marginBottom: 8 }}>
                            <SymphonyInputAuxButton 
                                id="salesperson-add-other-contact-btn"
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    setCurContact({ ...curContact, other: [...curContact.other, '']});
                                }}
                            >
                                Add Contact
                            </SymphonyInputAuxButton>
                        </SymphonyInputGridItemContainer>   
                    </>
            </SymphonyInputGridContainer>
        </>
    )
}

export default SalespersonContactInput;