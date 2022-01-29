import './App.css';
import { Register } from './register';
import { Routes, Route } from 'react-router-dom';
import { Login } from './login';
import { Dashboard } from './dashboard/Dashboard';
import { useEffect } from 'react';
import { Pool } from './pool';
import { Center, Image, Link, Text } from '@chakra-ui/react';
import PoolState from './pool/PoolState';


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
        <Route path="/pool/:PoolId" element={< PoolState />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <div className='footer'>
        <Link href="https://github.com/ahmadayubi" isExternal>
          <Image src="github.png" width="15px" display="inline" />
        </Link>
        <Text fontSize="xs">© 2022, E(th)scrow, created by Ahmad Ayubi | {' '}
          <Link href='https://ahmadayubi.com' color="" isExternal>ahmadayubi.com</Link>
        </Text>
      </div>
    </div>
  );
}

const NotFound = () => {

  return (
    <div className='vertical-center'>
      <Text>Page Not Found</Text>
    </div>

  );
}

export default App;
