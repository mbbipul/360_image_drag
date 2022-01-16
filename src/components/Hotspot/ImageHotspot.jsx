import {
    Box,
    Grid,
    Button, 
    Dialog,
    DialogActions, 
    DialogContent, 
    DialogContentText,
    DialogTitle,
    Chip,
    Typography,
    TextField,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Slider,
} from '@mui/material';
import { makeStyles, styled } from '@mui/styles';
import React,{ useContext, useEffect,useState,useRef } from 'react';
import {useHotspot,HOTSPOT_TYPES} from '../../hooks/hotspots';
import defaultHotspotImage from '../../images/default_hotspot_image.jpg';
import { PanoromaContext } from '../../store/context/panoromaContext';
import $ from 'jquery';
import ReactDOM from "react-dom";

const Input = styled('input')({
    display: 'none',
});

const useStyles = makeStyles(theme => ({
    contentBox: {
        margin: 30
    },
    hotspotCard: {
        borderRadius: 10,
    }
}));

const ImageHotspotCard = ({image,name,actionUrl,description}) => {
    const classes = useStyles();
    const openLink = ()=>{
        if(actionUrl){
            window.open(actionUrl, '_blank');
        }
    }
    return (
        <Card 
            className={classes.hotspotCard}
            sx={{ maxWidth: 300 }}
            >
            <CardMedia
                component="img"
                alt={name}
                height="140"
                image={image}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {
                        name
                    }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {
                        description
                    }
                </Typography>
            </CardContent>
            <CardActions>
                <Button 
                    size="small" 
                    onClick={openLink}
                >Learn More</Button>
            </CardActions>
        </Card>
    )
}
const ImageHotspot = (props) => {

    const classes = useStyles();

    const [open, setOpen] = useState(props.open || false);
    const [image, setImage] = useState('');
    const [uploading, setUploading] = useState(false)
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [actionUrl, setActionUrl] = useState('');
    const [hotspots,saveHotSpot] = useHotspot()
    const hotspotCardRef = useRef(null);

    const [cardSize, setCardSize] = useState({
        width: 300,
        height: 300
    });

    const {viewer,scene} = useContext(PanoromaContext);



    const handleClose = () => {
        setOpen(false);
        if (props.onClose) props.onClose();
    };
    const createNewHosSpotElement = (id,width,height) => {

		const element = document.createElement("div")
		element.classList.add(id+"_container") 

		const imgDiv = document.createElement("div")
		const tlDiv = document.createElement("div")
		const trDiv = document.createElement("div")
		const blDiv = document.createElement("div")
		const brDiv =  document.createElement("div")

		imgDiv.id = id
        
        imgDiv.style.width = width+"px";
        imgDiv.style.height = height+"px";
        imgDiv.style.position = "absolute";
        imgDiv.style.cursor = "move";

		tlDiv.classList.add("pt",id,"tl")

		trDiv.classList.add("pt",id,"tr")
		trDiv.style = `left:${width}px`

		blDiv.classList.add("pt",id,"bl")
		blDiv.style = `top:${height}px`

		brDiv.classList.add("pt",id,"br")
		brDiv.style = `left:${width}px;top:${height}px`

        element.appendChild(imgDiv)
		element.appendChild(tlDiv)
		element.appendChild(trDiv)
		element.appendChild(blDiv)
		element.appendChild(brDiv)
        ReactDOM.render(<ImageHotspotCard image={image} name={name} actionUrl={actionUrl} description={description}/>,imgDiv)

		return element;
	}

    const createHotspot = (position,scene,viewer) => {
		let id = Math.random().toString(36).substring(7);
        let _width = 500;
        let _height = 500;
        if(hotspotCardRef.current){
            let {
                width,
                height,
            } = hotspotCardRef.current.getBoundingClientRect();
            _width = width
            _height = height
        }
		const hotspotElement = createNewHosSpotElement(id,_width,_height);

		const hotspot = scene.hotspotContainer().createHotspot(hotspotElement, position,
            { 
                perspective: { 
                    radius: 1000,
                    // extraTransforms: "rotateX(5deg)" 
                }
            }
        );
		addDrag(hotspotElement, hotspot, viewer,id,_width,_height);
	}

	const addDrag = (element, hotspot, viewer,id,_WIDTH,_HEIGHT) => {
		let lastX, lastY;
		var container = $(`.${id}_container`);
		var img = $("#"+id);
		var pts = $("."+id);

		function onDragMouseDown (e) {
			viewer.controls().disable();
			element.onmousedown = null;
  
			target = $(this);
			targetPoint = target.hasClass("tl") ? transform.topLeft : target.hasClass("tr") ? transform.topRight : target.hasClass("bl") ? transform.bottomLeft : transform.bottomRight;
			onMouseMoveQ.apply(this, Array.prototype.slice.call(arguments));
			$(window).on("mousemove",onMouseMoveQ);
			$(window).on("mouseup",function() {
				$(window).off('mousemove', onMouseMoveQ);
				element.onmousedown = onMouseDown;
				viewer.controls().enable();
			})
		}

		const onMouseDown = (event) => {
			lastX = event.x;
			lastY = event.y;
			pts.off("mousedown");
			viewer.controls().disable();
	
			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);
		}
	
		const onMouseMove = (event) => {
			const {
				x: offsetX,
				y: offsetY
			} = viewer.domElement().getBoundingClientRect();
			const { x: elementX, y: elementY } = element.getBoundingClientRect();
			const deltaX = event.x - lastX;
			const deltaY = event.y - lastY;
			const x = deltaX + elementX - offsetX;
			const y = deltaY + elementY - offsetY;
			lastX = event.x;
			lastY = event.y;
			hotspot.setPosition(viewer.view().screenToCoordinates({ x, y }));

		}
	
		const onMouseUp = () => {
			viewer.controls().enable();
			console.info("Hotspot position", hotspot.position());
	
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
			pts.on("mousedown", onDragMouseDown);
		}
	
		element.onmousedown = onMouseDown;
  
		var transform = new window.PerspectiveTransform(img[0], _WIDTH, _HEIGHT, true);
		var tl = pts.filter(`tl`).css({
			left : transform.topLeft.x,
			top : transform.topLeft.y
		});
		var tr = pts.filter(`tr`).css({
			left : transform.topRight.x,
			top : transform.topRight.y
		});
		var bl = pts.filter(`bl`).css({
			left : transform.bottomLeft.x,
			top : transform.bottomLeft.y
		});
		var br = pts.filter(`br`).css({
			left : transform.bottomRight.x,
			top : transform.bottomRight.y
		});
		var target;
		var targetPoint;
  
		function onMouseMoveQ(e) {
			targetPoint.x = e.pageX - container.offset().left - 20;
			targetPoint.y = e.pageY - container.offset().top - 20;
			target.css({
				left : targetPoint.x,
				top : targetPoint.y
			});
			
			// check the polygon error, if it's 0, which mean there is no error
			if(transform.checkError()===0){
				transform.update();
				img.show();
			}else{
				img.hide();
			}
		}
		
		pts.on("mousedown", onDragMouseDown);
	}

    const handleUploadImages = (e)=>{
        const files = e.target.files
        const image = files[0]
        imageUploader(image)
    }

    function blobToDataURL(blob, callback) {
        var fileReader = new FileReader();
        fileReader.onload = function(e) {callback(e.target.result);}
        fileReader.readAsDataURL(blob);
    }

    const imageUploader = async (file)=>{
        try {
            setUploading(true)
            // const formData = new FormData()
            // formData.append("images", file)
            // const result = await axios.post(process.env.REACT_APP_BASE_URL+"admin_api/upload-images",
            //     formData, {headers:multiPartheaders} 
            // )
            // if(result.data.images && result.data.images.length > 0){
            //     setImage(result.data.images[0])
            // }
            blobToDataURL(file,(url) => {
                setImage(url)
            })
            setUploading(false)
        } catch (error) {
            
            setUploading(false)
        }

    }

    const openLink = ()=>{
        if(actionUrl){
            window.open(actionUrl, '_blank');
        }
    }

    const validateAddHotspot = ()=>{
        if(!image){
            alert("Please upload an image")
            return false
        }
        if(!name){
            alert("Please enter a name")
            return false
        }
        if(!description){
            alert("Please enter a description")
            return false
        }
        if(!actionUrl){
            alert("Please enter an action url")
            return false
        }
        return true
    }

    const handleAddHotspot = ()=>{
        if(validateAddHotspot()){
            const hotspot = {
                name,
                description,
                actionUrl,
                image,
            }
            saveHotSpot(hotspot,HOTSPOT_TYPES.Image)
            if(viewer && scene){
                const position = {
                    yaw : viewer.view().yaw(),
                    pitch : viewer.view().pitch(),
                }
                createHotspot(position,scene,viewer)
            }
        }
        
    }

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    
    return (
        <Box>
             <Dialog 
                open={open} 
                onClose={handleClose}
                fullWidth
                maxWidth="md">
                <DialogTitle>
                    Add Image Hotspot
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Image Hotspot is a hotspot that has an image , title , description and action url.
                    </DialogContentText>
                    <Box
                        className={classes.contentBox}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            spacing={2}
                        >
                            <Grid item md={7}>
                                <Grid 
                                    container
                                    direction="row"
                                    justifyContent="flex-start"
                                    alignItems="flex-start"
                                    spacing={0}
                                >
                                    <Grid item md={4}>
                                        <label htmlFor={"contained-button-file"}>
                                            <Input accept="image/*" id={"contained-button-file"} multiple type="file" onChange={handleUploadImages}/>
                                            <Button variant="outlined" color="primary" component="span">
                                                Upload Image
                                            </Button>
                                        </label>
                                    </Grid>
                                    <Grid item md={8}>
                                        <TextField
                                            variant="outlined"
                                            label="Image URL"
                                            fullWidth
                                            size='small'
                                            value={image}
                                            InputLabelProps={{ shrink: true }}
                                            onChange={(e)=>{setImage(e.target.value)}}
                                        />
                                    </Grid>
                                    <TextField
                                        variant="outlined"
                                        label="Hotspot Name"
                                        fullWidth
                                        size='small'
                                        margin="dense"
                                        value={name}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e)=>{setName(e.target.value)}}
                                    />
                                    <TextField
                                        variant="outlined"
                                        label="Hotspot Description"
                                        fullWidth
                                        size='small'
                                        multiline
                                        rows={4}
                                        margin="dense"
                                        value={description}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e)=>{setDescription(e.target.value)}}
                                    />
                                    <TextField
                                        variant="outlined"
                                        label="Action URL"
                                        fullWidth
                                        size='small'
                                        margin="dense"
                                        value={actionUrl}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e)=>{setActionUrl(e.target.value)}}
                                    />
                                    <Slider
                                        defaultValue={300}
                                        // getAriaValueText={valuetext}
                                        valueLabelDisplay="auto"
                                        // step={10}
                                        // marks
                                        min={300}
                                        max={800}
                                        onChange={(e,value)=>{setCardSize({
                                            ...cardSize,
                                            width : value
                                        })}}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item md={5}>
                                <Box
                                    style={{
                                        margin: 10,
                                    }}
                                    component="center"
                                >
                                    <Chip
                                        label="Live Preview"
                                        color="primary"
                                        variant="contained"
                                        />
                                </Box>
                                <Card 
                                    ref={hotspotCardRef}
                                    // style={{
                                    //     width: cardSize.width,
                                    // }}
                                    className={classes.hotspotCard}>
                                    <CardMedia
                                        component="img"
                                        alt={name}
                                        height="140"
                                        image={image || defaultHotspotImage}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {
                                                name === "" ? "Hotspot Name" : name
                                            }
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {
                                                description === "" ? "Hotspot Description" : description
                                            }
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button 
                                            size="small" 
                                            onClick={openLink}
                                        >Learn More</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleClose}
                        variant='contained'
                        color='secondary'>
                        Close
                    </Button>
                    <Button 
                        variant='contained'
                        color='primary'
                        onClick={handleAddHotspot} >
                        Add Hotspot
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ImageHotspot;