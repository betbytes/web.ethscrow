import { AddIcon, DownloadIcon, InfoIcon } from "@chakra-ui/icons";
import { FormControl, Box, Input, Button, Center, Heading, Tabs, Tab, TabList, TabPanels, TabPanel, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { login } from "./LoginAPI";
import { useToast } from '@chakra-ui/react';

const Login = () => {
  const [username, setUsername] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [encPrivateKey, setEncPrivateKey] = useState("");

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const toast = useToast({
    position: 'top',
  });

  useEffect(() => {
    let user = localStorage.getItem("username");
    let key = localStorage.getItem(user);
    let encKey = localStorage.getItem(`enc-${user}`);
    if (!user || !key || !encKey) {
      setIsLoading(false);
      localStorage.clear();
    } else {
      setUsername(user);
      setPrivateKey(key);
      setEncPrivateKey(encKey);
    }
  }, [])

  const submitLogin = async (e) => {
    if (!username || !privateKey || !encPrivateKey) {
      toast({
        title: 'Please enter a username and locally load your key file.',
        status: 'warning',
        duration: 1000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    let res = await login(username, privateKey);

    switch (res.status) {
      case 200:
        localStorage.setItem("username", username);
        localStorage.setItem(username, privateKey);
        localStorage.setItem(`enc-${username}`, encPrivateKey);
        navigate('/dashboard');
        break;

      case 404:
        toast({
          title: "User doesn't exist.",
          status: 'warning',
          duration: 2000,
          isClosable: true,
        });
        setError(true);
        setIsLoading(false);
        break;

      default:
        toast({
          title: 'Internal Server Error',
          status: 'warning',
          duration: 2000,
          isClosable: true,
        });
        setError(true);
        setIsLoading(false);
        break;
    }
  }

  const onKeyUpload = (e) => {
    let file = e.target.files[0];
    if (file.size === 553) {
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (e) {
        let keys = e.target.result.split("-")
        setPrivateKey(keys[0]);
        setEncPrivateKey(keys[1]);
      }
    } else {
      toast({
        title: 'Invalid Key File',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
    }
  }

  return (
    <Center className="vertical-center" justifyContent="center" display="flex" alignItems="center">
      <div>
        <Box borderWidth='1px' m='2' paddingTop='2' borderRadius='lg' alignItems='center'>
          <h1>
            E(th)scrow Registration
          </h1>
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

              <InputGroup>
                <InputLeftAddon children='Private Key File' borderRadius="0" />
                <Input
                  type="file"
                  variant='filled'
                  borderRadius='0'
                  accept=".key"
                  onChange={onKeyUpload}
                  disabled={privateKey != ""}
                />
              </InputGroup>

              <Button
                width='100%'
                isLoading={isLoading}
                loadingText='Logging in'
                variant='flush'
                onClick={submitLogin}
              >
                Login
              </Button>

            </FormControl>
          </Box>
        </Box>
        <Button variant='link' onClick={() => navigate('/')}>
          Create an new account
        </Button>
      </div>
    </Center >
  )
}

export { Login }
