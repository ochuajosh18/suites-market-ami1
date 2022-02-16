import React from 'react';
import { GenericMedia } from '../../../../store/system/types';
import { ColumnLevel } from '../../../../store/category/types';
import { 
    ModalContainer, 
    ModalContentContainer, 
    ModalContent, 
    ModalTitle, 
    ModalImageContainer, 
    ModalImageBox,
    ModalAddIcon,
    ModalTypography,
    ModalInputContainer,
    ModalButtonContainer,
    ModalSaveButton,
    ModalCancelButton,
    ModalUploadImageButton,
    Loading
} from './CategoryComponents';
import SymphonyInput from '../../../symphony/SymphonyInput';
import includes from 'lodash/includes';

interface AddOrEditModalProps {
    modalAddOrEditIsOpen: boolean;
    modalTitle: string;
    modalImage: GenericMedia;
    modalCategoryName: string;
    level: ColumnLevel;
    loading: boolean;
    onPressCancelModal: () => void;
    onPressSaveModal: () => void;
    onChangeModalCategoryName: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onMediaInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default (props: AddOrEditModalProps) => {
    const inputRef = React.createRef<HTMLInputElement>();
    const [media, setMedia] = React.useState<GenericMedia>({ name: '', type: '', size: 0, path: '' });

    const { 
        modalAddOrEditIsOpen, 
        modalTitle, 
        modalImage, 
        modalCategoryName, 
        onPressCancelModal, 
        onPressSaveModal, 
        onChangeModalCategoryName,
        onMediaInput
    } = props;

    const synchronousImageLoader = async (file: File) => {
        let r64 = await new Promise((resolve) => {
            const fileReader = new FileReader();
            fileReader.onload = (e) => resolve(fileReader.result);
            fileReader.readAsDataURL(file);
        });

        return r64;
    }

    React.useEffect(() => {
        const load = async () => {
            try {
                let media = modalImage;
                if (typeof media.file !== 'undefined' && typeof media.file!.name !== 'undefined') {
                    // convert file to path and type
                    media = {
                        ...media,
                        file: media.file,
                        type: media.file!.type,
                        path: (await synchronousImageLoader(media.file!)) as string
                    }
                }
                for (const i in media) {
                    if (typeof media[i].file !== 'undefined' && typeof media[i].file!.name !== 'undefined') {
                        // convert file to path and type
                        media[i] = {
                            ...media[i],
                            file: media[i].file,
                            type: media[i].file!.type,
                            path: (await synchronousImageLoader(media[i].file!)) as string
                        }
                    }
                }
                setMedia(media);
            }
            catch (e) {
                console.log(e);
            }
        }
        load(); // load media
        // eslint-disable-next-line
    }, [modalImage, props.modalCategoryName]);
    
    const setImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(files[0])

            reader.onloadend = () => {
                const pMedia: GenericMedia = {
                    path: reader.result as string,
                    name: '',
                    size: 0,
                    type: files[0].type,
                    file: files[0]
                };
                const newMedia = pMedia;
                if (includes(files[0].type, 'image')) {
                    if(files[0].size < 5000000) {
                        setMedia(newMedia);
                    }
                }
            }
            onMediaInput(e);
        }
    }

    const triggerInput = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
            inputRef.current.click();
        }
    }

    return (
        <ModalContainer 
            open={modalAddOrEditIsOpen}
            id="category-addedit-modal"
        >
            <ModalContentContainer>
                <ModalContent height={props.level !== 'Level 3' ? '400px' : '180px !important'}>
                    <ModalTitle>{modalTitle}</ModalTitle>
                    { props.level !== 'Level 3' &&
                        <ModalImageContainer>
                            <input 
                                type="file"
                                ref={inputRef} 
                                style={{ display: 'none', visibility: 'hidden'}} 
                                onChange={setImagePreview} 
                                accept="image/*"
                            />
                            {
                                media.path.length > 0 ?
                                <img src={media.path} alt={modalTitle} /> :
                                <ModalImageBox
                                    onClick={() => triggerInput()}
                                >
                                    <ModalAddIcon />
                                </ModalImageBox>
                            }
                            <ModalUploadImageButton
                                onClick={() => triggerInput()}
                            >
                                Upload Image
                            </ModalUploadImageButton>
                            <ModalTypography style={{ fontSize: 12, color: '#969696' }}>
                                (Maximum size 5MB)
                            </ModalTypography>
                        </ModalImageContainer>
                    }
                    <ModalInputContainer>
                        <SymphonyInput 
                            type="text"
                            id="category-name-input"
                            value={modalCategoryName}
                            label="Category Name"
                            onChange={onChangeModalCategoryName}
                            maxLength={100}
                        />
                    </ModalInputContainer>
                    <ModalButtonContainer>
                        <ModalCancelButton onClick={onPressCancelModal}>Cancel</ModalCancelButton>
                        <ModalSaveButton onClick={onPressSaveModal}>
                            {
                                props.loading ?  <Loading size={15}/> : <>Save</>
                            }
                        </ModalSaveButton>
                    </ModalButtonContainer>
                </ModalContent>
            </ModalContentContainer>
        </ModalContainer>
    )
}