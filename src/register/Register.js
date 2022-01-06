import { AddIcon, DownloadIcon, InfoIcon } from "@chakra-ui/icons";
import { FormControl, Box, Input, Button, Center, Textarea, Tabs, Tab, TabList, TabPanels, TabPanel, Alert } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import './Register.css';
import { register } from "./RegisterAPI";
import { useNavigate } from 'react-router-dom';


const Register = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [publickKey, setPublickKey] = useState("");

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const submitRegisteration = (e) => {
    setIsLoading(true);
    register(email, username, password, publickKey);
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

              <Input
                placeholder="Password"
                type="password"
                variant='filled'
                borderRadius='0'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Tabs size='sm' isFitted variant='enclosed'>
                <TabList>
                  <Tab>Upload your own public key</Tab>
                  <Tab>Generate a key pair for me</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Textarea
                      placeholder='Paste Your Public Key Here...'
                      size='sm'
                      resize="none"
                      onChange={e => setPublickKey(e.target.value)}
                      value={publickKey}
                    />

                  </TabPanel>
                  <TabPanel>
                    <Alert status='warning'>
                      <InfoIcon />
                      Make sure not to lose your private key file!
                    </Alert>
                    <Button
                      size='sm'
                      variant='outline'
                    >Generate and Download</Button>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <Button
                width='100%'
                isLoading={isLoading}
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