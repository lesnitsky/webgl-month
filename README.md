# WebGL month

Hi 👋 My name is Andrei. I have some fun experience with WebGL and I want to share it. I'm starting a month of WebGL, each day I will post a WebGL related tutorial. Not Three.js, not pixi.js, WebGL API itself.

[Follow me on twitter](https://twitter.com/lesnitsky_a) to get WebGL month updates or [join WebGL month mailing list](http://eepurl.com/gwiSeH)


## Day 1. Intro

This is a series of blog posts related to WebGL. New post will be available every day

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Soruce code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)

Welcome to day 1 of WebGL month. In this article we'll get into high level concepts of rendering which are improtant to understand before approaching actual WebGL API.

WebGL API is often treated as 3D rendering API, which is a wrong assumption. So what WebGL does?
To answer this question let's try to render smth with canvas 2d.


We'll need simple html

📄 index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>WebGL Month</title>
  </head>
  <body></body>
</html>

```
and canvas

📄 index.html
```diff
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>WebGL Month</title>
    </head>
-   <body></body>
+   <body>
+     <canvas></canvas>
+   </body>
  </html>

```
Don't forget beloved JS

📄 index.html
```diff
    </head>
    <body>
      <canvas></canvas>
+     <script src="./src/canvas2d.js"></script>
    </body>
  </html>

```
📄 src/canvas2d.js
```js
console.log('Hello WebGL month');
```
Let's grab a reference to canvas and get 2d context

📄 src/canvas2d.js
```diff
- console.log('Hello WebGL month');+ console.log('Hello WebGL month');
+ 
+ const canvas = document.querySelector('canvas');
+ const ctx = canvas.getContext('2d');

```
and do smth pretty simple, like drawing a black rectangle

📄 src/canvas2d.js
```diff
  
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
+ 
+ ctx.fillRect(0, 0, 100, 50);

```
Ok, this is pretty simple right?
But let's think about what this signle line of code actually did.
It filled every pixel inside of rectangle with black color.

Are there any ways to do the same but w/o `fillRect`?
The answer is yes


Let's implement our own version of

📄 src/canvas2d.js
```diff
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  
- ctx.fillRect(0, 0, 100, 50);
+ function fillRect(top, left, width, height) {
+ 
+ }

```
So basically each pixel is just a color encoded in 4 integers. R, G, B channel and Alpha.
To store info about each pixel of canvas we'll need a `Uint8ClampedArray`.
The size of this array is `canvas.width * canvas.height` (pixels count) `* 4` (each pixel has 4 channels).

📄 src/canvas2d.js
```diff
  const ctx = canvas.getContext('2d');
  
  function fillRect(top, left, width, height) {
- 
+     const pixelStore = new Uint8ClampedArray(canvas.width * canvas.height * 4);
  }

```
Now we can fill each pixel storage with colors. Note that alpha component is also in  range unlike CSS

📄 src/canvas2d.js
```diff
  
  function fillRect(top, left, width, height) {
      const pixelStore = new Uint8ClampedArray(canvas.width * canvas.height * 4);
+ 
+     for (let i = 0; i < pixelStore.length; i += 4) {
+         pixelStore[i] = 0; // r
+         pixelStore[i + 1] = 0; // g
+         pixelStore[i + 2] = 0; // b
+         pixelStore[i + 3] = 255; // alpha
+     }
  }

```
But how do we render this pixels? There is a special canvas renderable class

📄 src/canvas2d.js
```diff
          pixelStore[i + 2] = 0; // b
          pixelStore[i + 3] = 255; // alpha
      }
+ 
+     const imageData = new ImageData(pixelStore, canvas.width, canvas.height);
+     ctx.putImageData(imageData, 0, 0);
  }
+ 
+ fillRect();

```
Whoa 🎉 We filled canvas with a color manually iterating over each pixel! But we're not taking into account passed arguments, let's fix it.


Calculate pixel indices inside rectangle

📄 src/canvas2d.js
```diff
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  
+ function calculatePixelIndices(top, left, width, height) {
+     const pixelIndices = [];
+ 
+     for (let x = left; x < left + width; x++) {
+         for (let y = top; y < top + height; y++) {
+             const i =
+                 y * canvas.width * 4 + // pixels to skip from top
+                 x * 4; // pixels to skip from left
+ 
+             pixelIndices.push(i);
+         }
+     }
+ 
+     return pixelIndices;
+ }
+ 
  function fillRect(top, left, width, height) {
      const pixelStore = new Uint8ClampedArray(canvas.width * canvas.height * 4);
  

```
and iterate over these pixels instead of the whole canvas

📄 src/canvas2d.js
```diff
  
  function fillRect(top, left, width, height) {
      const pixelStore = new Uint8ClampedArray(canvas.width * canvas.height * 4);
+     
+     const pixelIndices = calculatePixelIndices(top, left, width, height);
  
-     for (let i = 0; i < pixelStore.length; i += 4) {
+     pixelIndices.forEach((i) => {
          pixelStore[i] = 0; // r
          pixelStore[i + 1] = 0; // g
          pixelStore[i + 2] = 0; // b
          pixelStore[i + 3] = 255; // alpha
-     }
+     });
  
      const imageData = new ImageData(pixelStore, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
  }
  
- fillRect();
+ fillRect(10, 10, 100, 50);

```
Cool 😎 We've just reimplemented `fillRect`! But what does it have in common with WebGL?

![Everything](https://git-tutor-assets.s3.eu-west-2.amazonaws.com/thanos-everyhting.jpg)

That's exactly what WebGL API does – _it calculates color of each pixel and fills it with calculated color_

### What's next?

In next article we'll start working with WebGL API and render a WebGL "Hello world". See you tomorrow

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](eepurl.com/gwiSeH)

[Soruce code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)

### Homework

Extend custom `fillRect` to support custom colors


## Day 2. Simple shader and triangle

This is a series of blog posts related to WebGL. New post will be available every day

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Soruce code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)

---

[Yesterday](https://dev.to/lesnitsky/webgl-month-day-1-19ha) we've learned what WebGL does – calculates each pixel color inside renderable area. But how does it actually do that?


WebGL is an API which works with your GPU to render stuff. While JavaScript is executed by v8 on a CPU, GPU can't execute JavaScript, but it is still programmable

One of the languages GPU "understands" is [GLSL](https://en.wikipedia.org/wiki/OpenGL_Shading_Language), so we'll famialarize ourselves not only with WebGL API, but also with this new language.

GLSL is a C like programming language, so it is easy to learn and write for JavaScript developers.

But where do we write glsl code? How to pass it to GPU in order to execute?

Let's write some code


Let's create a new js file and get a reference to WebGL rendering context

📄 index.html
```diff
    </head>
    <body>
      <canvas></canvas>
-     <script src="./src/canvas2d.js"></script>
+     <script src="./src/webgl-hello-world.js"></script>
    </body>
  </html>

```
📄 src/webgl-hello-world.js
```js
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

```
The program executable by GPU is created by  method of WebGL rendering context

📄 src/webgl-hello-world.js
```diff
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');
+ 
+ const program = gl.createProgram();

```
GPU program consists of two "functions"
These functions are called `shaders`
WebGL supports several types of shaders

In this example we'll work with `vertex` and `fragment` shaders.
Both could be created with `createShader` method

📄 src/webgl-hello-world.js
```diff
  const gl = canvas.getContext('webgl');
  
  const program = gl.createProgram();
+ 
+ const vertexShader = gl.createShader(gl.VERTEX_SHADER);
+ const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

```
Now let's write the simpliest possible shader

📄 src/webgl-hello-world.js
```diff
  
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
+ 
+ const vShaderSource = `
+ void main() {
+     
+ }
+ `;

```
This should look pretty familiar to those who has some C/C++ experience


Unlike C or C++ `main` doesn't return anyhting, it assignes a value to a global variable `gl_Position` instead

📄 src/webgl-hello-world.js
```diff
  
  const vShaderSource = `
  void main() {
-     
+     gl_Position = vec4(0, 0, 0, 1);
  }
  `;

```
Now let's take a closer look to what is being assigned.

There is a bunch of functions available in shaders.

`vec4` function creates a vector of 4 components.

`gl_Position = vec4(0, 0, 0, 1);`

Looks weird.. We live in 3-dimensional world, what on earth is the 4th component? Is it `time`? 😕

Not really

[Quote from MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection#Homogeneous_Coordinates)

> It turns out that this addition allows for lots of nice techniques for manipulating 3D data.
> A three dimensional point is defined in a typical Cartesian coordinate system. The added 4th dimension changes this point into a homogeneous coordinate. It still represents a point in 3D space and it can easily be demonstrated how to construct this type of coordinate through a pair of simple functions.

For now we can just ingore the 4th component and set it to `1.0` just because


Alright, we have a shader variable, shader source in another variable. How do we connect these two? With

📄 src/webgl-hello-world.js
```diff
      gl_Position = vec4(0, 0, 0, 1);
  }
  `;
+ 
+ gl.shaderSource(vertexShader, vShaderSource);

```
GLSL shader should be compiled in order to be executed

📄 src/webgl-hello-world.js
```diff
  `;
  
  gl.shaderSource(vertexShader, vShaderSource);
+ gl.compileShader(vertexShader);

```
Compilation result could be retreived by . This method returns a "compiler" output. If it is an empty string – everyhting is good

📄 src/webgl-hello-world.js
```diff
  
  gl.shaderSource(vertexShader, vShaderSource);
  gl.compileShader(vertexShader);
+ 
+ console.log(gl.getShaderInfoLog(vertexShader));

```
We'll need to do the same with fragment shader, so let's implement a helper function which we'll use for fragment shader as well

📄 src/webgl-hello-world.js
```diff
  }
  `;
  
- gl.shaderSource(vertexShader, vShaderSource);
- gl.compileShader(vertexShader);
+ function compileShader(shader, source) {
+     gl.shaderSource(shader, source);
+     gl.compileShader(shader);
  
- console.log(gl.getShaderInfoLog(vertexShader));
+     const log = gl.getShaderInfoLog(shader);
+ 
+     if (log) {
+         throw new Error(log);
+     }
+ }
+ 
+ compileShader(vertexShader, vShaderSource);

```
How does the simpliest fragment shader looks like? Exactly the same

📄 src/webgl-hello-world.js
```diff
  }
  `;
  
+ const fShaderSource = `
+     void main() {
+         
+     }
+ `;
+ 
  function compileShader(shader, source) {
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

```
Computation result of a fragment shader is a color, which is also a vector of 4 components (r, g, b, a). Unlike CSS, values are in range of `[0..1]` instead of `[0..255]`. Fragment shader computation result should be assigned to the variable `gl_FragColor`

📄 src/webgl-hello-world.js
```diff
  
  const fShaderSource = `
      void main() {
-         
+         gl_FragColor = vec4(1, 0, 0, 1);
      }
  `;
  
  }
  
  compileShader(vertexShader, vShaderSource);
+ compileShader(fragmentShader, fShaderSource);

```
Now we should connect `program` with our shaders

📄 src/webgl-hello-world.js
```diff
  
  compileShader(vertexShader, vShaderSource);
  compileShader(fragmentShader, fShaderSource);
+ 
+ gl.attachShader(program, vertexShader);
+ gl.attachShader(program, fragmentShader);

```
Next step – link program. This phase is required to verify if vertex and fragment shaders are compatible with each other (we'll get to more details later)

📄 src/webgl-hello-world.js
```diff
  
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
+ 
+ gl.linkProgram(program);

```
Our application could have several programs, so we should tell gpu which program we want to use before issuing a draw call

📄 src/webgl-hello-world.js
```diff
  gl.attachShader(program, fragmentShader);
  
  gl.linkProgram(program);
+ 
+ gl.useProgram(program);

```
Ok, we're ready to draw something

📄 src/webgl-hello-world.js
```diff
  gl.linkProgram(program);
  
  gl.useProgram(program);
+ 
+ gl.drawArrays();

```
WebGL can render several types of "primitives"

-   Points
-   Lines
-   Triangels

We should pass a primitive type we want to render

📄 src/webgl-hello-world.js
```diff
  
  gl.useProgram(program);
  
- gl.drawArrays();
+ gl.drawArrays(gl.POINTS);

```
There is a way to pass input data containing info about positions of our primitives to vertex shader, so we need to pass the index of the first primitive we want to render

📄 src/webgl-hello-world.js
```diff
  
  gl.useProgram(program);
  
- gl.drawArrays(gl.POINTS);
+ gl.drawArrays(gl.POINTS, 0);

```
and primitives count

📄 src/webgl-hello-world.js
```diff
  
  gl.useProgram(program);
  
- gl.drawArrays(gl.POINTS, 0);
+ gl.drawArrays(gl.POINTS, 0, 1);

```
Nothing rendered 😢
What is wrong?

Actually to render point, we should also specify a point size inside vertex shader

📄 src/webgl-hello-world.js
```diff
  
  const vShaderSource = `
  void main() {
+     gl_PointSize = 20.0;
      gl_Position = vec4(0, 0, 0, 1);
  }
  `;

```
Whoa 🎉 We have a point!

![WebGL Point](https://git-tutor-assets.s3.eu-west-2.amazonaws.com/webgl-point.png)

It is rendered in the center of the canvas because `gl_Position` is `vec4(0, 0, 0, 1)` => `x == 0` and `y == 0`
WebGL coordinate system is different from `canvas2d`

`canvas2d`

```
0.0
-----------------------→ width (px)
|
|
|
↓
height (px)
```

`webgl`

```
                    (0, 1)
                      ↑
                      |
                      |
                      |
(-1, 0) ------ (0, 0)-·---------> (1, 0)
                      |
                      |
                      |
                      |
                    (0, -1)
```


Now let's pass point coordinate from JS instead of hardcoding it inside shader

Input data of vertex shader is called `attribute`
Let's define `position` attribute

📄 src/webgl-hello-world.js
```diff
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  
  const vShaderSource = `
+ attribute vec2 position;
+ 
  void main() {
      gl_PointSize = 20.0;
-     gl_Position = vec4(0, 0, 0, 1);
+     gl_Position = vec4(position.x, position.y, 0, 1);
  }
  `;
  

```
In order to fill attribute with data we need to get attribute location. Think of it as of unique identifier of attribute in javascript world

📄 src/webgl-hello-world.js
```diff
  
  gl.useProgram(program);
  
+ const positionPointer = gl.getAttribLocation(program, 'position');
+ 
  gl.drawArrays(gl.POINTS, 0, 1);

```
GPU accepts only typed arrays as input, so let's define a `Float32Array` as a storage of our point position

📄 src/webgl-hello-world.js
```diff
  
  const positionPointer = gl.getAttribLocation(program, 'position');
  
+ const positionData = new Float32Array([0, 0]);
+ 
  gl.drawArrays(gl.POINTS, 0, 1);

```
But this array couldn't be passed to GPU as-is, GPU should have it's own buffer.
There are different kinds of "buffers" in GPU world, in this case we need `ARRAY_BUFFER`

📄 src/webgl-hello-world.js
```diff
  
  const positionData = new Float32Array([0, 0]);
  
+ const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
+ 
  gl.drawArrays(gl.POINTS, 0, 1);

```
To make any changes to GPU buffers, we need to "bind" it. After buffer is bound, it is treated as "current", and any buffer modification operation will be performed on "current" buffer.

📄 src/webgl-hello-world.js
```diff
  
  const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
  
+ gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
+ 
  gl.drawArrays(gl.POINTS, 0, 1);

```
To fill buffer with some data, we need to call `bufferData` method

📄 src/webgl-hello-world.js
```diff
  const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
+ gl.bufferData(gl.ARRAY_BUFFER, positionData);
  
  gl.drawArrays(gl.POINTS, 0, 1);

```
To optimize buffer operations (memory management) on GPU side, we should pass a "hint" to GPU indicating how this buffer will be used. [There are several ways to use buffers](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData#Parameters)

-   `gl.STATIC_DRAW`: Contents of the buffer are likely to be used often and not change often. Contents are written to the buffer, but not read.
-   `gl.DYNAMIC_DRAW`: Contents of the buffer are likely to be used often and change often. Contents are written to the buffer, but not read.
-   `gl.STREAM_DRAW`: Contents of the buffer are likely to not be used often. Contents are written to the buffer, but not read.

    When using a WebGL 2 context, the following values are available additionally:

-   `gl.STATIC_READ`: Contents of the buffer are likely to be used often and not change often. Contents are read from the buffer, but not written.
-   `gl.DYNAMIC_READ`: Contents of the buffer are likely to be used often and change often. Contents are read from the buffer, but not written.
-   `gl.STREAM_READ`: Contents of the buffer are likely to not be used often. Contents are read from the buffer, but not written.
-   `gl.STATIC_COPY`: Contents of the buffer are likely to be used often and not change often. Contents are neither written or read by the user.
-   `gl.DYNAMIC_COPY`: Contents of the buffer are likely to be used often and change often. Contents are neither written or read by the user.
-   `gl.STREAM_COPY`: Contents of the buffer are likely to be used often and not change often. Contents are neither written or read by the user.

📄 src/webgl-hello-world.js
```diff
  const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
- gl.bufferData(gl.ARRAY_BUFFER, positionData);
+ gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
  
  gl.drawArrays(gl.POINTS, 0, 1);

```
Now we need to tell GPU how it should read the data from our buffer

Required info:

Attribute size (2 in case of `vec2`, 3 in case of `vec3` etc)

📄 src/webgl-hello-world.js
```diff
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
  
+ const attributeSize = 2;
+ 
  gl.drawArrays(gl.POINTS, 0, 1);

```
type of data in buffer

📄 src/webgl-hello-world.js
```diff
  gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
  
  const attributeSize = 2;
+ const type = gl.FLOAT;
  
  gl.drawArrays(gl.POINTS, 0, 1);

```
normalized – indicates if data values should be clamped to a certain range

for `gl.BYTE` and `gl.SHORT`, clamps the values to `[-1, 1]` if true

for `gl.UNSIGNED_BYTE` and `gl.UNSIGNED_SHORT`, clamps the values to `[0, 1]` if true

for types `gl.FLOAT` and `gl.HALF_FLOAT`, this parameter has no effect.

📄 src/webgl-hello-world.js
```diff
  
  const attributeSize = 2;
  const type = gl.FLOAT;
+ const nomralized = false;
  
  gl.drawArrays(gl.POINTS, 0, 1);

```
We'll talk about these two later 😉

📄 src/webgl-hello-world.js
```diff
  const attributeSize = 2;
  const type = gl.FLOAT;
  const nomralized = false;
+ const stride = 0;
+ const offset = 0;
  
  gl.drawArrays(gl.POINTS, 0, 1);

```
Now we need to call `vertexAttribPointer` to setup our `position` attribute

📄 src/webgl-hello-world.js
```diff
  const stride = 0;
  const offset = 0;
  
+ gl.vertexAttribPointer(positionPointer, attributeSize, type, nomralized, stride, offset);
+ 
  gl.drawArrays(gl.POINTS, 0, 1);

```
Let's try to change a position of the point

📄 src/webgl-hello-world.js
```diff
  
  const positionPointer = gl.getAttribLocation(program, 'position');
  
- const positionData = new Float32Array([0, 0]);
+ const positionData = new Float32Array([1.0, 0.0]);
  
  const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
  

```
Nothing changed 😢 But why?

Turns out – all attributes are disabled by default (filled with 0), so we need to `enable` our position attrbiute

📄 src/webgl-hello-world.js
```diff
  const stride = 0;
  const offset = 0;
  
+ gl.enableVertexAttribArray(positionPointer);
  gl.vertexAttribPointer(positionPointer, attributeSize, type, nomralized, stride, offset);
  
  gl.drawArrays(gl.POINTS, 0, 1);

```
Now we can render more points!
Let's mark every corner of a canvas with a point

📄 src/webgl-hello-world.js
```diff
  
  const positionPointer = gl.getAttribLocation(program, 'position');
  
- const positionData = new Float32Array([1.0, 0.0]);
+ const positionData = new Float32Array([
+     -1.0, // point 1 x
+     -1.0, // point 1 y
+ 
+     1.0, // point 2 x
+     1.0, // point 2 y
+ 
+     -1.0, // point 3 x
+     1.0, // point 3 y
+ 
+     1.0, // point 4 x
+     -1.0, // point 4 y
+ ]);
  
  const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
  
  gl.enableVertexAttribArray(positionPointer);
  gl.vertexAttribPointer(positionPointer, attributeSize, type, nomralized, stride, offset);
  
- gl.drawArrays(gl.POINTS, 0, 1);
+ gl.drawArrays(gl.POINTS, 0, positionData.length / 2);

```
Let's get back to our shader

We don't necessarily need to explicitly pass `position.x` and `position.y` to a `vec4` constructor, there is a `vec4(vec2, float, float)` override

📄 src/webgl-hello-world.js
```diff
  
  void main() {
      gl_PointSize = 20.0;
-     gl_Position = vec4(position.x, position.y, 0, 1);
+     gl_Position = vec4(position, 0, 1);
  }
  `;
  
  const positionPointer = gl.getAttribLocation(program, 'position');
  
  const positionData = new Float32Array([
-     -1.0, // point 1 x
-     -1.0, // point 1 y
+     -1.0, // top left x
+     -1.0, // top left y
  
      1.0, // point 2 x
      1.0, // point 2 y

```
Now let's move all points closer to the center by dividing each position by 2.0

📄 src/webgl-hello-world.js
```diff
  
  void main() {
      gl_PointSize = 20.0;
-     gl_Position = vec4(position, 0, 1);
+     gl_Position = vec4(position / 2.0, 0, 1);
  }
  `;
  

```
Result:

![Result](https://git-tutor-assets.s3.eu-west-2.amazonaws.com/4points.png)

### Conclusion

We now have a better understanding of how does GPU and WebGL work and can render something very basic
We'll explore more primitive types tomorrow!

### Homework

Render a `Math.cos` graph with dots
Hint: all you need is fill `positionData` with valid values


[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Soruce code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)

