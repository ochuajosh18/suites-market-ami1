import React from 'react';
import { GenericMedia } from '../../store/system/types';
import {
    SymphonyMediaContainer,
    SymphonyMediaListContainer,
    SymphonyMediaItemContainer,
    SymphonyMediaAddContainer,
    SymphonyMediaListHeaderContainer,
    SymphonyMediaItemDecorationContainer,
    SymphonyMediaDeleteButton
} from './SymphonyCommonComponents';

// material
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import RemoveIcon from '@material-ui/icons/Remove';

import { SYMPHONY_PRIMARY_COLOR } from './Colors';

// util
import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';

interface SalesMediaInputProps {
    mediaList: Array<GenericMedia>;
    imageOnly?: boolean;
    imageOnlyHeader?: string;
    imageOnlyAddText?: string;
    onMediaInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onMediaDelete?: (path: string, fileName?: string) => void;
    accepts?: Array<string>;
    label?: string;
    isMultiple?: boolean;
}

const SalesMediaInput = (props: SalesMediaInputProps) => {
    const [media, setMedia] = React.useState<Array<GenericMedia>>([]);
    const inputRef = React.createRef<HTMLInputElement>();
    const { mediaList, imageOnly, imageOnlyHeader, imageOnlyAddText, accepts, label, isMultiple, onMediaInput, onMediaDelete } = props;
    const images = filter(media, (m) => m.type.indexOf('image') > -1);
    const videos = filter(media, (m) => m.type.indexOf('video') > -1);
    const brochures = filter(media, (m) => m.type.indexOf('pdf') > -1);

    const synchronousImageLoader = async (file: File) => {
        let r64 = await new Promise((resolve) => {
            const fileReader = new FileReader();
            fileReader.onload = (e) => resolve(fileReader.result);
            fileReader.readAsDataURL(file);
        });

        return r64;
    }
    
    // initialize local preview
    React.useEffect(() => {
        const load = async () => {
            try {
                let media = filter(mediaList, (m) => typeof m !== 'undefined');
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
    }, [mediaList]);
    const setImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            let shallAllow = true;
            for (const f of media) {
                if (f.file && f.file.name === files[0].name) shallAllow = false;
            }
            if (shallAllow) {
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
                    const newMedia = imageOnly ? [pMedia] : [...media, pMedia];
                    setMedia(newMedia);
                }
                onMediaInput(e);
            }
        }
    }

    const triggerInput = (toAccept: string) => {
        if (inputRef.current) {
            inputRef.current.accept = toAccept;
            inputRef.current.click();
        }
    }

    return (
        <SymphonyMediaContainer>
            <input 
                type="file"
                ref={inputRef} 
                style={{ display: 'none', visibility: 'hidden'}} 
                onChange={setImagePreview}
                onClick={(e) => { 
                    // @ts-ignore
                    e.currentTarget.value = null 
                }}
            />
            {label &&
                <Box fontSize="14px" color="#959595">
                    {label}
                </Box>
            }
            {/* Images */}
            {imageOnly ? 
                <>
                    <SymphonyMediaListHeaderContainer>{imageOnlyHeader}</SymphonyMediaListHeaderContainer>
                    <SymphonyMediaListContainer>
                        {map(images, (i) => (
                            <SymphonyMediaItemContainer className="single-media" key={i.path}>
                                <img className="symphony-media" src={i.path} alt="" />
                                {i.loading &&
                                    <Box 
                                        position="absolute" 
                                        left="0" 
                                        right="0" 
                                        top="0" 
                                        bottom="0" 
                                        display="flex" 
                                        justifyContent="center" 
                                        alignItems="center"
                                    >
                                        <CircularProgress style={{ color: '#4C89F4' }} />
                                    </Box>
                                }
                            </SymphonyMediaItemContainer>
                        ))}
                        <SymphonyMediaItemContainer 
                            className="add-media-card single" 
                            id="media-add-image"
                            onClick={() => triggerInput('image/*')}
                        >
                            <SymphonyMediaAddContainer>
                                <AddCircleIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />
                                {imageOnlyAddText || 'Add Photo'}
                            </SymphonyMediaAddContainer>
                        </SymphonyMediaItemContainer>
                    </SymphonyMediaListContainer>
                </>
            :
                <>
                    {((accepts && find(accepts, (e) => e.toLowerCase().indexOf('image') > -1 )) || !accepts) &&
                        <>
                            <SymphonyMediaListHeaderContainer>Photo{isMultiple ? 's' : ''}</SymphonyMediaListHeaderContainer>
                            <SymphonyMediaListContainer>
                                {map(images, (i) => (
                                    <SymphonyMediaItemContainer key={i.file ? i.file.name : i.path}>
                                        <img className="symphony-media" src={i.path} alt="" />
                                        {i.loading &&
                                            <Box 
                                                position="absolute" 
                                                left="0" 
                                                right="0" 
                                                top="0" 
                                                bottom="0" 
                                                display="flex" 
                                                justifyContent="center" 
                                                alignItems="center"
                                            >
                                                <CircularProgress style={{ color: '#4C89F4' }} />
                                            </Box>
                                        }
                                        <SymphonyMediaDeleteButton 
                                            id={`delete-media-${i.path.replace(/[/.]/g, '_')}`} 
                                            className="media-delete-btn"
                                            onClick={() => { onMediaDelete && onMediaDelete(i.path, i.file ? i.file.name : undefined) }}
                                        >
                                            <RemoveIcon />
                                        </SymphonyMediaDeleteButton>
                                    </SymphonyMediaItemContainer>
                                ))}
                                <SymphonyMediaItemContainer 
                                    className="add-media-card" 
                                    id="product-variant-add-image"
                                    onClick={() => triggerInput('image/*')}
                                >
                                    <SymphonyMediaAddContainer>
                                        <AddCircleIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />
                                        Add Photo
                                    </SymphonyMediaAddContainer>
                                </SymphonyMediaItemContainer>
                            </SymphonyMediaListContainer>
                        </>
                    }

                    {((accepts && find(accepts, (e) => e.toLowerCase().indexOf('video') > -1 )) || !accepts) &&
                        <>
                            {/* Videos */}
                            <SymphonyMediaListHeaderContainer>Video{isMultiple ? 's' : ''}</SymphonyMediaListHeaderContainer>
                            <SymphonyMediaListContainer>
                                {map(videos, (v) => (
                                    <SymphonyMediaItemContainer key={v.file ? v.file.name : v.path}>
                                        <SymphonyMediaItemDecorationContainer>
                                            <PlayCircleFilledIcon htmlColor="#FFF" />
                                        </SymphonyMediaItemDecorationContainer>
                                        <video className="symphony-media" src={v.path} controls={false} />
                                        <SymphonyMediaDeleteButton 
                                            id={`delete-media-${v.path.replace(/[/.]/g, '_')}`} 
                                            className="media-delete-btn"
                                            onClick={() => { onMediaDelete && onMediaDelete(v.path, v.file ? v.file.name : undefined) }}
                                        >
                                            <RemoveIcon />
                                        </SymphonyMediaDeleteButton>
                                    </SymphonyMediaItemContainer>
                                ))}
                                <SymphonyMediaItemContainer 
                                    className="add-media-card" 
                                    id="product-variant-add-video"
                                    onClick={() => triggerInput('video/mp4, video/m4v')}
                                >
                                    <SymphonyMediaAddContainer>
                                        <AddCircleIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />
                                        Add Video
                                    </SymphonyMediaAddContainer>
                                </SymphonyMediaItemContainer>
                            </SymphonyMediaListContainer>
                        </>
                    }
                    {((accepts && find(accepts, (e) => e.toLowerCase().indexOf('pdf') > -1 )) || !accepts) &&
                        <>
                            {/* Brochures */}
                            <SymphonyMediaListHeaderContainer>Brochure{isMultiple ? 's' : ''}</SymphonyMediaListHeaderContainer>
                            <SymphonyMediaListContainer>
                                {map(brochures, (b) => (
                                    <SymphonyMediaItemContainer key={b.file ? b.file.name : b.path}>
                                        <iframe className="symphony-media" 
                                            title={b.name} 
                                            src={`https://docs.google.com/gview?url=${b.path}&embedded=true&toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0`} 
                                        />
                                        <SymphonyMediaDeleteButton 
                                            id={`delete-media-${b.path.replace(/[/.]/g, '_')}`} 
                                            className="media-delete-btn"
                                            onClick={() => { onMediaDelete && onMediaDelete(b.path, b.file ? b.file.name : undefined) }}
                                        >
                                            <RemoveIcon />
                                        </SymphonyMediaDeleteButton>
                                    </SymphonyMediaItemContainer>
                                ))}
                                <SymphonyMediaItemContainer 
                                    className="add-media-card" id="product-variant-add-brochure"
                                    onClick={() => triggerInput('application/pdf')}
                                >
                                    <SymphonyMediaAddContainer>
                                        <AddCircleIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />
                                        Add File
                                    </SymphonyMediaAddContainer>
                                </SymphonyMediaItemContainer>
                            </SymphonyMediaListContainer>
                        </>
                    }
                </>
            }
        </SymphonyMediaContainer>
    )
}

export default SalesMediaInput;