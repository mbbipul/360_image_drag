import React, { useEffect } from "react";
import Marzipano from "marzipano";

function createScene(viewer) {
  const source = Marzipano.ImageUrlSource.fromString(
    "http://www.marzipano.net/media/equirect/angra.jpg"
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

function createHotspot(scene, hotspotElement) {
  const hotspot = scene.hotspotContainer().createHotspot(hotspotElement, {
    yaw: 0,
    pitch: 0
  });

  return hotspot;
}

function addDrag(element, hotspot, viewer) {
  let lastX, lastY;

  function onMouseDown(event) {
    lastX = event.x;
    lastY = event.y;

    viewer.controls().disable();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(event) {
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

  function onMouseUp() {
    viewer.controls().enable();
    console.info("Hotspot position", hotspot.position());

    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }

  element.onmousedown = onMouseDown;
}

const PanoViewer = () => {
  useEffect(() => {
    const panoramaContainer = document.querySelector("#panorama-container");
    const hotspotElement = document.querySelector("#hotspot");

    const viewer = new Marzipano.Viewer(panoramaContainer);
    const scene = createScene(viewer);
    const hotspot = createHotspot(scene, hotspotElement);
    addDrag(hotspotElement, hotspot, viewer);

    scene.switchTo();
  }, []);
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
    >
      <div id="hotspot">Drag me</div>
    </div>
  );
};

export default PanoViewer;
