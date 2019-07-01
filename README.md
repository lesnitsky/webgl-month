# WebGL month

Hi 👋 My name is Andrei. I have some fun experience with WebGL and I want to share it. I'm starting a month of WebGL, each day I will post a WebGL related tutorial. Not Three.js, not pixi.js, WebGL API itself.

[Follow me on twitter](https://twitter.com/lesnitsky_a) to get WebGL month updates or [join WebGL month mailing list](http://eepurl.com/gwiSeH)


## Day 1. Intro

This is a series of blog posts related to WebGL. New post will be available every day

[Subscribe](https://twitter.com/lesnitsky_a) for updates or [join mailing list](http://eepurl.com/gwiSeH)

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