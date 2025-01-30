import React, { useEffect, useState } from "react";
import "./App.css";

import * as WASM from "./wasm/test_lib";
import { VideoBackground } from "./components/VideoBackground";

function App() {
  const [permissionAsked, setPermissionAsked] = useState(false);
  const [wasmModule, setWasmModule] = useState<any>(null);

  const loadWasmModule = async () => {
    console.log("Loading WASM module...");
    const module = await WASM.default();
    console.log("WASM module loaded", module);
    setWasmModule(module);

    // var uint8Arr = new Uint8Array();
    // const numBytes = uint8Arr.length * uint8Arr.BYTES_PER_ELEMENT;
    // const dataPtr = module._malloc(numBytes);
    // const dataOnHeap = new Uint8Array(module.HEAPU8.buffer, dataPtr, numBytes);
    // dataOnHeap.set(uint8Arr);
  };

  useEffect(() => {
    if (!wasmModule) {
      loadWasmModule();
    }
  }, [wasmModule]);

  const requestPermission = async () => {
    try {
      await navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false,
        })
        .then((stream) => {
          setPermissionAsked(true);
        });
    } catch (err) {
      console.error(`An error occurred: ${err}`);
    }
  };

  return (
    <div className="App">
      {!permissionAsked && <button onClick={requestPermission}>Start</button>}

      <VideoBackground
        wasmModule={wasmModule}
        permissionAsked={permissionAsked}
      />
    </div>
  );
}

export default App;
