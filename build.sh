#!/usr/bin/env bash

if [ ! -d "./build" ]
then
    mkdir build
    cd build

    /Users/danielfernandes/Desktop/Lab/emsdk/upstream/emscripten/emcmake cmake ..
    /Users/danielfernandes/Desktop/Lab/emsdk/upstream/emscripten/emmake make
elif [ "$1" == "--force" ]
then
    rm -rf build
    mkdir build
    cd build

    /Users/danielfernandes/Desktop/Lab/emsdk/upstream/emscripten/emcmake cmake ..
    /Users/danielfernandes/Desktop/Lab/emsdk/upstream/emscripten/emmake make
else
    cd build
    make
fi

cd ../

if [ -d "web/src/wasm/" ]; 
then
  rm web/src/wasm/*
else
  mkdir web/src/wasm/
fi

cp dist/* web/src/wasm/