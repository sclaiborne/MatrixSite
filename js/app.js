// import * as math from './math.js';
// import * as mat from './mat.js';

function convert() {
    const inputElements = document.getElementsByClassName("input");
    const outputElement = document.getElementsByClassName("output");

    var matrix = inputElements[0]?.matrix;

    console.log("Matrix: ", matrix);

    for (let i = 0; i < outputElement.length; i++) {
        if(outputElement[i]?.matrix) {
            outputElement[i].matrix = matrix;
        }
        else {
            console.warn("Element does not have a matrix property", outputElement[i]);
        }
    }

}