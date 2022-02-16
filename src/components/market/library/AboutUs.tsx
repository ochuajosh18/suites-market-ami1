import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store/';
import { LibraryState } from '../../../store/library/types';
import { setSystemState, resetSystemDialog } from '../../../store/system/actions';
import { setLibraryState, saveAboutUs, getAboutUs } from '../../../store/library/actions';

// Material UI
import Box from '@material-ui/core/Box';

// Local Components
import { SubHeader, LibraryContentContainer, LibraryInputContainer } from './fragments/LibraryCommonComponents';

// Global Components
import { 
    SymphonyHeaderButton, 
    SymphonyHeaderTitle,
    SymphonyContainer,
    SymphonyContentContainer
} from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import SymphonyMediaInput from '../../symphony/SymphonyMediaInput';
import SymphonyInput from '../../symphony/SymphonyInput';
import SymphonyContentLoading from '../../symphony/SymphonyContentLoading';

// Utils
import includes from 'lodash/includes';
import { toastError } from '../../../modules/Toast';

interface AboutUsProps {
    library: LibraryState;
    getAboutUs: typeof getAboutUs;
    saveAboutUs: typeof saveAboutUs;
    setSystemState: typeof setSystemState;
    setLibraryState: typeof setLibraryState; 
    resetSystemDialog: typeof resetSystemDialog;   
}

class AboutUs extends React.PureComponent<AboutUsProps> {

    componentDidMount = () => {
        this.props.setSystemState({
            header: (
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <SymphonyHeaderTitle
                        id="aboutus-header-title"
                    >
                        About Us
                    </SymphonyHeaderTitle>
                    <div>
                        <SymphonyHeaderButton 
                            id="aboutus-save-btn"
                            onClick={this._onPressSaveButton.bind(this)}
                        >
                            Save
                        </SymphonyHeaderButton>
                    </div>
                </Box>
            )
        })
        this.props.getAboutUs();
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined })

    _onPressSaveButton = () => {
        const { image, description } = this.props.library;
        if (!image.path && !image.file) {
            toastError('Missing image');
            return;
        }

        if (!description) {
            toastError('Missing description');
            return;
        }
        this.props.setSystemState({
            systemDialogOpen: true,
            systemDialogMaxWidth: 'xs',
            systemDialogTitle: 'Confirm Save',
            systemDialogContent: 'Please note that any changes are permanent. To continue, please click the save button.',
            systemDialogSimple: true,
            systemDialogConfirm: true,
            systemDialogConfirmAction: () => { 
                this.props.saveAboutUs();
                this.props.resetSystemDialog();
            }
        });
        // Call Save API
    }
    
    render () {
        const { image, description, aboutUsLoading } = this.props.library;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyContentContainer>
                        { aboutUsLoading ? <SymphonyContentLoading /> :
                            <LibraryContentContainer>
                                <SubHeader id="aboutus-sub-header">Changes will be reflected on the app</SubHeader>
                                <SymphonyMediaInput
                                    mediaList={[image]}
                                    onMediaInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.files) {
                                            const file = e.target.files[0];
                                            if (includes(file.type, 'image')) {
                                                if (file.size > 5000000) { toastError('Each file cannot exceed 5mb'); return; };
                                                this.props.setLibraryState({
                                                    image: {
                                                        ...image,
                                                        type: file.type,
                                                        file
                                                    }
                                                })
                                                return;
                                            }
                                            toastError('Invalid file type')
                                        }
                                    }}
                                    onMediaDelete={() => {}}
                                    imageOnly={true}
                                    imageOnlyHeader="Image"
                                    imageOnlyAddText="Change Image"
                                />
                                <LibraryInputContainer>
                                    <SymphonyInput
                                        id="aboutus-description-input"
                                        type="multiline"
                                        label="About Us Content"
                                        richText={true}
                                        value={description}
                                        onRichTextInput={(html) => {
                                            this.props.setLibraryState({
                                                description: html
                                            })
                                        }}
                                    />
                                </LibraryInputContainer>
                            </LibraryContentContainer>
                        }
                    </SymphonyContentContainer>
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        library: state.library
    }
}

export default connect(mapStateToProps, {
    getAboutUs,
    saveAboutUs,
    setSystemState,
    setLibraryState,
    resetSystemDialog
})(AboutUs);