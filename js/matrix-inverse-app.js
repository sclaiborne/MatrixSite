document.addEventListener("DOMContentLoaded", function() {
    // Your code here
    // This function will be called when the document is ready
    setup();
});

function setup() {
    const inputElements = document.getElementsByClassName("input");

    for (let i = 0; i < inputElements.length; i++) {
        inputElements[i].addEventListener("change", convertCB);
    }
}

function convertCB(){
    var matrix = this.matrix.clone();
    matrix.invert();
    set_outputs(matrix);
}

function set_outputs(matrix) {
    const outputElement = document.getElementsByClassName("output");

    for (let i = 0; i < outputElement.length; i++) {
        if(outputElement[i]?.matrix) {
            outputElement[i].matrix = matrix;
        }
        else {
            console.warn("Element does not have a matrix property", outputElement[i]);
        }
    }

}

function chunk(arr, size) {
    for(var chunks=[], i=0; i<arr.length; i+=size)
        chunks.push(arr.slice(i, i+size));
    return chunks;
}

function copyOutputId(id, transpose=true) {
    const outputElement = document.getElementById(id);
    matrix = outputElement.matrix.clone();
    if(transpose) {
        matrix.transpose();
    }
    const text = chunk(matrix.toArray(), 4).map(row => row.join("\t")).join("\n");
    navigator.clipboard.writeText(text).then(function() {
        console.log("Copied to clipboard");
    }, function(err) {
        console.error("Failed to copy to clipboard", err);
    });
}