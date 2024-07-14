import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import * as WASM from "./wasm/em_testing.min";

function App() {
  const [wasmModule, setWasmModule] = React.useState<any>(null);
  
  const loadWasmModule = async () => {
  
    console.log("Loading WASM module...");
    const module = await WASM.default();
    console.log("WASM module loaded", module);
    setWasmModule(module);
  };

  useEffect(() => {
    if(!wasmModule){
      loadWasmModule();
    }
  },[wasmModule]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
