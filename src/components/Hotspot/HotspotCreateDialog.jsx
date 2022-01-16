import React,{ useState, useEffect } from 'react';
import { 
    Box,
    Grid,
    Button, 
    Dialog,
    DialogActions, 
    DialogContent, 
    DialogContentText,
    DialogTitle,
    Chip
} from '@mui/material';

import {
    AddPhotoAlternateOutlined, 
    AudiotrackOutlined,
    FeaturedVideoOutlined,
    HtmlOutlined,
    TextFieldsOutlined
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import ImageHotspot from './ImageHotspot';

const useStyles = makeStyles(theme => ({
    root: {
    },
    hotspotTypeBox: {
        margin: 30,
        marginLeft:50
    }
}));

const HotspotCreateDialog = (props) => {
    const classes = useStyles();
    const [open, setOpen] = useState(props.open || false);
    const [openHotspots, setOpenHotspots] = useState({
        image: false,
        audio: false,
        video: false,
        text: false,
        html: false
    });

    const openHotSpotDialogs = () => {
    }

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    const handleClose = () => {
        setOpen(false);
        if (props.onClose) props.onClose();
    };

    const hotspotTypes = [
        {
            title: 'Image hotspot',
            icon: <AddPhotoAlternateOutlined />,
            onClick: () => {
                handleClose();
                setOpenHotspots({
                    ...openHotspots,
                    image: true
                });
            }
        },
        {
            title: 'Text hotspot',
            icon: <TextFieldsOutlined />,
        },
        {
            title: 'Video hotspot',
            icon: <FeaturedVideoOutlined />,
        },
        {
            title: 'Audio hotspot',
            icon: <AudiotrackOutlined />,
        },
        {
            title: 'Custom hotspot',
            icon: <HtmlOutlined />,
        }
    ]
    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Add Hotspot
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To add a hotspot,select the hotspot type and click on the hotspot.
                    </DialogContentText>
                    <Box className={classes.hotspotTypeBox}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            spacing={1}
                        >
                            {
                                hotspotTypes.map((hotspotType, index) => {
                                    return (
                                        <Grid item key={"hotspot_type_"+index}>
                                            <Chip
                                                onClick={hotspotType.onClick}
                                                icon={hotspotType.icon}
                                                label={hotspotType.title}
                                            />
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <ImageHotspot 
                open={openHotspots.image} 
                onClose={() =>  setOpenHotspots({
                    ...openHotspots,
                    image: false
                })}/>
        </>
    );
}

export default HotspotCreateDialog;
