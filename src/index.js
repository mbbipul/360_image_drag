import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import PanoViewer from "./PanoViewer";

function App() {
  return (
    <div className="App">
      <PanoViewer />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

//github.com/google/marzipano/blob/master/demos/embedded-hotspots/index.js