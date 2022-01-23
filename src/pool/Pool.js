import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatNumber, Box, Text, Button, Center, SimpleGrid, InputRightElement, MenuButton, MenuItem, MenuList, Alert, AlertIcon, CloseButton, Badge, InputGroup, InputLeftAddon, Input, InputRightAddon } from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon, MinusIcon, InfoOutlineIcon, CloseIcon, CheckCircleIcon } from "@chakra-ui/icons";

const Pool = () => {

  let { PoolId } = useParams();

  const tempData = [
    {
      id: "S543GD134BD",
      msg: "Hi",
      from: "ahmad",
      date: "Feb 10 2021",
    },
    {
      id: "S543GD13234BD",
      msg: "How are you",
      from: "bob",
      date: "Feb 10 2021",
    },
    {
      id: "S54354GD134BD",
      msg: "This works",
      from: "ahmad",
      date: "Feb 10 2021",
    }
  ];

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [setup, setSetup] = useState(false);
  const [lost, setLost] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    let user = localStorage.getItem("username");
    if (!user) {
      navigate("/login");
    } else {
      setUsername(user);
    }
  }, [])

  return (
    <Center justifyContent="center" display="flex" alignItems="center">
      <div>
        <Box boxShadow='md' borderWidth='1px' marginBottom='10' marginTop='10' padding='2' borderRadius='lg' alignItems='center'>
          <SimpleGrid
            columns={2}
            spacing='8'
            textAlign='center'
            rounded='lg'
          >
            <h1>Pool {PoolId}</h1>

            <Button
              size='xs'
              width='100%'
              loadingText='Logging in'
              variant='outline'
            >
              Exit
            </Button>
          </SimpleGrid>
        </Box>

        <Box boxShadow='md' borderWidth='1px' marginBottom='5' marginTop='10' padding='2' borderRadius='lg' alignItems='center'>
          <SimpleGrid
            columns={3}
            spacing='8'
            textAlign='center'
            rounded='lg'
          >
            <Box boxShadow='xs' p='2' rounded='md'>
              <Text fontSize="xs" color="gray">You</Text>
              <Text fontSize="md">{username}</Text>
              <Text fontSize="xs" color="green">Online</Text>
            </Box>
            <Box boxShadow='xs' p='2' rounded='md'>
              <Text fontSize="xs" color="gray">Mediator</Text>
              <Text fontSize="md">Middleman</Text>
              <Text fontSize="xs" color="red">Offline</Text>
            </Box>
            <Box boxShadow='xs' p='2' rounded='md'>
              <Text fontSize="xs" color="gray">Other</Text>
              <Text fontSize="md">bob</Text>
              <Text fontSize="xs" color="red">Offline</Text>
            </Box>
          </SimpleGrid>
        </Box>

        <Box boxShadow='md' borderWidth='1px' marginBottom='5' padding='2' borderRadius='lg' textAlign="left">

          <InputGroup>
            <InputLeftAddon children='Step 1' />

            <Button
              borderTopLeftRadius='0'
              borderBottomLeftRadius='0'
              width='100%'
              disabled={setup}
              loadingText='Generating'
              variant='outline'
            >
              {setup ? <CheckCircleIcon color="green" fontSize="xl" /> : "Generate escrow wallet"}
            </Button>
          </InputGroup>

        </Box>

        <Box boxShadow='md' borderWidth='1px' marginBottom='5' padding='2' borderRadius='lg' alignItems='left'>
          <Text textAlign="left" p="2">Chat
          </Text>

          <Box borderWidth='1px' p="2" borderTopRadius="lg">
            {tempData.map(msg => (
              <Text fontSize="sm" textAlign={msg.from === username ? "right" : "left"}>
                {msg.msg}
              </Text>
            ))}
          </Box>

          <InputGroup>
            <Input variant='outline' placeholder='Message' borderTopRadius="0" fontSize="sm" />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' fontSize="xs">
                Send
              </Button>
            </InputRightElement>
          </InputGroup>

        </Box>

        <Box boxShadow='md' borderWidth='1px' marginBottom='5' padding='2' borderRadius='lg' textAlign="left">
          <SimpleGrid
            columns={2}
            spacing='2'
            textAlign='center'
            rounded='lg'
          >
            <Button
              borderTopLeftRadius='0'
              borderBottomLeftRadius='0'
              width='100%'
              disabled={won || lost}
              loadingText='Generating'
              variant='outline'
              backgroundColor={won ? "green" : "white"}
              textColor={won ? "white" : "black"}
            >
              I won
            </Button>
            <Button
              borderTopLeftRadius='0'
              borderBottomLeftRadius='0'
              width='100%'
              disabled={won || lost}
              loadingText='Generating'
              variant='outline'
              backgroundColor={lost ? "red" : "white"}
              textColor={lost ? "white" : "black"}
            >
              I lost
            </Button>
          </SimpleGrid>
        </Box>
        <Text fontSize="xs">© 2022, E(th)scrow, created by Ahmad Ayubi</Text>
      </div >
    </Center >
  );
};

export { Pool };