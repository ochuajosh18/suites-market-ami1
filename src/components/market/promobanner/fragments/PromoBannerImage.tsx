import React from 'react';
import { GenericMedia } from '../../../../store/promobanner/types';
// Local Components
import { 
    PromoBannerImageContainer, 
    PromoBannerImageLabel, 
    PromoBannerChangeButton, 
    PromoBannerChangeButtonIcon,
    PromoBannerChangeButtonLabel,
    PromoBannerChangeButtonContent,
    PromoBannerImageRowContainer
} from './PromoBannerCommonComponents';

import includes from 'lodash/includes';

interface PromoBannerImageProps {
    src: GenericMedia;
    onMediaInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PromoBannerImage = (props: PromoBannerImageProps) => {
    const inputRef = React.createRef<HTMLInputElement>();
    const [media, setMedia] = React.useState<GenericMedia>({ name: '', type: '', size: 0, path: '' });

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
                let media = props.src;
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
    }, [props.src]);

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
            props.onMediaInput(e);
        }
    }

    const triggerInput = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
            inputRef.current.click();
        }
    }

    return (
        <PromoBannerImageContainer>
            <PromoBannerImageLabel>Banner Image</PromoBannerImageLabel>
            <PromoBannerImageRowContainer>
                {
                    media.path.length > 0 &&
                    <img src={media.path} alt="" />
                }
                <PromoBannerChangeButton
                    id="promobanner-changebanner-btn"
                    onClick={() => triggerInput()}
                >
                    <input 
                        type="file"
                        ref={inputRef} 
                        style={{ display: 'none', visibility: 'hidden'}} 
                        onChange={setImagePreview} 
                        accept="image/*"
                    />
                    <PromoBannerChangeButtonContent>
                        <PromoBannerChangeButtonIcon />
                        <PromoBannerChangeButtonLabel>{media.path ? 'Change Banner' : 'Add Banner' }</PromoBannerChangeButtonLabel>
                    </PromoBannerChangeButtonContent>
                </PromoBannerChangeButton>
            </PromoBannerImageRowContainer>
        </PromoBannerImageContainer>    
    )
}

export default PromoBannerImage;