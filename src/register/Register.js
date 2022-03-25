import { InfoIcon } from "@chakra-ui/icons";
import { Alert, Box, Button, Center, FormControl, Input, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { register } from "./RegisterAPI";


const Register = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [encPublicKey, setEncPublicKey] = useState("");
  const [encPrivateKey, setEncPrivateKey] = useState("");

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const submitRegisteration = async (e) => {
    setIsLoading(true);
    console.log(publicKey);
    let res = await register(email, username, publicKey, encPublicKey);

    if (res.status === 201) {
      localStorage.setItem("username", username);
      localStorage.setItem(username, privateKey); // not optimal, can be improved but not sure how
      localStorage.setItem(`enc-${username}`, encPrivateKey);
      navigate('/dashboard')
    } else {
      setError(true);
      setIsLoading(false);
    }
  }

  const generateKey = (e) => {
    let keyPair = window.generateKeyPair();
    let encKeyPair = window.generateKeyPair();

    setPublicKey(keyPair.publicKey)
    setPrivateKey(keyPair.privateKey)
    setEncPublicKey(encKeyPair.publicKey);
    setEncPrivateKey(encKeyPair.privateKey);

    const element = document.createElement("a");
    const file = new Blob([`${keyPair.privateKey}-${encKeyPair.privateKey}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `ethscrow-${username || "private"}.key`;
    document.body.appendChild(element);
    element.click();
  }


  return (
    <Center className="vertical-center" justifyContent="center" display="flex" alignItems="center">
      <div>
        <Box borderWidth='1px' m='2' paddingTop='2' borderRadius='lg' alignItems='center'>
          <h1>E(th)scrow Registration</h1>
          <Box maxW='sm' borderWidth='1px' m='2' borderRadius='lg' alignItems='center'>

            <FormControl>
              <Input
                placeholder="Username"
                variant='filled'
                borderBottomRightRadius='0'
                borderBottomLeftRadius='0'
                value={username}
                onChange={e => setUsername(e.target.value)}
              />

              <Input
                placeholder="Email - Optional"
                variant='filled'
                borderRadius='0'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <Tabs size='sm' isFitted variant='enclosed'>
                <TabList>
                  <Tab>Generate a key pair for me</Tab>
                  <Tab>Upload your own public key</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Alert status='warning' fontSize="sm">
                      <InfoIcon />
                      Make sure not to lose your private key backup!
                    </Alert>
                    <Button
                      size='sm'
                      variant='outline'
                      width='100%'
                      disabled={publicKey !== "" || username === ""}
                      onClick={generateKey}
                    >Generate and Download Backup</Button>
                  </TabPanel>
                  <TabPanel>
                    {/* <Textarea
                      placeholder='Paste Your Public Key Here...'
                      size='sm'
                      resize="none"
                      onChange={e => setPublicKey(e.target.value)}
                      value={publicKey}
                    /> */}

                    <Alert status='warning'>
                      <InfoIcon />
                      Feature coming soon.
                    </Alert>

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
