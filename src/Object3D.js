import { parseObj } from "./gl-helpers";

export class Object3D {
    constructor(source) {
        const { vertices, normals } = parseObj(source);

        this.vertices = vertices;
        this.normals = normals;
    }
}
