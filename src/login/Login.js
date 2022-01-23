import { AddIcon, DownloadIcon, InfoIcon } from "@chakra-ui/icons";
import { FormControl, Box, Input, Button, Center, Textarea, Tabs, Tab, TabList, TabPanels, TabPanel, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { login } from "./LoginAPI";

const Login = () => {
  const [username, setUsername] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let user = localStorage.getItem("username");
    let key = localStorage.getItem(user);
    if (!user || !key) {
      setIsLoading(false);
      localStorage.clear();
    } else {
      setUsername(user);
      setPrivateKey(key);
      submitLogin();
    }
  }, [])

  const submitLogin = async (e) => {
    if (!username || !privateKey) return
    setIsLoading(true);
    let res = await login(username, privateKey);
    if (res.status !== 200) {
      setError(true);
      setIsLoading(false);
    }
  }

  const onKeyUpload = (e) => {
    let file = e.target.files[0];
    if (file.size === 276) {
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (e) {
        setPrivateKey(e.target.result);
        console.log(e.target.result);
      }
    }
  }

  return (
    <Center justifyContent="center" display="flex" alignItems="center">
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

              <InputGroup>
                <InputLeftAddon children='Private Key File' />
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
