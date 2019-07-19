import { parseObj } from "./gl-helpers";
import { mat4 } from "gl-matrix";

export class Object3D {
    constructor(source) {
        const { vertices, normals } = parseObj(source);

        this.vertices = vertices;
        this.normals = normals;

        this.modelMatrix = mat4.create();
    }
}
