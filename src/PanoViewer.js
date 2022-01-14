import React, { useEffect,useState } from "react";
import Marzipano, { RectilinearView } from "marzipano";
import { ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import room360 from './images/room360.jpg';
import './css/drag_points.css'
import $ from 'jquery';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CreateIcon from '@mui/icons-material/Create';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';

const PanoViewer = () => {

	const [scene,setScene] = useState(null);
	const [viewer,setViewer] = useState(null);
	const [hotspotReady,setHotspotReady] = useState(false);

	const [contextMenu, setContextMenu] = useState(null);

	const handleContextMenu = (event) => {
		event.preventDefault();
		setContextMenu(
		contextMenu === null
			? {
				mouseX: event.clientX - 2,
				mouseY: event.clientY - 4,
			}
			: // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
			// Other native context menus might behave different.
			// With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
			null,
		);
	};

	const handleClose = () => {
		setContextMenu(null);
	};

	const getHtmlString = (id) => {
		return `<div class="${id}_container" style="transform: translateX(411px) translateY(331.5px) translateX(-50%) translateY(-50%) perspective(649.8px) translateZ(649.8px) rotateZ(0rad) rotateX(-0.463172rad) rotateY(0.516191rad) rotateY(-0.414437rad) rotateX(0.0814841rad) translateZ(-500px); display: block; position: absolute;"><div class="img" id="${id}" style="transform: matrix3d(0.620812, -0.200743, 0, 0.00067799, -0.0261441, 0.458816, 0, 0.000114025, 0, 0, 1, 0, -58.8559, -135.987, 0, 1);"></div><div class="pt ${id} tl" style="left: -8.75781px; top: -0.00740814px;"></div><div class="pt ${id} tr" style="left: 346.014px; top: -13.9266px;"></div><div class="pt ${id} bl" style="top: 289.993px; left: -6.75781px;"></div><div class="pt ${id} br" style="left: 330.287px; top: 193.378px;"></div></div>`
	}

	const parseStringToHtml = (string) => {
		var parser = new DOMParser();
		return parser.parseFromString(string, "text/html").body.firstChild;
	}

	const createScene = (viewer) => {
		const source = Marzipano.ImageUrlSource.fromString(
			room360
		);
	
		const geometry = new Marzipano.EquirectGeometry([{ width: 4096 }]);
	
		const limiter = Marzipano.util.compose(
			Marzipano.RectilinearView.limit.vfov(0, 3),
			Marzipano.RectilinearView.limit.hfov(0, 3),
			Marzipano.RectilinearView.limit.pitch(-Math.PI / 2, Math.PI / 2)
		);
	
		const view = new Marzipano.RectilinearView(
			{
				yaw: 0,
				pitch: 0,
				fov: (100 * Math.PI) / 180
			},
			limiter
		);
	
		const scene = viewer.createScene({
			source: source,
			geometry: geometry,
			view: view,
			pinFirstLevel: true
		});
	
		return scene;
	}
	
	const createHotspot = (scene, hotspotElement) => {
		const hotspot = scene.hotspotContainer().createHotspot(hotspotElement, {
				yaw: 0,
				pitch: 0,
				// yaw: 0.41443682662942294, pitch: 0.08148413711388613
			},
			{ perspective: { radius: 500,
				 	// extraTransforms: "rotateX(5deg)" 
				}
			}
		);
	
		return hotspot;
	}
	
	const addDrag = (element, hotspot, viewer,id) => {
		let lastX, lastY;
		var container = $(`.${id}_container`);
		var img = $("#"+id);
		var pts = $("."+id);
		console.log({
			img,
			pts,
			filter:pts.filter(`tl`),
			container
		})

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
			// hotspot.setPerspective( {});

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
			// hotspot.setPerspective( { radius: 500, extraTransforms: "rotateX(5deg)" });

		}
	
		element.onmousedown = onMouseDown;

		var IMG_WIDTH = 512;
		var IMG_HEIGHT = 512;
  
		var transform = new window.PerspectiveTransform(img[0], IMG_WIDTH, IMG_HEIGHT, true);
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
			// console.log(container.offset())
			// return
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
	const createHotspotOnClick = (event,scene,viewer) => {
		event.preventDefault()
		let id = Math.random().toString(36).substring(7);
		// const hotspotElement = parseStringToHtml(getHtmlString(id));
		const hotspotElement = createNewHosSpotElement(id);
		// return
		// createNewHosSpotElement(id);
		const hotspot = createHotspot(scene, hotspotElement);
		addDrag(hotspotElement, hotspot, viewer,id);
	
		const x = contextMenu ? contextMenu.mouseX : event.clientX;
		const y = contextMenu ? contextMenu.mouseY : event.clientY; 

		hotspot.setPosition(viewer.view().screenToCoordinates({ x, y }));
		
	}

	const createNewHosSpotElement = (id) => {
		const element = document.createElement("div")
		element.classList.add(id+"_container") 

		const imgDiv = document.createElement("div")
		const tlDiv = document.createElement("div")
		const trDiv = document.createElement("div")
		const blDiv = document.createElement("div")
		const brDiv =  document.createElement("div")

		imgDiv.classList.add("img")
		imgDiv.id = id

		tlDiv.classList.add("pt",id,"tl")

		trDiv.classList.add("pt",id,"tr")
		trDiv.style = "left:512px"

		blDiv.classList.add("pt",id,"bl")
		blDiv.style = "top:512px"

		brDiv.classList.add("pt",id,"br")
		brDiv.style = "left:512px;top:512px"

		element.appendChild(imgDiv)
		element.appendChild(tlDiv)
		element.appendChild(trDiv)
		element.appendChild(blDiv)
		element.appendChild(brDiv)

		return element;
	}

	const handleCreateRectangle = (event,scene,viewer) => {
		if(!scene || !viewer) return;
		setContextMenu(null);
		createHotspotOnClick(event,scene,viewer)
		setHotspotReady(true)
	}

	useEffect(() => {
		const panoramaContainer = document.querySelector("#panorama-container");
		const viewer = new Marzipano.Viewer(panoramaContainer);
		const scene = createScene(viewer);
		setScene(scene)
		setViewer(viewer)

		scene.switchTo();
	}, []);

	useEffect(() => {
		if(!hotspotReady) return;
		console.log({viewer})
		
	},[hotspotReady,viewer])
	
	return (
		<div
			id="panorama-container"
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%"
			}}
			onContextMenu={handleContextMenu}
		>
			{/* <div id="hotspot" style={{
				background: "red",
				width: "100px",
				height: "100px",
				color: "white",
				resize: "both",
			}}>
				Hello world
			</div> */}
			
			<Menu
				open={contextMenu !== null}
				onClose={handleClose}
				anchorReference="anchorPosition"
				anchorPosition={
				contextMenu !== null
					? { top: contextMenu.mouseY, left: contextMenu.mouseX }
					: undefined
				}
			>
				<MenuItem onClick={(e) => handleCreateRectangle(e,scene,viewer)}>
					<ListItemIcon>
						<CreateIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText>Create Image Hotspot</ListItemText>
					{/* <Typography variant="body2" color="text.secondary">
						⌘X
					</Typography> */}
				</MenuItem>
				<MenuItem onClick={(e) => handleCreateRectangle(e,scene,viewer)}>
					<ListItemIcon>
						<SaveAltOutlinedIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText>Save</ListItemText>
				</MenuItem>
				{/* <MenuItem onClick={handleClose}>Print</MenuItem>
				<MenuItem onClick={handleClose}>Highlight</MenuItem>
				<MenuItem onClick={handleClose}>Email</MenuItem> */}
			</Menu>
		</div>
	);
};

export default PanoViewer;
