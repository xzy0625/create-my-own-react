// import React from "react";
// import ReactDOM from "react-dom";

import React from "./react/react";
import ReactDOM from './react/react-dom';

const style = {
  color: 'red',
  border: "red solid 1px",
  width: '300px'
};

const element = (
  <div id="A" style={style}>
    A1
    <div id="B1" style={style}>
      B1
      <div id="C1" style={style}>
        C1
      </div>
      <div id="C2" style={style}>
        C2
      </div>
    </div>
    <div id="B2" style={style}>
      B2
    </div>
  </div>
);

console.log(element, 'element66')

ReactDOM.render(element, document.getElementById("root"));
