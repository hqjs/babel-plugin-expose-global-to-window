# https://hqjs.org
Explicitly expose global variables and functions to window in non module script.

# Installation
```sh
npm install hqjs@babel-plugin-expose-global-to-window
```

# Transformation
```js
var x = 1, xx = 11, xxx = 111;

if (true) {
  var y = 2;
  function w() {}
}

class A {}

function f() {
  var x = 2;
  var z = 17;
  function f() {}
  
  function g() {}
}

const z = () => 0;
```

will turn into
```js
var x = 1,
    xx = 11,
    xxx = 111;

if (true) {
  var y = 2;

  function w() {}
}

class A {}

function f() {
  var x = 2;
  var z = 17;

  function f() {}

  function g() {}
}

const z = () => 0;

window.x = x;
window.xx = xx;
window.xxx = xxx;
window.y = y;
window.f = f;
```
