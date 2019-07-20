import { parseObj } from "./gl-helpers";
import { mat4 } from "gl-matrix";

export class Object3D {
    constructor(source, position, color) {
        const { vertices, normals, texCoords } = parseObj(source);

        this.vertices = vertices;
        this.normals = normals;
        this.position = position;
        this.texCoords = texCoords;

        this.modelMatrix = mat4.create();
        mat4.fromTranslation(this.modelMatrix, position);
        this._normalMatrix = mat4.create();

        this.color = color;
    }

    get normalMatrix () {
        mat4.invert(this._normalMatrix, this.modelMatrix);
        mat4.transpose(this._normalMatrix, this._normalMatrix);

        return this._normalMatrix;
    }
}
