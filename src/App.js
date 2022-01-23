import './App.css';
import { Register } from './register';
import { Routes, Route, Router } from 'react-router-dom';
import { Login } from './login';
import { Dashboard } from './dashboard/Dashboard';
import { useEffect } from 'react';
import { Pool } from './pool';


function App() {

  useEffect(() => {

    const run = async () => {


      let { instance, module } = await WebAssembly.instantiateStreaming(fetch("/wasm/ethscrow.wasm"), window.go.importObject)
      await window.go.run(instance)
      // saving to state.. tsk tsk not sure its the most optimal but i guess it works?? also, the value isnt that "big" anyway
    }
    run();

  }, [])

  return (
    <div className="App">

      <Routes>
        <Route path="/" element={< Register />} />
        <Route path="/login" element={< Login />} />
        <Route path="/dashboard" element={< Dashboard />} />
        <Route path="/pool/:PoolId" element={< Pool />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </div>
  );
}

const NotFound = () => {

  return (
    <p>Page not found</p>
  );
}

export default App;
