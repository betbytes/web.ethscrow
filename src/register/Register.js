import { AddIcon, DownloadIcon, InfoIcon } from "@chakra-ui/icons";
import { FormControl, Box, Input, Button, Center, Textarea, Tabs, Tab, TabList, TabPanels, TabPanel, Alert } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import './Register.css';
import { register } from "./RegisterAPI";
import { useNavigate } from 'react-router-dom';


const Register = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [publickKey, setPublickKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const submitRegisteration = async (e) => {
    setIsLoading(true);
    let res = await register(email, username, publickKey);

    if (res.status === 201) {
      localStorage.setItem("username", username);
      localStorage.setItem(username, privateKey); // not optimal, can be improved but not sure how
      navigate('/dashboard')
    } else {
      setError(true);
    }
  }

  const generateKey = (e) => {
    let keyPair = window.generateKeyPair();

    setPublickKey(keyPair.publicKey)
    setPrivateKey(keyPair.privateKey)

    const element = document.createElement("a");
    const file = new Blob([keyPair.privateKey], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "ethscrow-private.key";
    document.body.appendChild(element);
    element.click();
  }


  return (
    <Center justifyContent="center" display="flex" alignItems="center">
      <div>
        <Box borderWidth='1px' m='2' paddingTop='2' borderRadius='lg' alignItems='center'>
          <h1>E(th)scrow Registration</h1>
          <Box maxW='sm' borderWidth='1px' m='2' borderRadius='lg' alignItems='center'>

            <FormControl>
              <Input
                placeholder="Email"
                variant='filled'
                borderBottomRightRadius='0'
                borderBottomLeftRadius='0'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <Input
                placeholder="Username"
                variant='filled'
                borderRadius='0'
                value={username}
                onChange={e => setUsername(e.target.value)}
              />

              <Tabs size='sm' isFitted variant='enclosed'>
                <TabList>
                  <Tab>Generate a key pair for me</Tab>
                  <Tab>Upload your own public key</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Alert status='warning'>
                      <InfoIcon />
                      Make sure not to lose your private key backup!
                    </Alert>
                    <Button
                      size='sm'
                      variant='outline'
                      width='100%'
                      disabled={publickKey != "" || username == ""}
                      onClick={generateKey}
                    >Generate and Download Backup</Button>
                  </TabPanel>
                  <TabPanel>
                    <Textarea
                      placeholder='Paste Your Public Key Here...'
                      size='sm'
                      resize="none"
                      onChange={e => setPublickKey(e.target.value)}
                      value={publickKey}
                    />

                  </TabPanel>
                </TabPanels>
              </Tabs>

              <Button
                width='100%'
                isLoading={isLoading && !error}
                disabled={error}
                loadingText='Registering'
                variant='flush'
                onClick={submitRegisteration}
              >
                Register
              </Button>

            </FormControl>
          </Box>
        </Box>
        <Button variant='link' onClick={() => navigate('/login')}>
          Already have an account? Login
        </Button>
      </div>
    </Center>
  )
}

export { Register };