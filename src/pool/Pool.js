import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatNumber, Box, Text, Button, Center, SimpleGrid, InputRightElement, MenuButton, MenuItem, MenuList, Alert, AlertIcon, CloseButton, Badge, InputGroup, InputLeftAddon, Input, InputRightAddon } from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon, MinusIcon, InfoOutlineIcon, CloseIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { generateEscrow, MessageType, submitMessage } from './PoolAPI';

const Pool = (props) => {

  let p2p = new RTCPeerConnection({
    iceServers: [     // Information about ICE servers - Use your own!
      {
        urls: "stun:stun.stunprotocol.org"
      }
    ],
  });
  const p2pChannel = p2p.createDataChannel("escrowChannel");
  p2pChannel.onmessage = function (event) {
    console.log(event.data);
  };
  const chatBoxRef = useRef(null);
  const pool = props.pool;
  const bet = pool.pool;
  const ws = props.webSocket;
  const navigate = useNavigate();
  const [otherUserConnected, setOtherUserConnected] = useState(pool.other_user_connected);
  const [username, setUsername] = useState("");
  const [setup, setSetup] = useState(false);
  const [lost, setLost] = useState(false);
  const [won, setWon] = useState(false);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [generatingEscrow, setGeneratingEscrow] = useState(false);
  const [escrowState, setEscrowState] = useState(0);
  const [initiatedEscrow, setInitiatedEscrow] = useState(false);

  ws.onmessage = (messageEvent) => {
    let message = JSON.parse(messageEvent.data);
    let otherUsername = bet.bettor_username === username ? bet.caller_username : bet.bettor_username;

    switch (message.type) {
      case MessageType.Connect:
        if (message.username === otherUsername) {
          setOtherUserConnected(true);
        }
        break;
      case MessageType.Disconnect:
        if (message.username === otherUsername) {
          setOtherUserConnected(false);
        }
        break;
      case MessageType.Chat:
        setChats(chats.concat([message.body]));

        const scrollHeight = chatBoxRef.current.scrollHeight;
        const height = chatBoxRef.current.clientHeight;
        const maxScrollTop = scrollHeight - height;
        chatBoxRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        setMessage("");
        break;
      case MessageType.Offer:
      case MessageType.Answer:
      case MessageType.OfferCandidate:
      case MessageType.AnswerCandidate:
      case MessageType.GeneratingEscrow:
        if (initiatedEscrow) {
          switch (escrowState) {
            case 1:

              break;
            case 3:
              break;
            case 5:
              break;
            case 7:
              break;
          }
        } else {
          switch (escrowState) {
            case 0:
              setGeneratingEscrow(true);
              break;
            case 2:
              break;
            case 4:
              break;
            case 6:
              break;
          }
        }

        setEscrowState(escrowState + 1);
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
      console.log(pool);
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
            <Text isTruncated maxWidth='200px'>Pool {bet.id}</Text>

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
              <Text fontSize="md">{bet.mediator_username}</Text>
              <Text fontSize="xs" >-</Text>
            </Box>
            <Box boxShadow='xs' p='2' rounded='md'>
              <Text fontSize="xs" color="gray">Other</Text>
              <Text fontSize="md">{bet.bettor_username === username ? bet.caller_username : bet.bettor_username}</Text>
              <Text fontSize="xs" color={otherUserConnected ? "green" : "red"}>{otherUserConnected ? "Online" : "Offline"}</Text>
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
              disabled={setup || (!setup && !otherUserConnected)}
              loadingText='Generating'
              variant='outline'
              isLoading={generatingEscrow}
              onClick={e => {
                setInitiatedEscrow(true);
                setEscrowState(escrowState + 1);
                setGeneratingEscrow(true);
                generateEscrow(ws);
              }}
            >
              {setup ? <CheckCircleIcon color="green" fontSize="xl" /> : otherUserConnected ? "Generate escrow wallet" : "Other user needs to be connected"}
            </Button>
          </InputGroup>

        </Box>

        <Box boxShadow='md' borderWidth='1px' marginBottom='5' padding='2' borderRadius='lg' alignItems='left'>
          <Text textAlign="left" p="2">Chat
          </Text>

          <Box ref={chatBoxRef} borderWidth='1px' p="2" borderTopRadius="lg" maxHeight="150px" overflow="auto">
            {chats.map(chat => (
              <Text key={chat.id} fontSize="sm" textAlign={chat.from_username === username ? "right" : "left"}>
                {chat.message}
              </Text>
            ))}
          </Box>

          <InputGroup>
            <InputLeftAddon children={`${150 - message.length}`} />
            <Input
              variant='outline'
              placeholder='Message'
              borderTopRadius="0"
              fontSize="sm"
              value={message}
              maxLength={150}
              onChange={e => setMessage(e.target.value)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  submitMessage(ws, message)
                }
              }}
            />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' fontSize="xs" onClick={e => submitMessage(ws, message)} disabled={message.length <= 0}>
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