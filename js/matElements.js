import * as three from "./three-math-only.module.js";

class angleTypeSelect extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                select {
                    width: 100%;
                    padding: 5px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    min-width: 60px;
                }
            </style>
            <select>
                <option value="XYZ" selected>XYZ</option>
                <option value="XZY">XZY</option>
                <option value="YXZ">YXZ</option>
                <option value="YZX">YZX</option>
                <option value="ZXY">ZXY</option>
                <option value="ZYX">ZYX</option>
            </select>
        `;
        this.select = this.shadowRoot.querySelector("select");
        this.select.addEventListener("change", (e) => {
            this.dispatchEvent(new Event("change", e));
        });
    }
    get value() {
        return this.select.value;
    }
    set value(val) {
        this.select.value = val;
    }
}



class MatrixElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .matrix {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    grid-gap: 10px;
                }
                input {
                    min-width: 50px;
                    padding: 5px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                input:invalid {
                    background: orange;
                }
            </style>
            <div>
                <slot></slot>
                <div class="matrix"></div>
            </div>
        `;
        this._create_html();
        this.matrix = new three.Matrix4().identity();
    }
    set matrix(matrix) {
        this._matrix = matrix;
        this._set_html();
        this.dispatchEvent(new Event("change"));
    }
    get matrix() {
        return this._matrix;
    }
    static matrix4RowColumn(matrix, row, column) {
        return matrix.elements[row + column * 4];
    }
    _create_html() {
        var str = "";
        var standardPattern = "[0-9]+\.?[0-9]*";
        var bottomPatternZero = "[0]+\.?[0]*";
        var bottomPatternOne = "[1]+\.?[0]*";
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if(i == 3) {
                    if(j == 3) {
                        str += `<input data-matrix='${i}${j}' required pattern="${bottomPatternOne}" value="1">\n`;
                    } else {
                        str += `<input data-matrix='${i}${j}' required pattern="${bottomPatternZero}" value="0">\n`;
                    }
                }
                else {
                    str += `<input data-matrix='${i}${j}' required pattern="${standardPattern}" value="0">\n`;
                }
            }
        }
        this.shadowRoot.querySelector(".matrix").innerHTML = str;
        this.shadowRoot.querySelectorAll("input").forEach((input) => {
            var _this = this;
            var mode = "column"; // "column" or "row"
            input.addEventListener("blur", (e) => {
                var cells = input.value.split(/[\t\n, ]+/);
                if(cells.length == 1)
                    cells = input.value.split("\t")
                
                // TODO: This should instead use matrix from array and swap row columns if needed 
                if(cells.length > 1) {
                    console.log("matrix paste detected")
                    var rowCol = input.getAttribute("data-matrix")
                    var row = rowCol[0]
                    var col = rowCol[1]
                    for (var i = 0; i < cells.length; i++) {
                        _this._matrix.elements[row + col * 4] = Number(cells[i].trim());
                        if(mode == "column") {
                            col++;
                            if(col > 3) {
                                col = 0;
                                row++;
                            }
                            if(row > 3) {
                                row = 0;
                                console.warn("Matrix is full");
                            }
                        } else {
                            row++;
                            if(row > 3) {
                                row = 0;
                                col++;
                            }
                            if(col > 3) {
                                col = 0;
                                console.warn("Matrix is full");
                            }
                        }
                    }
                    this._set_html();
                }


                this.matrix = this._get_html();
                this.dispatchEvent(new Event("change", e));
            });
            // setTimeout(function() {
            //     var cells = input.value.split(",")
            //     if(cells.length == 1)
            //         cells = input.value.split("\t")
                
            //     if(cells.length > 1) {
            //         console.log("matrix paste detected")
            //         var rowCol = input.getAtrribute("data-matrix")
            //         var row = rowCol[0]
            //         var col = rowCol[1]
            //         for (var i = 0; i < cells.length; i++) {
            //             _this._matrix.elements[row + col * 4] = cells[i];
            //             if(mode == "column") {
            //                 col++;
            //                 if(col > 3) {
            //                     col = 0;
            //                     row++;
            //                 }
            //                 if(row > 3) {
            //                     row = 0;
            //                     console.warn("Matrix is full");
            //                 }
            //             } else {
            //                 row++;
            //                 if(row > 3) {
            //                     row = 0;
            //                     col++;
            //                 }
            //                 if(col > 3) {
            //                     col = 0;
            //                     console.warn("Matrix is full");
            //                 }
            //             }
            //         }
            //     }
            // }, 0);
        });
    }
    _set_html() {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                this.shadowRoot.querySelector(`input[data-matrix='${i}${j}']`).value = MatrixElement.matrix4RowColumn(this.matrix, i, j).toFixed(2);
            }
        }
    }
    _get_html() {
        return this.matrix.fromArray([
            Number(this.shadowRoot.querySelector("[data-matrix='00']").value), Number(this.shadowRoot.querySelector("[data-matrix='10']").value), Number(this.shadowRoot.querySelector("[data-matrix='20']").value), Number(this.shadowRoot.querySelector("[data-matrix='30']").value),
            Number(this.shadowRoot.querySelector("[data-matrix='01']").value), Number(this.shadowRoot.querySelector("[data-matrix='11']").value), Number(this.shadowRoot.querySelector("[data-matrix='21']").value), Number(this.shadowRoot.querySelector("[data-matrix='31']").value),
            Number(this.shadowRoot.querySelector("[data-matrix='02']").value), Number(this.shadowRoot.querySelector("[data-matrix='12']").value), Number(this.shadowRoot.querySelector("[data-matrix='22']").value), Number(this.shadowRoot.querySelector("[data-matrix='32']").value),
            Number(this.shadowRoot.querySelector("[data-matrix='03']").value), Number(this.shadowRoot.querySelector("[data-matrix='13']").value), Number(this.shadowRoot.querySelector("[data-matrix='23']").value), Number(this.shadowRoot.querySelector("[data-matrix='33']").value)
        ]);
    }
}

class EulerTranslationElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .euler {
                    display: grid;
                    grid-template-columns: 75px repeat(6, 1fr);
                    grid-gap: 10px;
                }
                input {
                    min-width: 50px;
                    padding: 5px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
            </style>
            <div>
                <slot></slot>
                <div class="euler">
                    <angle-type-select></angle-type-select>
                    <input data-euler='0' value="0">
                    <input data-euler='1' value="0">
                    <input data-euler='2' value="0">
                    <input data-euler='3' value="0">
                    <input data-euler='4' value="0">
                    <input data-euler='5' value="0">
                </div>
            </div>
        `;
        this._angleType = this.shadowRoot?.querySelector("angle-type-select")
        if(!this._angleType) {
            console.error("angle-type-select not found");
            throw new Error("angle-type-select not found");
        }
        this.angle_type = this.getAttribute("angle-type") || "XYZ";
        
        this._angleType.addEventListener("change", (e) => {
            console.log("Changing angle type to: " + this.angle_type);
            this._set_html();
        });
        this.shadowRoot?.querySelectorAll("input[data-euler]").forEach((input) => {
            input.addEventListener("input", (e) => {
                this._get_html();
                this.dispatchEvent(new Event("change", e));
            });
        });
        this._x = this.shadowRoot?.querySelector("[data-euler='0']");
        this._y = this.shadowRoot?.querySelector("[data-euler='1']");
        this._z = this.shadowRoot?.querySelector("[data-euler='2']");
        this._a = this.shadowRoot?.querySelector("[data-euler='3']");
        this._b = this.shadowRoot?.querySelector("[data-euler='4']");
        this._c = this.shadowRoot?.querySelector("[data-euler='5']");
        this.matrix = new three.Matrix4().identity();
    }
    set matrix(matrix) {
        this._matrix = matrix;
        this._set_html();
        this.dispatchEvent(new Event("change"));
    }
    get matrix() {
        return this._matrix;
    }
    set angle_type(val) {
        this.setAttribute("angle-type", val);
        this._angleType.value = val;
    }
    get angle_type() {
        return this._angleType.value;
    }
    _set_html() {
        var translation = new three.Vector3().setFromMatrixPosition(this.matrix);
        var rotation = new three.Euler()
        rotation.order = this.angle_type;
        rotation.setFromRotationMatrix(this.matrix);
        var rxryrz = [
            EulerTranslationElement.radianstoDegrees(rotation.x),
            EulerTranslationElement.radianstoDegrees(rotation.y),
            EulerTranslationElement.radianstoDegrees(rotation.z)
        ];
        var abc = EulerTranslationElement.xyzToabc(rxryrz, this.angle_type);
        this._x.value = translation.x.toFixed(2);
        this._y.value = translation.y.toFixed(2);
        this._z.value = translation.z.toFixed(2);
        this._a.value = abc[0].toFixed(2);
        this._b.value = abc[1].toFixed(2);
        this._c.value = abc[2].toFixed(2);
    }
    _get_html() {
        this._matrix.identity()
        
        var abc = [
            Number(EulerTranslationElement.degreestoRadians(this._a.value)),
            Number(EulerTranslationElement.degreestoRadians(Number(this._b.value))),
            Number(EulerTranslationElement.degreestoRadians(Number(this._c.value)))
        ]
        var rxryrz = EulerTranslationElement.abcToxyz(abc, this.angle_type);
        this._matrix.makeRotationFromEuler(new three.Euler(
            rxryrz[0],
            rxryrz[1],
            rxryrz[2],
            this.angle_type));
        
        this._matrix.setPosition(new three.Vector3(Number(this._x.value), Number(this._y.value), Number(this._z.value)));
        
        return this._matrix;
    }
    static xyzToabc(list, angleType) {
        if (angleType == "XZY") {
            return [list[0], list[2], list[1]];
        } else if (angleType == "YXZ") {
            return [list[1], list[0], list[2]];
        } else if (angleType == "YZX") {
            return [list[1], list[2], list[0]];
        } else if (angleType == "ZXY") {
            return [list[2], list[0], list[1]];
        } else if (angleType == "ZYX") {
            return [list[2], list[1], list[0]];
        }
        return list;
    }
    static abcToxyz(list, angleType) {
        if (angleType == "XZY") {
            return [list[0], list[2], list[1]];
        } else if (angleType == "YXZ") {
            return [list[1], list[0], list[2]];
        } else if (angleType == "YZX") {
            return [list[2], list[0], list[1]];
        } else if (angleType == "ZXY") {
            return [list[1], list[2], list[0]];
        } else if (angleType == "ZYX") {
            return [list[2], list[1], list[0]];
        }
        return list;
    }
    static degreestoRadians(degrees) {
        return degrees * Math.PI / 180;
    }
    static radianstoDegrees(radians) {
        return radians * 180 / Math.PI;
    }
}

customElements.define("angle-type-select", angleTypeSelect);
customElements.define("euler-transform", EulerTranslationElement);
customElements.define("matrix-element", MatrixElement);

window["three"] = three;