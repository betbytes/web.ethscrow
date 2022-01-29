import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatNumber, Box, Text, Button, Center, SimpleGrid, InputRightElement, MenuButton, MenuItem, MenuList, Alert, AlertIcon, CloseButton, Badge, InputGroup, InputLeftAddon, Input, InputRightAddon } from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon, MinusIcon, InfoOutlineIcon, CloseIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { submitMessage } from './PoolAPI';

const Pool = (props) => {

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

  const bet = props.bet;
  const ws = props.webSocket;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [setup, setSetup] = useState(false);
  const [lost, setLost] = useState(false);
  const [won, setWon] = useState(false);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  ws.onmessage = (messageEvent) => {
    let message = JSON.parse(messageEvent.data);

    switch (message.type) {
      case 0:

        break;
      case 2:
        setChats(chats.concat([message.body]));
        break;


      default:
        break;
    }

    console.log(message);
  };

  useEffect(() => {
    let user = localStorage.getItem("username");
    if (!user) {
      navigate("/login");
    } else {
      setUsername(user);
      setChats(bet.chats)
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
            <h1>Pool {bet.id}</h1>

            <Button
              size='xs'
              width='100%'
              loadingText='Logging in'
              variant='outline'
              onClick={e => window.close()}
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
            {chats.map(chat => (
              <Text fontSize="sm" textAlign={chat.from === username ? "right" : "left"}>
                {chat.message}
              </Text>
            ))}
          </Box>

          <InputGroup>
            <Input variant='outline' placeholder='Message' borderTopRadius="0" fontSize="sm" value={message} onChange={e => setMessage(e.target.value)} />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' fontSize="xs" onClick={e => submitMessage(ws, message)}>
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
              borderTopRightRadius='0'
              borderBottomRightRadius='0'
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
      </div >
    </Center >
  );
};

export { Pool };