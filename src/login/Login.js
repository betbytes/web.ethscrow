import { AddIcon, DownloadIcon, InfoIcon } from "@chakra-ui/icons";
import { FormControl, Box, Input, Button, Center, Textarea, Tabs, Tab, TabList, TabPanels, TabPanel, Alert } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const submitLogin = (e) => {
    setIsLoading(true);
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

              <Input
                placeholder="Password"
                type="password"
                variant='filled'
                borderRadius='0'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

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
