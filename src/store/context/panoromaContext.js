import { createContext } from "react";

const PanoromaContext = createContext({
    viewer : null,
    scene : null,
});

export {
    PanoromaContext
}