import { useState, useEffect } from 'react';
const HOTSPOT_TYPES = {
    Image: "Image",
    Video: "Video",
    Audio: "Audio",
    Text: "Text",
    Custom: "Custom"
}
function useHotspot() {
    const hotspots = () => {
        let hotspots = JSON.parse(localStorage.getItem("hotspots"))
        return hotspots
    }
    const saveHotSpot  = (hotspot,type) => {
        let hotspots = JSON.parse(localStorage.getItem("hotspots"));
        if(!hotspots){
            hotspots = {}
            hotspots[type] = [hotspot]
        }else{
            if(type in hotspots){
                hotspots[type].push(hotspot)
            }else{
                hotspots[type] = [hotspot]
            }
        }
        localStorage.setItem("hotspots",JSON.stringify(hotspots))
    }
    return [hotspots,saveHotSpot]
}

export {useHotspot,HOTSPOT_TYPES};