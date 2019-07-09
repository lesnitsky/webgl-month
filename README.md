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


## Day 3. Shader uniforms, lines and triangles

This is a series of blog posts related to WebGL. New post will be available every day

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Soruce code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)

[Yesterday](https://dev.to/lesnitsky/shaders-and-points-3h2c) we draw the simplies primitive possible – point. Let's first solve the "homework"


We need to remove hardcoded points data

📄 src/webgl-hello-world.js
```diff
  
  const positionPointer = gl.getAttribLocation(program, 'position');
  
- const positionData = new Float32Array([
-     -1.0, // top left x
-     -1.0, // top left y
- 
-     1.0, // point 2 x
-     1.0, // point 2 y
- 
-     -1.0, // point 3 x
-     1.0, // point 3 y
- 
-     1.0, // point 4 x
-     -1.0, // point 4 y
- ]);
+ const points = [];
+ const positionData = new Float32Array(points);
  
  const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
  

```
Iterate over each vertical line of pixels of canvas `[0..width]`

📄 src/webgl-hello-world.js
```diff
  const positionPointer = gl.getAttribLocation(program, 'position');
  
  const points = [];
+ 
+ for (let i = 0; i < canvas.width; i++) {
+ 
+ }
+ 
  const positionData = new Float32Array(points);
  
  const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

```
Transform value from `[0..width]` to `[-1..1]` (remember webgl coordinat grid? this is left most and right most coordinates)

📄 src/webgl-hello-world.js
```diff
  const points = [];
  
  for (let i = 0; i < canvas.width; i++) {
- 
+     const x = i / canvas.width * 2 - 1;
  }
  
  const positionData = new Float32Array(points);

```
Calculate `cos` and add both x and y to `points` array

📄 src/webgl-hello-world.js
```diff
  
  for (let i = 0; i < canvas.width; i++) {
      const x = i / canvas.width * 2 - 1;
+     const y = Math.cos(x * Math.PI);
+ 
+     points.push(x, y);
  }
  
  const positionData = new Float32Array(points);

```
Graph looks a bit weird, let's fix our vertex shader

📄 src/webgl-hello-world.js
```diff
  attribute vec2 position;
  
  void main() {
-     gl_PointSize = 20.0;
-     gl_Position = vec4(position / 2.0, 0, 1);
+     gl_PointSize = 2.0;
+     gl_Position = vec4(position, 0, 1);
  }
  `;
  

```
Niiiice 😎 We now have fancy cos graph!

![Cos graph](https://git-tutor-assets.s3.eu-west-2.amazonaws.com/cos-graph.png)


We calculated `cos` with JavaScript, but if we need to calculate something for a large dataset, javascript may block rendering thread. Why won't facilitate computation power of GPU (cos will be calculated for each point in parallel).

GLSL doesn't have `Math` namespace, so we'll need to define `M_PI` variable
`cos` function is there though 😏

📄 src/webgl-hello-world.js
```diff
  const vShaderSource = `
  attribute vec2 position;
  
+ #define M_PI 3.1415926535897932384626433832795
+ 
  void main() {
      gl_PointSize = 2.0;
-     gl_Position = vec4(position, 0, 1);
+     gl_Position = vec4(position.x, cos(position.y * M_PI), 0, 1);
  }
  `;
  
  
  for (let i = 0; i < canvas.width; i++) {
      const x = i / canvas.width * 2 - 1;
-     const y = Math.cos(x * Math.PI);
- 
-     points.push(x, y);
+     points.push(x, x);
  }
  
  const positionData = new Float32Array(points);

```
We have another JavaScript computation inside cycle where we transform pixel coordinates to `[-1..1]` range
How do we move this to GPU?
We've learned that we can pass some data to a shader with `attribute`, but `width` is constant, it doesn't change between points.

There is a special kind of variables – `uniforms`. Treat uniform as a global variable which can be assigned only once before draw call and stays the same for all "points"


Let's define a `uniform`

📄 src/webgl-hello-world.js
```diff
  
  const vShaderSource = `
  attribute vec2 position;
+ uniform float width;
  
  #define M_PI 3.1415926535897932384626433832795
  

```
To assign a value to a uniform, we'll need to do smth similar to what we did with attribute. We need to get location of the uniform.

📄 src/webgl-hello-world.js
```diff
  gl.useProgram(program);
  
  const positionPointer = gl.getAttribLocation(program, 'position');
+ const widthUniformLocation = gl.getUniformLocation(program, 'width');
  
  const points = [];
  

```
There's a bunch of methods which can assign different types of values to uniforms

* `gl.uniform1f` – assigns a number to a float uniform (`gl.uniform1f(0.0)`)
* `gl.uniform1fv` – assigns an array of length 1 to a float uniform (`gl.uniform1fv([0.0])`)
* `gl.uniform2f` - assigns two numbers to a vec2 uniform (`gl.uniform2f(0.0, 1.0)`)
* `gl.uniform2f` - assigns an array of length 2 to a vec2 uniform (`gl.uniform2fv([0.0, 1.0])`)

etc

📄 src/webgl-hello-world.js
```diff
  const positionPointer = gl.getAttribLocation(program, 'position');
  const widthUniformLocation = gl.getUniformLocation(program, 'width');
  
+ gl.uniform1f(widthUniformLocation, canvas.width);
+ 
  const points = [];
  
  for (let i = 0; i < canvas.width; i++) {

```
And finally let's move our js computation to a shader

📄 src/webgl-hello-world.js
```diff
  #define M_PI 3.1415926535897932384626433832795
  
  void main() {
+     float x = position.x / width * 2.0 - 1.0;
      gl_PointSize = 2.0;
-     gl_Position = vec4(position.x, cos(position.y * M_PI), 0, 1);
+     gl_Position = vec4(x, cos(x * M_PI), 0, 1);
  }
  `;
  
  const points = [];
  
  for (let i = 0; i < canvas.width; i++) {
-     const x = i / canvas.width * 2 - 1;
-     points.push(x, x);
+     points.push(i, i);
  }
  
  const positionData = new Float32Array(points);

```
### Rendering lines

Now let's try to render lines

We need to fill our position data with line starting and ending point coordinates

📄 src/webgl-hello-world.js
```diff
  
  gl.uniform1f(widthUniformLocation, canvas.width);
  
- const points = [];
+ const lines = [];
+ let prevLineY = 0;
  
- for (let i = 0; i < canvas.width; i++) {
-     points.push(i, i);
+ for (let i = 0; i < canvas.width - 5; i += 5) {
+     lines.push(i, prevLineY);
+     const y =  Math.random() * canvas.height;
+     lines.push(i + 5, y);
+ 
+     prevLineY = y;
  }
  
- const positionData = new Float32Array(points);
+ const positionData = new Float32Array(lines);
  
  const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
  

```
We'll also need to transform `y` to a WebGL clipspace, so let's pass a resolution of canvas, not just width

📄 src/webgl-hello-world.js
```diff
  
  const vShaderSource = `
  attribute vec2 position;
- uniform float width;
+ uniform vec2 resolution;
  
  #define M_PI 3.1415926535897932384626433832795
  
  void main() {
-     float x = position.x / width * 2.0 - 1.0;
+     vec2 transformedPosition = position / resolution * 2.0 - 1.0;
      gl_PointSize = 2.0;
-     gl_Position = vec4(x, cos(x * M_PI), 0, 1);
+     gl_Position = vec4(transformedPosition, 0, 1);
  }
  `;
  
  gl.useProgram(program);
  
  const positionPointer = gl.getAttribLocation(program, 'position');
- const widthUniformLocation = gl.getUniformLocation(program, 'width');
+ const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
  
- gl.uniform1f(widthUniformLocation, canvas.width);
+ gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);
  
  const lines = [];
  let prevLineY = 0;

```
The final thing – we need to change primitive type to `gl.LINES`

📄 src/webgl-hello-world.js
```diff
  gl.enableVertexAttribArray(positionPointer);
  gl.vertexAttribPointer(positionPointer, attributeSize, type, nomralized, stride, offset);
  
- gl.drawArrays(gl.POINTS, 0, positionData.length / 2);
+ gl.drawArrays(gl.LINES, 0, positionData.length / 2);

```
Cool! We can render lines now 👍

![Lines](https://git-tutor-assets.s3.eu-west-2.amazonaws.com/line-graph.png)

Let's try to make the line a bit thicker


Unlike point size, line width should be set from javascript. There is a method `gl.lineWidth(width)`

Let's try to use it

📄 src/webgl-hello-world.js
```diff
  
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
+ gl.lineWidth(10);
  
  const attributeSize = 2;
  const type = gl.FLOAT;

```
Nothing changed 😢 But why??

That's why 😂

![Line browser support](https://git-tutor-assets.s3.eu-west-2.amazonaws.com/line-width-support.png)

Nobody cares.

So if you need a fancy line with custom line cap – `gl.LINES` is not for you


But how do we render fancy line?

Turns out – everything could be rendered with help of next WebGL primitive – triangle.
This is the last primitive which could be rendered with WebGL

Building a line of custom width from triangle might seem like a tough task, but don't worry, there are a lot of packages that could help you render custom 2d shapes (and even svg)

Some of these tools:

- [svg-path-contours](https://github.com/mattdesl/svg-path-contours)
- [cdt2d](https://www.npmjs.com/package/cdt2d)
- [adaptive-bezier-curve](https://www.npmjs.com/package/adaptive-bezier-curve)

and others

From now on, remember: EVERYTHING, could be built with triangles and that's how rendering works

1. Input – triangle vertices
2. vertex shader – transform vertices to webgl clipspace
3. Rasterization – calculate which pixels are inside of certain triangle
4. Calculate color of each pixel

Here's an illustration of this process from [https://opentechschool-brussels.github.io/intro-to-webGL-and-shaders/log1_graphic-pipeline](https://opentechschool-brussels.github.io/intro-to-webGL-and-shaders/log1_graphic-pipeline)

![WebGL pipeline](https://opentechschool-brussels.github.io/intro-to-webGL-and-shaders/assets/log1_graphicPipeline.jpg)

> Disclamer: this is a simplified version of what's going on under the hood, [read this](https://www.khronos.org/opengl/wiki/Rendering_Pipeline_Overview) for more detailed explanation


So lets finally render a triangle

Again – we need to update our position data


and change primitive type

📄 src/webgl-hello-world.js
```diff
  
  gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);
  
- const lines = [];
- let prevLineY = 0;
+ const triangles = [
+     0, 0, // v1 (x, y)
+     canvas.width / 2, canvas.height, // v2 (x, y)
+     canvas.width, 0, // v3 (x, y)
+ ];
  
- for (let i = 0; i < canvas.width - 5; i += 5) {
-     lines.push(i, prevLineY);
-     const y =  Math.random() * canvas.height;
-     lines.push(i + 5, y);
- 
-     prevLineY = y;
- }
- 
- const positionData = new Float32Array(lines);
+ const positionData = new Float32Array(triangles);
  
  const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
  
  gl.enableVertexAttribArray(positionPointer);
  gl.vertexAttribPointer(positionPointer, attributeSize, type, nomralized, stride, offset);
  
- gl.drawArrays(gl.LINES, 0, positionData.length / 2);
+ gl.drawArrays(gl.TRIANGLES, 0, positionData.length / 2);

```
And one more thing... Let's pass a color from javascript instead of hardcoding it inside fragment shader.

We'll need to go through the same steps as for resolution uniform, but declare this uniform in fragment shader

📄 src/webgl-hello-world.js
```diff
  `;
  
  const fShaderSource = `
+     uniform vec4 color;
+ 
      void main() {
-         gl_FragColor = vec4(1, 0, 0, 1);
+         gl_FragColor = color / 255.0;
      }
  `;
  
  
  const positionPointer = gl.getAttribLocation(program, 'position');
  const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
+ const colorUniformLocation = gl.getUniformLocation(program, 'color');
  
  gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);
+ gl.uniform4fv(colorUniformLocation, [255, 0, 0, 255]);
  
  const triangles = [
      0, 0, // v1 (x, y)

```
Wait, what? An Error 🛑 😱

```
No precision specified for (float)
```

What is that?

Turns out that glsl shaders support different precision of float and you need to specify it.
Usually `mediump` is both performant and precise, but sometimes you might want to use `lowp` or `highp`. But be careful, `highp` is not supported by some mobile GPUs and there is no guarantee you won't get any weird rendering artifacts withh high precesion

📄 src/webgl-hello-world.js
```diff
  `;
  
  const fShaderSource = `
+     precision mediump float;
      uniform vec4 color;
  
      void main() {

```
### Homework

Render different shapes using triangles:

* rectangle
* hexagon
* circle


See you tomorrow 👋

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Soruce code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)


## Day 4. Shader varyings

This is a series of blog posts related to WebGL. New post will be available every day

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Soruce code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)


[Yesterday](https://dev.to/lesnitsky/webgl-month-day-3-shader-uniforms-lines-and-triangles-5dof) we learned how to render lines and triangles, so let's get started with the homework

How do we draw a rectangle if webgl can only render triangles? We should split a rectangle into two triangles

```
-------
|    /|
|  /  |
|/    |
-------
```

Pretty simple, right?


Let's define the coordinates of triangle vertices

📄 src/webgl-hello-world.js
```diff
  gl.uniform4fv(colorUniformLocation, [255, 0, 0, 255]);
  
  const triangles = [
-     0, 0, // v1 (x, y)
-     canvas.width / 2, canvas.height, // v2 (x, y)
-     canvas.width, 0, // v3 (x, y)
+     // first triangle
+     0, 150, // top left
+     150, 150, // top right
+     0, 0, // bottom left
+     
+     // second triangle
+     0, 0, // bottom left
+     150, 150, // top right
+     150, 0, // bottom right
  ];
  
  const positionData = new Float32Array(triangles);

```
![Rectangle](https://git-tutor-assets.s3.eu-west-2.amazonaws.com/rectangle.png)

Great, we can render rectangles now!


Now let's draw a hexagon. This is somewhat harder to draw manually, so let's create a helper function

📄 src/webgl-hello-world.js
```diff
      150, 0, // bottom right
  ];
  
+ function createHexagon(center, radius, segmentsCount) {
+     
+ }
+ 
  const positionData = new Float32Array(triangles);
  
  const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

```
We need to iterate over (360 - segment angle) degrees with a step of a signle segment angle

📄 src/webgl-hello-world.js
```diff
  gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);
  gl.uniform4fv(colorUniformLocation, [255, 0, 0, 255]);
  
- const triangles = [
-     // first triangle
-     0, 150, // top left
-     150, 150, // top right
-     0, 0, // bottom left
-     
-     // second triangle
-     0, 0, // bottom left
-     150, 150, // top right
-     150, 0, // bottom right
- ];
- 
- function createHexagon(center, radius, segmentsCount) {
-     
+ const triangles = [createHexagon()];
+ 
+ function createHexagon(centerX, centerY, radius, segmentsCount) {
+     const vertices = [];
+ 
+     for (let i = 0; i < Math.PI * 2; i += Math.PI * 2 / (segmentsCount - 1)) {
+         
+     }
+ 
+     return vertices;
  }
  
  const positionData = new Float32Array(triangles);

```
And apply some simple school math

![Hexagon](https://git-tutor-assets.s3.eu-west-2.amazonaws.com/hexagon.png)

📄 src/webgl-hello-world.js
```diff
  gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);
  gl.uniform4fv(colorUniformLocation, [255, 0, 0, 255]);
  
- const triangles = [createHexagon()];
+ const triangles = createHexagon(canvas.width / 2, canvas.height / 2, canvas.height / 2, 6);
  
  function createHexagon(centerX, centerY, radius, segmentsCount) {
      const vertices = [];
+     const segmentAngle =  Math.PI * 2 / (segmentsCount - 1);
  
-     for (let i = 0; i < Math.PI * 2; i += Math.PI * 2 / (segmentsCount - 1)) {
-         
+     for (let i = 0; i < Math.PI * 2; i += segmentAngle) {
+         const from = i;
+         const to = i + segmentAngle;
+ 
+         vertices.push(centerX, centerY);
+         vertices.push(centerX + Math.cos(from) * radius, centerY + Math.sin(from) * radius);
+         vertices.push(centerX + Math.cos(to) * radius, centerY + Math.sin(to) * radius);
      }
  
      return vertices;

```
Now how do we render circle?
Actually a circle can be built with the same function, we just need to increase the number of "segments"

📄 src/webgl-hello-world.js
```diff
  gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);
  gl.uniform4fv(colorUniformLocation, [255, 0, 0, 255]);
  
- const triangles = createHexagon(canvas.width / 2, canvas.height / 2, canvas.height / 2, 6);
+ const triangles = createHexagon(canvas.width / 2, canvas.height / 2, canvas.height / 2, 360);
  
  function createHexagon(centerX, centerY, radius, segmentsCount) {
      const vertices = [];

```
![Circle](https://git-tutor-assets.s3.eu-west-2.amazonaws.com/circle.png)


## Varyings

Ok, what next? Let's add some color 🎨
As we already know, we can pass a color to a fragment shader via `uniform`
But that's not the only way.
Vertex shader can pass a `varying` to a fragment shader for each vertex, and the value will be interpolated

Sounds a bit complicated, let's see how it works


We need to define a `varying` in both vertex and fragment shaders.
Make sure type matches. If e.g. varying will be `vec3` in vertex shader and `vec4` in fragment shader – `gl.linkProgram(program)` will fail. You can check if program was successfully linked with `gl.getProgramParameter(program, gl.LINK_STATUS)` and if it is false – `gl.getProgramInfoLog(program)` to see what went wrang

📄 src/webgl-hello-world.js
```diff
  attribute vec2 position;
  uniform vec2 resolution;
  
+ varying vec4 vColor;
+ 
  #define M_PI 3.1415926535897932384626433832795
  
  void main() {
      vec2 transformedPosition = position / resolution * 2.0 - 1.0;
      gl_PointSize = 2.0;
      gl_Position = vec4(transformedPosition, 0, 1);
+ 
+     vColor = vec4(255, 0, 0, 255);
  }
  `;
  
  const fShaderSource = `
      precision mediump float;
-     uniform vec4 color;
+ 
+     varying vec4 vColor;
  
      void main() {
-         gl_FragColor = color / 255.0;
+         gl_FragColor = vColor / 255.0;
      }
  `;
  
  
  const positionPointer = gl.getAttribLocation(program, 'position');
  const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
- const colorUniformLocation = gl.getUniformLocation(program, 'color');
  
  gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);
- gl.uniform4fv(colorUniformLocation, [255, 0, 0, 255]);
  
  const triangles = createHexagon(canvas.width / 2, canvas.height / 2, canvas.height / 2, 360);
  

```
Now let's try to colorize our circle based on `gl_Position`

📄 src/webgl-hello-world.js
```diff
      gl_PointSize = 2.0;
      gl_Position = vec4(transformedPosition, 0, 1);
  
-     vColor = vec4(255, 0, 0, 255);
+     vColor = vec4((gl_Position.xy + 1.0 / 2.0) * 255.0, 0, 255);
  }
  `;
  

```
![Colorized circle](https://git-tutor-assets.s3.eu-west-2.amazonaws.com/colorized-circle.png)

Looks cool, right?

But how do we pass some specific colors from js?


We need to create another attribute

📄 src/webgl-hello-world.js
```diff
  
  const vShaderSource = `
  attribute vec2 position;
+ attribute vec4 color;
  uniform vec2 resolution;
  
  varying vec4 vColor;
      gl_PointSize = 2.0;
      gl_Position = vec4(transformedPosition, 0, 1);
  
-     vColor = vec4((gl_Position.xy + 1.0 / 2.0) * 255.0, 0, 255);
+     vColor = color;
  }
  `;
  
  
  gl.useProgram(program);
  
- const positionPointer = gl.getAttribLocation(program, 'position');
+ const positionLocation = gl.getAttribLocation(program, 'position');
+ const colorLocation = gl.getAttribLocation(program, 'color');
+ 
  const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
  
  gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);
  const stride = 0;
  const offset = 0;
  
- gl.enableVertexAttribArray(positionPointer);
- gl.vertexAttribPointer(positionPointer, attributeSize, type, nomralized, stride, offset);
+ gl.enableVertexAttribArray(positionLocation);
+ gl.vertexAttribPointer(positionLocation, attributeSize, type, nomralized, stride, offset);
  
  gl.drawArrays(gl.TRIANGLES, 0, positionData.length / 2);

```
Setup buffer for this attribute

📄 src/webgl-hello-world.js
```diff
  }
  
  const positionData = new Float32Array(triangles);
+ const colorData = new Float32Array(colors);
  
  const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
+ const colorBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
+ 
+ gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
+ gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);

```
Fill buffer with data

📄 src/webgl-hello-world.js
```diff
  gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);
  
  const triangles = createHexagon(canvas.width / 2, canvas.height / 2, canvas.height / 2, 360);
+ const colors = fillWithColors(360);
  
  function createHexagon(centerX, centerY, radius, segmentsCount) {
      const vertices = [];
      return vertices;
  }
  
+ function fillWithColors(segmentsCount) {
+     const colors = [];
+ 
+     for (let i = 0; i < segmentsCount; i++) {
+         for (let j = 0; j < 3; j++) {
+             if (j == 0) { // vertex in center of circle
+                 colors.push(0, 0, 0, 255);
+             } else {
+                 colors.push(i / 360 * 255, 0, 0, 255);
+             }
+         }
+     }
+ 
+     return colors;
+ }
+ 
  const positionData = new Float32Array(triangles);
  const colorData = new Float32Array(colors);
  

```
And setup the attribute pointer (the way how attribute reads data from the buffer).

📄 src/webgl-hello-world.js
```diff
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, attributeSize, type, nomralized, stride, offset);
  
+ gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
+ 
+ gl.enableVertexAttribArray(colorLocation);
+ gl.vertexAttribPointer(colorLocation, 4, type, nomralized, stride, offset);
+ 
  gl.drawArrays(gl.TRIANGLES, 0, positionData.length / 2);

```
Notice this `gl.bindBuffer` before attribute related calls. `gl.vertexAttribPointer` points attribute to a buffer which wa most recently bound, don't forget this step, this is a common mistake


![Colored circle](https://git-tutor-assets.s3.eu-west-2.amazonaws.com/colored-circle-2.png)

### Conclusion

We've learned another way to pass data to a fragment shader.
This is useful for per vertex colors and textures (we'll work with textures later)

### Homework

Render a 7-gon and colorize each triangle with colors of rainbow 🌈

See you tomorrow 👋

---

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Soruce code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)


## Day 5. Interleaved buffers

This is a series of blog posts related to WebGL. New post will be available every day

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Source code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)


Hey 👋 Welcome to a WebGL month. [Yesterday](https://dev.to/lesnitsky/shader-varyings-2p0f) we've learned how to use varyings. Today we're going to explore one more concept, but let's solve a homework from yesterday first


We need to define raingbow colors first

📄 src/webgl-hello-world.js
```diff
  
  gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);
  
+ const rainbowColors = [
+     [255, 0.0, 0.0, 255], // red
+     [255, 165, 0.0, 255], // orange
+     [255, 255, 0.0, 255], // yellow
+     [0.0, 255, 0.0, 255], // green
+     [0.0, 101, 255, 255], // skyblue
+     [0.0, 0.0, 255, 255], // blue,
+     [128, 0.0, 128, 255], // purple
+ ];
+ 
  const triangles = createHexagon(canvas.width / 2, canvas.height / 2, canvas.height / 2, 360);
  const colors = fillWithColors(360);
  

```
Render a 7-gon

📄 src/webgl-hello-world.js
```diff
      [128, 0.0, 128, 255], // purple
  ];
  
- const triangles = createHexagon(canvas.width / 2, canvas.height / 2, canvas.height / 2, 360);
- const colors = fillWithColors(360);
+ const triangles = createHexagon(canvas.width / 2, canvas.height / 2, canvas.height / 2, 7);
+ const colors = fillWithColors(7);
  
  function createHexagon(centerX, centerY, radius, segmentsCount) {
      const vertices = [];

```
Fill colors buffer with rainbow colors

📄 src/webgl-hello-world.js
```diff
  
      for (let i = 0; i < segmentsCount; i++) {
          for (let j = 0; j < 3; j++) {
-             if (j == 0) { // vertex in center of circle
-                 colors.push(0, 0, 0, 255);
-             } else {
-                 colors.push(i / 360 * 255, 0, 0, 255);
-             }
+             colors.push(...rainbowColors[i]);
          }
      }
  

```
![Rainbow](https://git-tutor-assets.s3.eu-west-2.amazonaws.com/rainbow.png)

Where's the red? Well, to render 7 polygons, we need 8-gon 🤦 My bad, sorry.


Now we have a colored 8-gon and we store vertices coordinates and colors in two separate buffers.
Having two separate buffers allows to update them separately (imagine we need to change colors, but not positions)

On the other hand if both positions and colors will be the same – we can store this data in a single buffer.

Let's refactor the code to acheive it


We need to structure our buffer data by attribute.

```
x1, y1, color.r, color.g, color.b, color.a
x2, y2, color.r, color.g, color.b, color.a
x3, y3, color.r, color.g, color.b, color.a
...
```

📄 src/webgl-hello-world.js
```diff
  ];
  
  const triangles = createHexagon(canvas.width / 2, canvas.height / 2, canvas.height / 2, 7);
- const colors = fillWithColors(7);
  
  function createHexagon(centerX, centerY, radius, segmentsCount) {
-     const vertices = [];
+     const vertexData = [];
      const segmentAngle =  Math.PI * 2 / (segmentsCount - 1);
  
      for (let i = 0; i < Math.PI * 2; i += segmentAngle) {
          const from = i;
          const to = i + segmentAngle;
  
-         vertices.push(centerX, centerY);
-         vertices.push(centerX + Math.cos(from) * radius, centerY + Math.sin(from) * radius);
-         vertices.push(centerX + Math.cos(to) * radius, centerY + Math.sin(to) * radius);
+         const color = rainbowColors[i / segmentAngle];
+ 
+         vertexData.push(centerX, centerY);
+         vertexData.push(...color);
+ 
+         vertexData.push(centerX + Math.cos(from) * radius, centerY + Math.sin(from) * radius);
+         vertexData.push(...color);
+ 
+         vertexData.push(centerX + Math.cos(to) * radius, centerY + Math.sin(to) * radius);
+         vertexData.push(...color);
      }
  
-     return vertices;
+     return vertexData;
  }
  
  function fillWithColors(segmentsCount) {

```
We don't need color buffer anymore

📄 src/webgl-hello-world.js
```diff
  }
  
  const positionData = new Float32Array(triangles);
- const colorData = new Float32Array(colors);
- 
  const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
- const colorBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
- 
- gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
- gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);

```
and it also makes sense to rename `positionData` and `positionBuffer` to a `vertexData` and `vertexBuffer`

📄 src/webgl-hello-world.js
```diff
      return colors;
  }
  
- const positionData = new Float32Array(triangles);
- const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
+ const vertexData = new Float32Array(triangles);
+ const vertexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
  
- gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
- gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
+ gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
+ gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
  gl.lineWidth(10);
  
  const attributeSize = 2;

```
But how do we specify how this data should be read from buffer and passed to a valid shader attributes

We can do this with `vertexAttribPointer`, `stride` and `offset` arguments

`stride` tells how much data should be read for each vertex in bytes

Each vertex contains:

- position (x, y, 2 floats)
- color (r, g, b, a, 4 floats)

So we have a total of `6` floats `4` bytes each
This means that stride is `6 * 4`


Offset specifies how much data should be skipped in the beginning of the chunk

Color data goes right after position, position is 2 floats, so offset for color is `2 * 4`

📄 src/webgl-hello-world.js
```diff
  const attributeSize = 2;
  const type = gl.FLOAT;
  const nomralized = false;
- const stride = 0;
+ const stride = 24;
  const offset = 0;
  
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, attributeSize, type, nomralized, stride, offset);
  
- gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
- 
  gl.enableVertexAttribArray(colorLocation);
- gl.vertexAttribPointer(colorLocation, 4, type, nomralized, stride, offset);
+ gl.vertexAttribPointer(colorLocation, 4, type, nomralized, stride, 8);
  
- gl.drawArrays(gl.TRIANGLES, 0, positionData.length / 2);
+ gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 6);

```
And voila, we have the same result, but with a single buffer 🎉


### Conclusion

Let's summarize how `vertexAttribPointer(location, size, type, normalized, stride offset)` method works for a single buffer (this buffer is called interleavd)

- `location`: specifies which attribute do we want to setup
- `size`: how much data should be read for this exact attribute
- `type`: type of data being read
- `normalized`: whether the data should be "normalized" (clamped to `[-1..1]` for gl.BYTE and gl.SHORT, and to `[0..1]` for gl.UNSIGNED_BYTE and gl.UNSIGNED_SHORT)
- `stride`: how much data is there for each vertex in total (in bytes)
- `offset`: how much data should be skipped in a beginning of each chunk of data

So now you can use different combinations of buffers to fill your attributes with data

See you tomorrow 👋

---

This is a series of blog posts related to WebGL. New post will be available every day

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Source code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)


## Day 6. Index buffer

This is a series of blog posts related to WebGL. New post will be available every day

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Source code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)

Hey 👋Welcome back to WebGL month. [Yesterday](https://dev.to/lesnitsky/webgl-month-day-5-interleaved-buffers-2k9a) we've learned how to use interleaved buffers. However our buffer contains a lot of duplicate data, because some polygons share the same vertices


Let's get back to a simple example of rectangle

📄 src/webgl-hello-world.js
```diff
      [128, 0.0, 128, 255], // purple
  ];
  
- const triangles = createHexagon(canvas.width / 2, canvas.height / 2, canvas.height / 2, 7);
+ const triangles = createRect(0, 0, canvas.height, canvas.height);
  
  function createHexagon(centerX, centerY, radius, segmentsCount) {
      const vertexData = [];

```
and fill it only with unique vertex coordinates

📄 src/webgl-hello-world.js
```diff
  
  const triangles = createRect(0, 0, canvas.height, canvas.height);
  
+ function createRect(top, left, width, height) {
+     return [
+         left, top, // x1 y1
+         left + width, top, // x2 y2
+         left, top + height, // x3 y3
+         left + width, top + height, // x4 y4
+     ];
+ }
+ 
  function createHexagon(centerX, centerY, radius, segmentsCount) {
      const vertexData = [];
      const segmentAngle =  Math.PI * 2 / (segmentsCount - 1);

```
Let's also disable color attribute for now

📄 src/webgl-hello-world.js
```diff
  const attributeSize = 2;
  const type = gl.FLOAT;
  const nomralized = false;
- const stride = 24;
+ const stride = 0;
  const offset = 0;
  
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, attributeSize, type, nomralized, stride, offset);
  
- gl.enableVertexAttribArray(colorLocation);
- gl.vertexAttribPointer(colorLocation, 4, type, nomralized, stride, 8);
+ // gl.enableVertexAttribArray(colorLocation);
+ // gl.vertexAttribPointer(colorLocation, 4, type, nomralized, stride, 8);
  
  gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 6);

```
Ok, so our buffer contains 4 vertices, but how does webgl render 2 triangles with only 4 vertices?
THere's a special type of buffer which can specify how to fetch data from vertex buffer and build primitives (in our case triangles)


This buffer is called `index buffer` and it contains indices of vertex data chunks in vertex buffer.
So we need to specify indices of triangle vertices.

📄 src/webgl-hello-world.js
```diff
  const vertexData = new Float32Array(triangles);
  const vertexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
  
+ const indexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
+ 
+ const indexData = new Uint6Array([
+     0, 1, 2, // first triangle
+     1, 2, 3, // second trianlge
+ ]);
+ 
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
  gl.lineWidth(10);

```
Next step – upload data to a WebGL buffer.
To tell GPU that we're using `index buffer` we need to pass `gl.ELEMENT_ARRAY_BUFFER` as a first argument of `gl.bindBuffer` and `gl.bufferData`

📄 src/webgl-hello-world.js
```diff
      1, 2, 3, // second trianlge
  ]);
  
+ gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
+ gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
+ 
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
  gl.lineWidth(10);

```
And the final step: to render indexed vertices we need to call different method – `drawElements` instead of `drawArrays`

📄 src/webgl-hello-world.js
```diff
  
  const indexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
  
- const indexData = new Uint6Array([
+ const indexData = new Uint8Array([
      0, 1, 2, // first triangle
      1, 2, 3, // second trianlge
  ]);
  // gl.enableVertexAttribArray(colorLocation);
  // gl.vertexAttribPointer(colorLocation, 4, type, nomralized, stride, 8);
  
- gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 6);
+ gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_BYTE, 0);

```
Wait, why is nothing rendered?


The reason is that we've disabled color attribute, so it got filled with zeros. (0, 0, 0, 0) – transparent black.
Let's fix that

📄 src/webgl-hello-world.js
```diff
  
      void main() {
          gl_FragColor = vColor / 255.0;
+         gl_FragColor.a = 1.0;
      }
  `;
  

```
### Conclusion

We now know how to use index buffer to eliminate number of vertices we need to upload to gpu.
Rectangle example is very simple (only 2 vertices are duplicated), on the other hand this is 33%, so on a larger amount of data being rendered this might be quite a performance improvement, especially if you update vertex data frequently and reupload buffer contents

### Homework

Render n-gon using index buffer

See you tomorrow 👋

---

This is a series of blog posts related to WebGL. New post will be available every day

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Source code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)


## WebGL month. Day 7. Tooling and refactor

This is a series of blog posts related to WebGL. New post will be available every day

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Source code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)

---

Hey 👋

Welcome to the WebGL month.

Since our codebase grows and will keep getting more complicated, we need some tooling and cleanup.


We'll need webpack, so let's create `package.json` and install it

📄 package.json
```json
{
  "name": "webgl-month",
  "version": "1.0.0",
  "description": "Daily WebGL tutorials",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/lesnitsky/webgl-month.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/lesnitsky/webgl-month/issues"
  },
  "homepage": "https://github.com/lesnitsky/webgl-month#readme",
  "devDependencies": {
    "webpack": "^4.35.2",
    "webpack-cli": "^3.3.5"
  }
}

```
We'll need a simple webpack config

📄 webpack.config.js
```js
const path = require('path');

module.exports = {
    entry: {
        'week-1': './src/week-1.js',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },

    mode: 'development',
};

```
and update script source

📄 index.html
```diff
    </head>
    <body>
      <canvas></canvas>
-     <script src="./src/webgl-hello-world.js"></script>
+     <script src="./dist/week-1.js"></script>
    </body>
  </html>

```
Since shaders are raw strings, we can store shader source in separate file and use `raw-loader` for `webpack`.

📄 package.json
```diff
    },
    "homepage": "https://github.com/lesnitsky/webgl-month#readme",
    "devDependencies": {
+     "raw-loader": "^3.0.0",
      "webpack": "^4.35.2",
      "webpack-cli": "^3.3.5"
    }

```
📄 webpack.config.js
```diff
          filename: '[name].js',
      },
  
+     module: {
+         rules: [
+             {
+                 test: /\.glsl$/,
+                 use: 'raw-loader',
+             },
+         ],
+     },
+ 
      mode: 'development',
  };

```
and let's actually move shaders to separate files

📄 src/shaders/fragment.glsl
```glsl
precision mediump float;

varying vec4 vColor;

void main() {
    gl_FragColor = vColor / 255.0;
    gl_FragColor.a = 1.0;
}

```
📄 src/shaders/vertex.glsl
```glsl
attribute vec2 position;
attribute vec4 color;
uniform vec2 resolution;

varying vec4 vColor;

#define M_PI 3.1415926535897932384626433832795

void main() {
    vec2 transformedPosition = position / resolution * 2.0 - 1.0;
    gl_PointSize = 2.0;
    gl_Position = vec4(transformedPosition, 0, 1);

    vColor = color;
}

```
📄 src/week-1.js
```diff
+ import vShaderSource from './shaders/vertex.glsl';
+ import fShaderSource from './shaders/fragment.glsl';
+ 
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');
  
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  
- const vShaderSource = `
- attribute vec2 position;
- attribute vec4 color;
- uniform vec2 resolution;
- 
- varying vec4 vColor;
- 
- #define M_PI 3.1415926535897932384626433832795
- 
- void main() {
-     vec2 transformedPosition = position / resolution * 2.0 - 1.0;
-     gl_PointSize = 2.0;
-     gl_Position = vec4(transformedPosition, 0, 1);
- 
-     vColor = color;
- }
- `;
- 
- const fShaderSource = `
-     precision mediump float;
- 
-     varying vec4 vColor;
- 
-     void main() {
-         gl_FragColor = vColor / 255.0;
-         gl_FragColor.a = 1.0;
-     }
- `;
- 
  function compileShader(shader, source) {
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

```
We can also move functions which create vertices positions to separate file

📄 src/shape-helpers.js
```js
export function createRect(top, left, width, height) {
    return [
        left, top, // x1 y1
        left + width, top, // x2 y2
        left, top + height, // x3 y3
        left + width, top + height, // x4 y4
    ];
}

export function createHexagon(centerX, centerY, radius, segmentsCount) {
    const vertexData = [];
    const segmentAngle =  Math.PI * 2 / (segmentsCount - 1);

    for (let i = 0; i < Math.PI * 2; i += segmentAngle) {
        const from = i;
        const to = i + segmentAngle;

        const color = rainbowColors[i / segmentAngle];

        vertexData.push(centerX, centerY);
        vertexData.push(...color);

        vertexData.push(centerX + Math.cos(from) * radius, centerY + Math.sin(from) * radius);
        vertexData.push(...color);

        vertexData.push(centerX + Math.cos(to) * radius, centerY + Math.sin(to) * radius);
        vertexData.push(...color);
    }

    return vertexData;
}

```
📄 src/week-1.js
```diff
  import vShaderSource from './shaders/vertex.glsl';
  import fShaderSource from './shaders/fragment.glsl';
  
+ import { createRect } from './shape-helpers';
+ 
+ 
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');
  
  
  const triangles = createRect(0, 0, canvas.height, canvas.height);
  
- function createRect(top, left, width, height) {
-     return [
-         left, top, // x1 y1
-         left + width, top, // x2 y2
-         left, top + height, // x3 y3
-         left + width, top + height, // x4 y4
-     ];
- }
- 
- function createHexagon(centerX, centerY, radius, segmentsCount) {
-     const vertexData = [];
-     const segmentAngle =  Math.PI * 2 / (segmentsCount - 1);
- 
-     for (let i = 0; i < Math.PI * 2; i += segmentAngle) {
-         const from = i;
-         const to = i + segmentAngle;
- 
-         const color = rainbowColors[i / segmentAngle];
- 
-         vertexData.push(centerX, centerY);
-         vertexData.push(...color);
- 
-         vertexData.push(centerX + Math.cos(from) * radius, centerY + Math.sin(from) * radius);
-         vertexData.push(...color);
- 
-         vertexData.push(centerX + Math.cos(to) * radius, centerY + Math.sin(to) * radius);
-         vertexData.push(...color);
-     }
- 
-     return vertexData;
- }
- 
  function fillWithColors(segmentsCount) {
      const colors = [];
  

```
Since we're no longer using color attribute, we can drop everyhting related to it

📄 src/shaders/fragment.glsl
```diff
  precision mediump float;
  
- varying vec4 vColor;
- 
  void main() {
-     gl_FragColor = vColor / 255.0;
-     gl_FragColor.a = 1.0;
+     gl_FragColor = vec4(1, 0, 0, 1);
  }

```
📄 src/shaders/vertex.glsl
```diff
  attribute vec2 position;
- attribute vec4 color;
  uniform vec2 resolution;
  
- varying vec4 vColor;
- 
  #define M_PI 3.1415926535897932384626433832795
  
  void main() {
      vec2 transformedPosition = position / resolution * 2.0 - 1.0;
      gl_PointSize = 2.0;
      gl_Position = vec4(transformedPosition, 0, 1);
- 
-     vColor = color;
  }

```
📄 src/week-1.js
```diff
  
  import { createRect } from './shape-helpers';
  
- 
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');
  
  gl.useProgram(program);
  
  const positionLocation = gl.getAttribLocation(program, 'position');
- const colorLocation = gl.getAttribLocation(program, 'color');
- 
  const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
  
  gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);
  
- const rainbowColors = [
-     [255, 0.0, 0.0, 255], // red
-     [255, 165, 0.0, 255], // orange
-     [255, 255, 0.0, 255], // yellow
-     [0.0, 255, 0.0, 255], // green
-     [0.0, 101, 255, 255], // skyblue
-     [0.0, 0.0, 255, 255], // blue,
-     [128, 0.0, 128, 255], // purple
- ];
- 
  const triangles = createRect(0, 0, canvas.height, canvas.height);
  
- function fillWithColors(segmentsCount) {
-     const colors = [];
- 
-     for (let i = 0; i < segmentsCount; i++) {
-         for (let j = 0; j < 3; j++) {
-             colors.push(...rainbowColors[i]);
-         }
-     }
- 
-     return colors;
- }
- 
  const vertexData = new Float32Array(triangles);
  const vertexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
  
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, attributeSize, type, nomralized, stride, offset);
  
- // gl.enableVertexAttribArray(colorLocation);
- // gl.vertexAttribPointer(colorLocation, 4, type, nomralized, stride, 8);
- 
  gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_BYTE, 0);

```
Webpack will help us keep our codebase cleaner in the future, but we're good for now

See you tomorrow 👋

---

This is a series of blog posts related to WebGL. New post will be available every day

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Source code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)


## Day 8. Textures

This is a series of blog posts related to WebGL. New post will be available every day

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Source code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)

---

Hey 👋 Welcome back to WebGL month.

We've already learned several ways to pass color data to shader, but there is one more and it is very powerful. Today we'll learn about textures


Let's create simple shaders

📄 src/shaders/texture.f.glsl
```glsl
precision mediump float;

void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
}

```
📄 src/shaders/texture.v.glsl
```glsl
attribute vec2 position;

void main() {
    gl_Position = vec4(position, 0, 1);
}

```
📄 src/texture.js
```js
import vShaderSource from './shaders/texture.v.glsl';
import fShaderSource from './shaders/texture.f.glsl';

```
Get the webgl context

📄 src/texture.js
```diff
  import vShaderSource from './shaders/texture.v.glsl';
  import fShaderSource from './shaders/texture.f.glsl';
+ 
+ const canvas = document.querySelector('canvas');
+ const gl = canvas.getContext('webgl');

```
Create shaders

📄 src/texture.js
```diff
  import vShaderSource from './shaders/texture.v.glsl';
  import fShaderSource from './shaders/texture.f.glsl';
+ import { compileShader } from './gl-helpers';
  
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');
+ 
+ const vShader = gl.createShader(gl.VERTEX_SHADER);
+ const fShader = gl.createShader(gl.FRAGMENT_SHADER);
+ 
+ compileShader(gl, vShader, vShaderSource);
+ compileShader(gl, fShader, fShaderSource);

```
and program

📄 src/texture.js
```diff
  
  compileShader(gl, vShader, vShaderSource);
  compileShader(gl, fShader, fShaderSource);
+ 
+ const program = gl.createProgram();
+ 
+ gl.attachShader(program, vShader);
+ gl.attachShader(program, fShader);
+ 
+ gl.linkProgram(program);
+ gl.useProgram(program);

```
Create a vertex position buffer and fill it with data

📄 src/texture.js
```diff
  import vShaderSource from './shaders/texture.v.glsl';
  import fShaderSource from './shaders/texture.f.glsl';
  import { compileShader } from './gl-helpers';
+ import { createRect } from './shape-helpers';
+ 
  
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');
  
  gl.linkProgram(program);
  gl.useProgram(program);
+ 
+ const vertexPosition = new Float32Array(createRect(-1, -1, 2, 2));
+ const vertexPositionBuffer = gl.createBuffer();
+ 
+ gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
+ gl.bufferData(gl.ARRAY_BUFFER, vertexPosition, gl.STATIC_DRAW);

```
Setup position attribute

📄 src/texture.js
```diff
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexPosition, gl.STATIC_DRAW);
+ 
+ const attributeLocations = {
+     position: gl.getAttribLocation(program, 'position'),
+ };
+ 
+ gl.enableVertexAttribArray(attributeLocations.position);
+ gl.vertexAttribPointer(attributeLocations.position, 2, gl.FLOAT, false, 0, 0);

```
setup index buffer

📄 src/texture.js
```diff
  
  gl.enableVertexAttribArray(attributeLocations.position);
  gl.vertexAttribPointer(attributeLocations.position, 2, gl.FLOAT, false, 0, 0);
+ 
+ const vertexIndices = new Uint8Array([0, 1, 2, 1, 2, 3]);
+ const indexBuffer = gl.createBuffer();
+ 
+ gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
+ gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vertexIndices, gl.STATIC_DRAW);

```
and issue a draw call

📄 src/texture.js
```diff
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vertexIndices, gl.STATIC_DRAW);
+ 
+ gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_BYTE, 0);

```
So now we can proceed to textures.

You can upload image to a GPU and use it to calculate pixel color. In a simple case, when canvas size is the same or at least proportional to image size, we can render image pixel by pixel reading each pixel color of image and using it as `gl_FragColor`

Let's make a helper to load images

📄 src/gl-helpers.js
```diff
          throw new Error(log);
      }
  }
+ 
+ export async function loadImage(src) {
+     const img = new Image();
+ 
+     let _resolve;
+     const p = new Promise((resolve) => _resolve = resolve);
+ 
+     img.onload = () => {
+         _resolve(img);
+     }
+ 
+     img.src = src;
+ 
+     return p;
+ }

```
Load image and create webgl texture

📄 src/texture.js
```diff
  import vShaderSource from './shaders/texture.v.glsl';
  import fShaderSource from './shaders/texture.f.glsl';
- import { compileShader } from './gl-helpers';
+ import { compileShader, loadImage } from './gl-helpers';
  import { createRect } from './shape-helpers';
  
+ import textureImageSrc from '../assets/images/texture.jpg';
  
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vertexIndices, gl.STATIC_DRAW);
  
- gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_BYTE, 0);
+ loadImage(textureImageSrc).then((textureImg) => {
+     const texture = gl.createTexture();
+ 
+     gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_BYTE, 0);
+ });

```
[GTI} add image

📄 assets/images/texture.jpg
```jpg

```
we also need an appropriate webpack loader

📄 package.json
```diff
    "homepage": "https://github.com/lesnitsky/webgl-month#readme",
    "devDependencies": {
      "raw-loader": "^3.0.0",
+     "url-loader": "^2.0.1",
      "webpack": "^4.35.2",
      "webpack-cli": "^3.3.5"
    }

```
📄 webpack.config.js
```diff
                  test: /\.glsl$/,
                  use: 'raw-loader',
              },
+ 
+             {
+                 test: /\.jpg$/,
+                 use: 'url-loader',
+             },
          ],
      },
  

```
to operate with textures we need to do the same as with buffers – bind it

📄 src/texture.js
```diff
  loadImage(textureImageSrc).then((textureImg) => {
      const texture = gl.createTexture();
  
+     gl.bindTexture(gl.TEXTURE_2D, texture);
+ 
      gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_BYTE, 0);
  });

```
and upload image to a bound texture

📄 src/texture.js
```diff
  
      gl.bindTexture(gl.TEXTURE_2D, texture);
  
+     gl.texImage2D(
+         gl.TEXTURE_2D,
+     );
+ 
      gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_BYTE, 0);
  });

```
Let's ignore the 2nd argument for now, we'll speak about it later

📄 src/texture.js
```diff
  
      gl.texImage2D(
          gl.TEXTURE_2D,
+         0,
      );
  
      gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_BYTE, 0);

```
the 3rd and the 4th argumetns specify internal texture format and source (image) format. For our image it is gl.RGBA. [Check out this page for more details about formats](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D)

📄 src/texture.js
```diff
      gl.texImage2D(
          gl.TEXTURE_2D,
          0,
+         gl.RGBA,
+         gl.RGBA,
      );
  
      gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_BYTE, 0);

```
next argument specifies source type (0..255 is UNSIGNED_BYTE)

📄 src/texture.js
```diff
          0,
          gl.RGBA,
          gl.RGBA,
+         gl.UNSIGNED_BYTE,
      );
  
      gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_BYTE, 0);

```
and image itself

📄 src/texture.js
```diff
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
+         textureImg,
      );
  
      gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_BYTE, 0);

```
We also need to specify different parameters of texture. We'll talk about this parameters in next tutorials.

📄 src/texture.js
```diff
          textureImg,
      );
  
+     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
+     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
+     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
+     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
+ 
      gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_BYTE, 0);
  });

```
To be able to work with texture in shader we need to specify a uniform of `sampler2D` type

📄 src/shaders/texture.f.glsl
```diff
  precision mediump float;
  
+ uniform sampler2D texture;
+ 
  void main() {
      gl_FragColor = vec4(1, 0, 0, 1);
  }

```
and specify the value of this uniform. There is a way to use multiple textures, we'll talk about it in next tutorials

📄 src/texture.js
```diff
      position: gl.getAttribLocation(program, 'position'),
  };
  
+ const uniformLocations = {
+     texture: gl.getUniformLocation(program, 'texture'),
+ };
+ 
  gl.enableVertexAttribArray(attributeLocations.position);
  gl.vertexAttribPointer(attributeLocations.position, 2, gl.FLOAT, false, 0, 0);
  
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  
+     gl.activeTexture(gl.TEXTURE0);
+     gl.uniform1i(uniformLocations.texture, 0);
+ 
      gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_BYTE, 0);
  });

```
Let's also pass canvas resolution to a shader

📄 src/shaders/texture.f.glsl
```diff
  precision mediump float;
  
  uniform sampler2D texture;
+ uniform vec2 resolution;
  
  void main() {
      gl_FragColor = vec4(1, 0, 0, 1);

```
📄 src/texture.js
```diff
  
  const uniformLocations = {
      texture: gl.getUniformLocation(program, 'texture'),
+     resolution: gl.getUniformLocation(program, 'resolution'),
  };
  
  gl.enableVertexAttribArray(attributeLocations.position);
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(uniformLocations.texture, 0);
  
+     gl.uniform2fv(uniformLocations.resolution, [canvas.width, canvas.height]);
+ 
      gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_BYTE, 0);
  });

```
There is a special `gl_FragCoord` variable which contains coordinate of each pixel. Together with `resolution` uniform we can get a `texture coordinate` (coordinate of the pixel in image). Texture coordinates are in range `[0..1]`.

📄 src/shaders/texture.f.glsl
```diff
  uniform vec2 resolution;
  
  void main() {
+     vec2 texCoord = gl_FragCoord.xy / resolution;
      gl_FragColor = vec4(1, 0, 0, 1);
  }

```
and use `texture2D` to render the whole image.

📄 src/shaders/texture.f.glsl
```diff
  
  void main() {
      vec2 texCoord = gl_FragCoord.xy / resolution;
-     gl_FragColor = vec4(1, 0, 0, 1);
+     gl_FragColor = texture2D(texture, texCoord);
  }

```
Cool 😎 We can now render images, but there is much more to learn about textures, so see you tomorrow

---

This is a series of blog posts related to WebGL. New post will be available every day

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Source code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)


## WebGL Month. Day 9. Image filters

This is a series of blog posts related to WebGL. New post will be available every day

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Source code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)


Hey 👋 Welcome back to WebGL month

[Yesterday](https://dev.to/lesnitsky/webgl-month-day-8-textures-1mk8) we've learned how to use textures in webgl, so let's get advantage of that knowledge to build something fun.

Today we're going to explore how to implement simple image filters


### Inverse

The very first and simple filter might be inverse all colors of the image.

How do we inverse colors?

Original values are in range `[0..1]`

If we subtract from each component `1` we'll get negative values, there's an `abs` function in glsl

You can also define other functions apart of `void main` in glsl pretty much like in C/C++, so let's create `inverse` function

📄 src/shaders/texture.f.glsl
```diff
  uniform sampler2D texture;
  uniform vec2 resolution;
  
+ vec4 inverse(vec4 color) {
+     return abs(vec4(color.rgb - 1.0, color.a));
+ }
+ 
  void main() {
      vec2 texCoord = gl_FragCoord.xy / resolution;
      gl_FragColor = texture2D(texture, texCoord);

```
and let's actually use it

📄 src/shaders/texture.f.glsl
```diff
  void main() {
      vec2 texCoord = gl_FragCoord.xy / resolution;
      gl_FragColor = texture2D(texture, texCoord);
+ 
+     gl_FragColor = inverse(gl_FragColor);
  }

```
Voila, we have an inverse filter with just 4 lines of code

![Inverse](https://git-tutor-assets.s3.eu-west-2.amazonaws.com/inverse-filter.png)


### Black and White

Let's think of how to implement black and white filter.

White color is `vec4(1, 1, 1, 1)`

Black is `vec4(0, 0, 0, 1)`

What are shades of gray? Aparently we need to add the same value to each color component.

So basically we need to calculate the "brightness" value of each component. In very naive implmentation we can just add all color components and divide by 3 (arithmetical mean).

> Note: this is not the best approach, as different colors will give the same result (eg. vec3(0.5, 0, 0) and vec3(0, 0.5, 0), but in reality these colors have different "brightness", I'm just trying to keep these examples simple to understand)

Ok, let's try to implement this

📄 src/shaders/texture.f.glsl
```diff
      return abs(vec4(color.rgb - 1.0, color.a));
  }
  
+ vec4 blackAndWhite(vec4 color) {
+     return vec4(vec3(1.0, 1.0, 1.0) * (color.r + color.g + color.b) / 3.0, color.a);
+ }
+ 
  void main() {
      vec2 texCoord = gl_FragCoord.xy / resolution;
      gl_FragColor = texture2D(texture, texCoord);
  
-     gl_FragColor = inverse(gl_FragColor);
+     gl_FragColor = blackAndWhite(gl_FragColor);
  }

```
Whoa! Looks nice

![Black and white](https://git-tutor-assets.s3.eu-west-2.amazonaws.com/black-and-white.png)


### Sepia

Ok, one more fancy effect is a "old-fashioned" photos with sepia filter.

[Sepia is reddish-brown color](https://en.wikipedia.org/wiki/Sepia_%28color%29). RGB values are `112, 66, 20`


Let's define `sepia` function and color

📄 src/shaders/texture.f.glsl
```diff
      return vec4(vec3(1.0, 1.0, 1.0) * (color.r + color.g + color.b) / 3.0, color.a);
  }
  
+ vec4 sepia(vec4 color) {
+     vec3 sepiaColor = vec3(112, 66, 20) / 255.0;
+ }
+ 
  void main() {
      vec2 texCoord = gl_FragCoord.xy / resolution;
      gl_FragColor = texture2D(texture, texCoord);

```
A naive and simple implementation will be to interpolate original color with sepia color by a certain factor. There is a `mix` function for this

📄 src/shaders/texture.f.glsl
```diff
  
  vec4 sepia(vec4 color) {
      vec3 sepiaColor = vec3(112, 66, 20) / 255.0;
+     return vec4(
+         mix(color.rgb, sepiaColor, 0.4),
+         color.a
+     );
  }
  
  void main() {
      vec2 texCoord = gl_FragCoord.xy / resolution;
      gl_FragColor = texture2D(texture, texCoord);
  
-     gl_FragColor = blackAndWhite(gl_FragColor);
+     gl_FragColor = sepia(gl_FragColor);
  }

```
Result:

![Sepia](https://git-tutor-assets.s3.eu-west-2.amazonaws.com/sepia.png)


This should give you a better idea of what can be done in fragment shader.

Try to implement some other filters, like saturation or vibrance

See you tomorrow 👋

---

This is a series of blog posts related to WebGL. New post will be available every day

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

[Source code available here](https://github.com/lesnitsky/webgl-month)

![GitHub stars](https://img.shields.io/github/stars/lesnitsky/webgl-month.svg?style=social)

> Built with [GitTutor](https://github.com/lesnitsky/git-tutor)

