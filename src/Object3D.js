import { parseObj } from "./gl-helpers";
import { mat4 } from "gl-matrix";

export class Object3D {
    constructor(source) {
        const { vertices, normals } = parseObj(source);

        this.vertices = vertices;
        this.normals = normals;

        this.modelMatrix = mat4.create();
        this._normalMatrix = mat4.create();
    }

    get normalMatrix () {
        mat4.invert(this._normalMatrix, this.modelMatrix);
        mat4.transpose(this._normalMatrix, this._normalMatrix);

        return this._normalMatrix;
    }
}
