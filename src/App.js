import './App.css';
import { Register } from './register';
import { Routes, Route } from 'react-router-dom';
import { Login } from './login';
import { Dashboard } from './dashboard/Dashboard';
import { useEffect, useState } from 'react';
import { Pool } from './pool';
import { useDisclosure, Image, Link, Text, Heading, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, List, ListItem, ListIcon, Progress, Center, Box } from '@chakra-ui/react';
import PoolState from './pool/PoolState';
import { CheckCircleIcon } from "@chakra-ui/icons";
import { API_URL } from "./utils/constants";

function App() {

  const pingServer = async () => {
    try {
      let ping = await fetch(API_URL + `/ping`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (ping.status === 200) {
        setServerRunning(true);
        return;
      }
    } catch (e) {
      setServerError(true);
      return
    }
  }

  useEffect(() => {
    pingServer();
    const run = async () => {
      let { instance, module } = await WebAssembly.instantiateStreaming(fetch("/wasm/ethscrow.wasm"), window.go.importObject)
      await window.go.run(instance)
      // saving to state.. tsk tsk not sure its the most optimal but i guess it works?? also, the value isnt that "big" anyway
    }
    run();
  }, []);

  const [serverError, setServerError] = useState(false);
  const [serverRunning, setServerRunning] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: RIsOpen, onOpen: ROnOpen, onClose: ROnClose } = useDisclosure();


  return (
    <div className="App">
      {!serverRunning && <Center className="vertical-center" justifyContent="center" display="flex" alignItems="center">
        <Box m='2' paddingTop='2' alignItems='center'>
          <Text>{serverError ? "The server is down :(" : "Booting up server..."}</Text>
          {!serverError && <Progress size='xs' isIndeterminate />}
          {serverError && <Progress size='xs' value={100} colorScheme="red" />}
          {serverError && <Text margin={5} maxWidth="300px">It will be up once the issue is resolved. Fortunately, none of your information can be compromised by design, you also have access to all your private keys and can use them without our server (granted you downloaded the backups).</Text>}
        </Box>

      </Center>}
      {serverRunning && <>

        <Link onClick={onOpen}>
          <Heading size='sm' width="100%" backgroundColor="steelblue" padding="5px" color="white">
            e(th)scrow
          </Heading>
        </Link>
        <Link onClick={ROnOpen}>
          <Heading size='sm' width="100%" backgroundColor="#FF3D33" padding="5px" color="white" >
            Connected to Ropesten Network (not Mainnet)
          </Heading>
        </Link>

        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>e(th)scrow</ModalHeader>
            <ModalCloseButton />
            <ModalBody textAlign='left'>
              <Text marginBottom={5}>Bet with friends securely using Ethereum.</Text>

              <Text fontWeight='900' fontSize='sm'>How it works: </Text>
              <List spacing={3} fontSize='sm'>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color='green.500' />
                  All cryptographic functions are done locally in your browser.
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color='green.500' />
                  Noone, not even us, know the private key for the generated escrow wallet address. Only the winner of the bet does.
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color='green.500' />
                  Authenication is done using public key cryptography, even in the case of a data leak, nothing comprimising is exposed.
                </ListItem>
              </List>
              <Text marginTop={5} fontSize="xs">© 2022, E(th)scrow, created by Ahmad Ayubi | {' '}
                <Link href='https://ahmadayubi.com' color="" isExternal>ahmadayubi.com</Link>
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal onClose={ROnClose} isOpen={RIsOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>What is Ropesten?</ModalHeader>
            <ModalCloseButton />
            <ModalBody fontSize='sm'>
              Ropesten is a test network for ERC20 tokens. Once e(th)scrow is in production, it will be switched over to Mainnet.
              <Text marginTop={5} fontWeight='800'>Switching to Mainnet around May 1st, 2022</Text>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Routes>
          <Route path="/" element={< Register />} />
          <Route path="/login" element={< Login />} />
          <Route path="/dashboard" element={< Dashboard />} />
          <Route path="/pool/:PoolId" element={< PoolState />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <div className='footer'>
          <Link href="https://github.com/ahmadayubi" isExternal>
            <Image src="/github.png" width="15px" display="inline" />
          </Link>
          <Text fontSize="xs">© 2022, E(th)scrow, created by Ahmad Ayubi | {' '}
            <Link href='https://ahmadayubi.com' color="" isExternal>ahmadayubi.com</Link>
          </Text>
        </div>
      </>}
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
