import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

// Material UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

// LocalComponents
import { BannerCardContainer } from './PromoBannerCommonComponents';

// Utils
import moment from 'moment';

interface BannerCardProps {
    image: string;
    name: string;
    subTitle: string;
    startDate: string;
    endDate: string;
    bannerNumber: number;
}

export default (props: BannerCardProps) => {
    const [bannerType, setBannerType] = useState<'Published' | 'Scheduled' | 'Expired'>('Scheduled');
    
    useEffect(() => {
        const start = moment(props.startDate, 'YYYY-MM-DD');
        const end = moment(props.endDate, 'YYYY-MM-DD');
        const currentDate = moment().format('YYYY-MM-DD');

        const bannerType = moment(start).isAfter(currentDate) ? 'Scheduled' : moment().isBetween(start, end) ? 'Published' : moment(start).isSame(currentDate) ? 'Published' : 'Expired';
        setBannerType(bannerType)

        if (!props.startDate && !props.endDate) {
            setBannerType('Published')
        }

    }, [props.startDate, props.endDate])
    
    return (
        <Link id="nav-home" to={`/market/promobanner/${props.bannerNumber}`} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%', height: '100%', textDecoration: 'none', color: '#000' }} onClick={() => {}}>
            <BannerCardContainer   
                id={`promobanner-bannercard-${props.bannerNumber}`}
            >
                <Box style={{ height: '50%', width: '100%' }}>
                    <img src={props.image} alt={props.name} style={{ height: '100%', width: '100%', objectFit: 'cover', filter: 'brightness(75%)', borderTopRightRadius: 4, borderTopLeftRadius: 4 }} />
                </Box>
                <Box style={{ height: '50%', width: '100%' }}>
                    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', justifyContent: 'space-evenly' }}>
                        <Box style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20, paddingTop: 10 }}>
                            <Box style= {{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', flexWrap: 'nowrap' }}>
                                <Box style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                                    <Typography style={{ fontSize: 14, fontWeight: 600 }} noWrap>{props.name}</Typography>
                                    <Typography style={{ fontSize: 12, opacity: 0.5 }} noWrap>{props.subTitle}</Typography>
                                </Box>
                                <Box 
                                    style={{ 
                                        backgroundColor: bannerType === 'Published' ? '#C1F7DF' : bannerType === 'Scheduled' ? '#DEE9FF'  : '#f58c8c', 
                                        height: 25, 
                                        paddingLeft: 15,
                                        paddingRight: 15,
                                        borderRadius: 12,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                    <Typography style={{ fontSize: 10, color: bannerType === 'Published' ? '#00AD4C' : bannerType === 'Scheduled' ? '#4C89F5'  : '#f52f2f', fontWeight: 'bold' }}>{bannerType.toUpperCase()}</Typography>
                                </Box>
                            </Box>
                            {
                                props.startDate && props.endDate ?
                                <Box style={{ display: 'flex', flex: .5, flexDirection: 'row', width: '100%', flexWrap: 'nowrap' }}>
                                    <Typography style={{ fontSize: 12, opacity: 0.5 }}>{props.startDate}</Typography>
                                    <Typography style={{ fontSize: 12, opacity: 0.5, marginLeft: 3, marginRight: 3 }}>-</Typography>
                                    <Typography style={{ fontSize: 12, opacity: 0.5 }}>{props.endDate}</Typography>
                                </Box>
                                :
                                <Box style={{ display: 'flex', flex: .5, flexDirection: 'row', width: '100%', flexWrap: 'nowrap' }}>
                                    <Typography style={{ fontSize: 12, opacity: 0.5 }}>No Expiration</Typography>
                                </Box>
                            }
                        </Box>
                    </Box>
                </Box>
            </BannerCardContainer>
        </Link>
    )
}