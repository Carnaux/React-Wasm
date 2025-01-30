# React-Wasm

Quick workspace to work with WASM(Emscripten) and React

Tested on macOS Sonoma 14.5

Comes with OpenCV for testing

# Requisites

- Emscripten
- PKG Config
- Python3

# Folders

- build
  - Holds the build from Emscripten.
- source
  - Holds the C++ source files.
- web
  - Holds a create-react-app application that loads the built WASM files.

# Submodules

- OpenCV
  - Cloned to `source/libraries/opencv`

# Configuration

1. Change the "em_source" Emscripten path in package.json. This is a util function to make sure the terminal used has all the Emscripten variables/paths.

2. Change the "EMSCRIPTEN_ROOT" path in makem.js.

# Build OpenCVJS with PKG-Config

1. Clone the submodule(if you didnt already)

   - Run `git submodule init`
   - Run `git submodule update`

2. Open a terminal on: `source/libraries/opencv`

3. Run:

   `emcmake python3 ./platforms/js/build_js.py build_js --build_wasm --cmake_option=-DOPENCV_GENERATE_PKGCONFIG=ON`

   If emcmake is not found use the absolute path to it: `path/to/emscripten/upstream/emscripten/emcmake`

4. Make sure the emcmake completed.
5. Move the terminal to: `source/libraries/opencv/build_js`

6. Run:
   `make install`

# Build WASM

- Run `yarn/npm run build` to start the build process.
- Copy the contents of the "dist" folder to `web/src/wasm`
- Make sure the Emscripten build files have the same name while importing in App.tsx
