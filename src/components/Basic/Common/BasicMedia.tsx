import React from 'react';
import { BasicProductMedia } from '../../../store/basicproduct/types';
import { MediaInputType } from '../../../store/system/types';
import GridList from '@material-ui/core/GridList';
import { 
    MediaTile, 
    MediaTileAddBox, 
    MediaTileAddIcon, 
    MediaTileCover, 
    MediaTileIcon, 
    MediaTileLabelBox 
} from './BasicCommonComponents';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import map from 'lodash/map';

interface BasicMediaProps {
    media: Array<BasicProductMedia>;
    mediaType?: 'IMAGE' | 'VIDEO' | 'PDF' | 'ALL';
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>  void;
    mediaClick?: (media: MediaInputType) => void;
    label?: string;
    disableMediaLabel?: boolean;
}

export default (props: BasicMediaProps) => {
    const inputRef = React.createRef<HTMLInputElement>();
    React.useEffect(() => {}, [props.media]);
    let accept = props.mediaType === 'IMAGE' ? 'image/*' : 'video/mp4, video/m4v';
    accept = props.mediaType === 'PDF' ? 'application/pdf' : accept;
    accept = props.mediaType === 'ALL' ? 'image/*,video/mp4,video/m4v,application/pdf,.doc,.docx' : accept;
    const mediaClick = (media: MediaInputType) => {
        if (props.mediaClick) {
            props.mediaClick(media)
        }
    }
    return (
        <>
            <input 
                type="file"
                accept={accept}
                ref={inputRef} 
                style={{ display: 'none', visibility: 'hidden'}} onChange={props.onChange} 
            />
            <GridList>
                <MediaTile key="Media Add Key" cols={1}>
                    <MediaTileAddBox
                        onClick={() => {
                            if (inputRef.current) {
                                inputRef.current.click();
                            }
                        }}
                    >
                        <MediaTileAddIcon fontSize="large" />
                        {props.label}
                    </MediaTileAddBox>
                </MediaTile>
                {map(props.media, (media) => {
                    return (
                        <MediaTile key={media.id} cols={1}>
                            {media.loading ?
                                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                                    <CircularProgress />
                                </Box>
                            :
                                <>
                                    {media.type.indexOf('image') > -1 &&
                                        <img onClick={() => { mediaClick(media) }} style={{ cursor: 'pointer' }} src={media.path} alt={media.id} />
                                    }
                                    {media.type.indexOf('video') > -1 &&
                                        <video controls={false} preload="metadata" style={{ maxWidth: 115 }}>
                                            <source src={`${media.path}#t=1`} type={media.type} />
                                        </video>
                                    }
                                    {media.type.indexOf('pdf') > -1 &&
                                        <iframe onClick={() => { mediaClick(media) }} title={media.name} src={`https://docs.google.com/gview?url=${media.path}&embedded=true&toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0`} style={{ height: 150, width: 120 }} ></iframe>
                                    }
                                </>
                            }
                            {props.mediaType && (props.mediaType === 'VIDEO' || props.mediaType === 'PDF') &&
                                <MediaTileCover onClick={() => { mediaClick(media) }}>
                                    {props.mediaType === 'VIDEO' ? 
                                        <MediaTileIcon />
                                        :
                                        <></>
                                    }
                                    
                                </MediaTileCover>
                            }
                            {!props.disableMediaLabel &&
                                <MediaTileLabelBox>
                                    {media.name}
                                </MediaTileLabelBox>
                            }
                        </MediaTile>
                    )
                })}
            </GridList>
        </>
    )
}