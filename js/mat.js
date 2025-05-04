/**
 * @typedef {Object} XYZABC
 * @property {number} x - The x-coordinate
 * @property {number} y - The y-coordinate
 * @property {number} z - The z-coordinate
 * @property {number} a - The a-value
 * @property {number} b - The b-value
 * @property {number} c - The c-value
 */
// import * as math from './math.js';


function rotate_angleType(angleType, angle, matrix) {
    matrix = rotate_angle(angle[0], angleType[0], matrix);
    matrix = rotate_angle(angle[1], angleType[1], matrix);
    matrix = rotate_angle(angle[2], angleType[2], matrix);
    return matrix;
}

function rotate_angleType_body(angleType, angle, matrix) {
    matrix = rotate_angle_body(angle[0], angleType[0], matrix);
    matrix = rotate_angle_body(angle[1], angleType[1], matrix);
    matrix = rotate_angle_body(angle[2], angleType[2], matrix);
    return matrix;
}

function rotate_angle(angle, axis, matrix) {
    if (axis == "x") {
        return rotate_rx(angle, matrix);
    } else if (axis == "y") {
        return rotate_ry(angle, matrix);
    } else if (axis == "z") {
        return rotate_rz(angle, matrix);
    } else {
        console.error("Invalid axis, must be x, y, or z. Got " + axis);
        return matrix;
    }
}

function rotate_angle_body(angle, axis, matrix) {
    if (axis == "x") {
        return rotate_rxb(angle, matrix);
    } else if (axis == "y") {
        return rotate_ryb(angle, matrix);
    } else if (axis == "z") {
        return rotate_rzb(angle, matrix);
    } else {
        console.error("Invalid axis, must be x, y, or z. Got " + axis);
        return matrix;
    }
}

/**
 * 
 * @param {Number} angle 
 * @param {math.matrix} matrix 
 * @returns {math.matrix}
 */
function rotate_rx(angle, matrix) {
    // Convert the angle to radians
    var radians = angle * Math.PI / 180;
    // Create the rotation matrix
    var rotationMatrix = math.matrix([
        [1, 0, 0, 0],
        [0, Math.cos(radians), -Math.sin(radians),0 ],
        [0, Math.sin(radians), Math.cos(radians), 0],
        [0, 0, 0, 1]
    ]);

    // Multiply the rotation matrix with the input matrix
    var result = multiplyMatrices(rotationMatrix, matrix);

    // Return the modified matrix
    return result;
}

function rotate_rxb(angle, matrix) {
    // Convert the angle to radians
    var radians = angle * Math.PI / 180;
    // Create the rotation matrix
    var rotationMatrix = math.matrix([
        [1, 0, 0, 0],
        [0, Math.cos(radians), -Math.sin(radians),0 ],
        [0, Math.sin(radians), Math.cos(radians), 0],
        [0, 0, 0, 1]
    ]);
    // Multiply the rotation matrix with the input matrix
    var result = multiplyMatrices(matrix, rotationMatrix);

    // Return the modified matrix
    return result;
}

function rotate_ry(angle, matrix) {
    // Convert the angle to radians
    var radians = angle * Math.PI / 180;
    // Create the rotation matrix
    var rotationMatrix = math.matrix([
        [Math.cos(radians), 0, Math.sin(radians), 0],
        [0, 1, 0, 0],
        [-Math.sin(radians), 0, Math.cos(radians), 0],
        [0, 0, 0, 1]
    ]);

    // Multiply the rotation matrix with the input matrix
    var result = multiplyMatrices(rotationMatrix, matrix);

    // Return the modified matrix
    return result;
}

function rotate_ryb(angle, matrix) {
    // Convert the angle to radians
    var radians = angle * Math.PI / 180;
    // Create the rotation matrix
    var rotationMatrix = math.matrix([
        [Math.cos(radians), 0, Math.sin(radians), 0],
        [0, 1, 0, 0],
        [-Math.sin(radians), 0, Math.cos(radians), 0],
        [0, 0, 0, 1]
    ]);

    // Multiply the rotation matrix with the input matrix
    var result = multiplyMatrices(matrix, rotationMatrix);

    // Return the modified matrix
    return result;
}

function rotate_rz(angle, matrix) {
    // Convert the angle to radians
    var radians = angle * Math.PI / 180;
    // Create the rotation matrix
    var rotationMatrix = math.matrix([
        [Math.cos(radians), -Math.sin(radians), 0, 0],
        [Math.sin(radians), Math.cos(radians), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ]);

    // Multiply the rotation matrix with the input matrix
    var result = multiplyMatrices(rotationMatrix, matrix);

    // Return the modified matrix
    return result;
}

function rotate_rzb(angle, matrix) {
    // Convert the angle to radians
    var radians = angle * Math.PI / 180;
    // Create the rotation matrix
    var rotationMatrix = math.matrix([
        [Math.cos(radians), -Math.sin(radians), 0, 0],
        [Math.sin(radians), Math.cos(radians), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ]);

    // Multiply the rotation matrix with the input matrix
    var result = multiplyMatrices(matrix, rotationMatrix);

    // Return the modified matrix
    return result;
}

function multiplyMatrices(matrix1, matrix2) {
    return math.multiply(matrix1, matrix2);
}

function translate(tx, ty, tz, matrix) {
    // Create the translation matrix
    var translationMatrix = math.matrix([
        [1, 0, 0, tx],
        [0, 1, 0, ty],
        [0, 0, 1, tz],
        [0, 0, 0, 1]
    ]);

    // Multiply the translation matrix with the input matrix
    var result = multiplyMatrices(translationMatrix, matrix);

    // Return the modified matrix
    return result;
}

/***
 * Translates the input matrix by the given translation values
 * @param {Number} tx The translation value in the x-direction
 * @param {Number} ty The translation value in the y-direction
 * @param {Number} tz The translation value in the z-direction
 * @param {*} matrix The input matrix
 * @returns {*} The modified matrix
 */
function translate_body(tx, ty, tz, matrix) {
    // Create the translation matrix
    var translationMatrix = math.matrix([
        [1, 0, 0, tx],
        [0, 1, 0, ty],
        [0, 0, 1, tz],
        [0, 0, 0, 1]
    ]);

    // Multiply the translation matrix with the input matrix
    var result = multiplyMatrices(matrix, translationMatrix);

    // Return the modified matrix
    return result;
}

function compose_matrix(x, y, z, a, b, c, angleType) {
    var matrix = math.identity(4);
    matrix = translate(Number(x), Number(y), Number(z), matrix);
    return rotate_angleType(angleType, [Number(a),Number(b),Number(c)], matrix);
}

function compose_matrix_body(x, y, z, a, b, c, angleType) {
    var matrix = math.identity(4);
    matrix = translate_body(Number(x), Number(y), Number(z), matrix);
    return rotate_angleType_body(angleType, [Number(a),Number(b),Number(c)], matrix);
}

/**
 * 
 * @param {*} matrix 
 * @param {*} angleType 
 * @returns {XYZABC}
 */
function decompose_matrix(matrix, angleType) {

    var translation = {
        x: matrix.get([0, 3]),
        y: matrix.get([1, 3]),
        z: matrix.get([2, 3]),
    }

    if (angleType == "xyz") {
        var rotation = decompose_matrix_xyz(matrix);
    } else if (angleType == "xzy") {
        var rotation = decompose_matrix_xzy(matrix);
    } else if (angleType == "yxz") {
        var rotation = decompose_matrix_yxz(matrix);
    } else if (angleType == "yzx") {
        var rotation = decompose_matrix_yzx(matrix);
    } else if (angleType == "zxy") {
        var rotation = decompose_matrix_zxy(matrix);
    } else if (angleType == "zyx") {
        var rotation = decompose_matrix_zyx(matrix);
    } else {
        console.error("Invalid angle type " + angleType);
        var rotation = {a: 0, b: 0, c: 0};
    }
    return {...translation, ...rotation};
}

function decompose_matrix_xyz(matrix) {
    var rx = Math.atan2(matrix.get([2, 1]), matrix.get([2, 2])) * 180 / Math.PI;
    var ry = Math.atan2(-matrix.get([2, 0]), Math.sqrt(Math.pow(matrix.get([2, 1]), 2) + Math.pow(matrix.get([2, 2]), 2))) * 180 / Math.PI;
    var rz = Math.atan2(matrix.get([1, 0]), matrix.get([0, 0])) * 180 / Math.PI;

    return {
        a: rx,
        b: ry,
        c: rz
    }
}

function decompose_matrix_zyx(matrix) {
    var rx = Math.atan2(matrix.get([1, 2]), matrix.get([2, 2])) * 180 / Math.PI;
    var ry = Math.atan2(-matrix.get([0, 2]), Math.sqrt(Math.pow(matrix.get([1, 2]), 2) + Math.pow(matrix.get([2, 2]), 2))) * 180 / Math.PI;
    var rz = Math.atan2(matrix.get([0, 1]), matrix.get([0, 0])) * 180 / Math.PI;

    return {
        c: rx,
        b: ry,
        a: rz
    }
}

function decompose_matrix_xzy(matrix) {
    var rx = Math.atan2(-matrix.get([1, 2]), matrix.get([1, 1])) * 180 / Math.PI;
    var ry = Math.atan2(matrix.get([0, 2]), Math.sqrt(Math.pow(matrix.get([1, 2]), 2) + Math.pow(matrix.get([1, 1]), 2))) * 180 / Math.PI;
    var rz = Math.atan2(matrix.get([0, 1]), matrix.get([0, 0])) * 180 / Math.PI;

    return {
        a: rx,
        c: ry,
        b: rz
    }
}

function decompose_matrix_yxz(matrix) {
    var rx = Math.atan2(matrix.get([2, 0]), matrix.get([2, 2])) * 180 / Math.PI;
    var ry = Math.atan2(-matrix.get([2, 1]), Math.sqrt(Math.pow(matrix.get([2, 0]), 2) + Math.pow(matrix.get([2, 2]), 2))) * 180 / Math.PI;
    var rz = Math.atan2(matrix.get([1, 1]), matrix.get([0, 1])) * 180 / Math.PI;

    return {
        b: rx,
        a: ry,
        c: rz
    }
}

function decompose_matrix_yzx(matrix) {
    var rx = Math.atan2(-matrix.get([0, 2]), matrix.get([0, 0])) * 180 / Math.PI;
    var ry = Math.atan2(matrix.get([2, 0]), Math.sqrt(Math.pow(matrix.get([0, 2]), 2) + Math.pow(matrix.get([0, 0]), 2))) * 180 / Math.PI;
    var rz = Math.atan2(matrix.get([2, 1]), matrix.get([2, 2])) * 180 / Math.PI;

    return {
        c: rx,
        a: ry,
        b: rz
    }
}   

function decompose_matrix_zxy(matrix) {
    var rx = Math.atan2(matrix.get([1, 0]), matrix.get([1, 1])) * 180 / Math.PI;
    var ry = Math.atan2(-matrix.get([0, 2]), Math.sqrt(Math.pow(matrix.get([1, 0]), 2) + Math.pow(matrix.get([1, 1]), 2))) * 180 / Math.PI;
    var rz = Math.atan2(matrix.get([0, 1]), matrix.get([0, 0])) * 180 / Math.PI;

    return {
        b: rx,
        c: ry,
        a: rz
    }
}

function decompose_matrix_zyx(matrix) {
    var rx = Math.atan2(matrix.get([1, 2]), matrix.get([2, 2])) * 180 / Math.PI;
    var ry = Math.atan2(-matrix.get([0, 2]), Math.sqrt(Math.pow(matrix.get([1, 2]), 2) + Math.pow(matrix.get([2, 2]), 2))) * 180 / Math.PI;
    var rz = Math.atan2(matrix.get([0, 1]), matrix.get([0, 0])) * 180 / Math.PI;

    return {
        c: rx,
        b: ry,
        a: rz
    }
}

function decompose_matrix_xzy(matrix) {
    var rx = Math.atan2(-matrix.get([1, 2]), matrix.get([1, 1])) * 180 / Math.PI;
    var ry = Math.atan2(matrix.get([0, 2]), Math.sqrt(Math.pow(matrix.get([1, 2]), 2) + Math.pow(matrix.get([1, 1]), 2))) * 180 / Math.PI;
    var rz = Math.atan2(matrix.get([0, 1]), matrix.get([0, 0])) * 180 / Math.PI;

    return {
        a: rx,
        c: ry,
        b: rz
    }
}
