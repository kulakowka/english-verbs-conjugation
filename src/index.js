import React from "react";
import ReactDOM from "react-dom";
import Conjugation from "./components/Conjugation/Conjugation";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";

ReactDOM.render(<Conjugation />, document.getElementById("root"));
registerServiceWorker();
