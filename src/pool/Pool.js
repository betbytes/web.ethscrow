import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatNumber, Box, Text, Button, Center, SimpleGrid, InputRightElement, Stat, StatLabel, StatHelpText, Tooltip, Heading, CloseButton, Badge, InputGroup, InputLeftAddon, Input, InputRightAddon } from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon, MinusIcon, InfoOutlineIcon, CloseIcon, CheckCircleIcon, LockIcon } from "@chakra-ui/icons";
import { createAnswer, createOffer, generateEscrow, handleICEAnswerEvent, handleICECandidateEvent, MessageType, setupP2P, submitMessage } from './PoolAPI';

const Pool = (props) => {

  const p2p = new RTCPeerConnection({
    iceServers: [     // Information about ICE servers - Use your own!
      {
        urls: "stun:stun.l.google.com:19302"
      }
    ],
  });
  const p2pChannel = p2p.createDataChannel("escrowChannel");
  p2pChannel.onopen = e => {
    console.log(e);
  }
  p2pChannel.onmessage = function (event) {
    console.log(event);
  };

  const chatBoxRef = useRef(null);
  const pool = props.pool;
  const bet = pool.pool;
  const ws = props.webSocket;
  const navigate = useNavigate();
  const [otherUserConnected, setOtherUserConnected] = useState(pool.other_user_connected);
  const [username, setUsername] = useState("");
  const [lost, setLost] = useState(false);
  const [won, setWon] = useState(false);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [generatingEscrow, setGeneratingEscrow] = useState(false);
  const [initiatedEscrow, setInitiatedEscrow] = useState(false);
  const [iceSet, setIceSet] = useState(false);
  p2p.onicecandidate = e => handleICECandidateEvent(e, ws);
  const [privateThresholdKey, setPrivateThresholdKey] = useState("");
  const [thresholdX, setThresholdX] = useState("");
  const [thresholdY, setThresholdY] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState((0).toFixed(8));
  const [balanceUpdatedAt, setBalanceUpdatedAt] = useState(new Date());
  const [updatingBalance, setUpdatingBalance] = useState(false);


  ws.onmessage = async (messageEvent) => {
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
      case MessageType.GeneratingEscrow:
        let bobX = message.body.x, bobY = message.body.y;
        if (initiatedEscrow) {
          let address = window.generateEscrowAddress(thresholdX, thresholdY, bobX, bobY);
          ws.send(JSON.stringify({
            type: MessageType.InitializePool,
            body: {
              address: address,
            },
          }));
        } else {
          setGeneratingEscrow(true);
          let thresh = window.generateThresholdKey();
          setPrivateThresholdKey(thresh.privateShare);
          setThresholdX(thresh.publicShareX);
          setThresholdY(thresh.publicShareY);

          ws.send(JSON.stringify({
            type: MessageType.GeneratingEscrow,
            body: {
              x: thresh.publicShareX,
              y: thresh.publicShareY,
            },
          }));
        }
        break;
      case MessageType.InitializePool:
        bet.address = message.body.address;
        bet.initialized = true;
        setGeneratingEscrow(false);
        setAddress(bet.address);
        break;
      case MessageType.Offer:
        setGeneratingEscrow(true);
        let answer = await createAnswer(p2p, message.body.data, false);
        await setupP2P(ws, MessageType.Answer, answer);
        break;
      case MessageType.Answer:
        await createAnswer(p2p, message.body.data, true);
        break;
      case MessageType.OfferCandidate:
      case MessageType.AnswerCandidate:
        await handleICEAnswerEvent(message.body.data, p2p);
        break;
      case MessageType.RefreshBalance:
        setBalance((message.body.balance / 1000000000).toFixed(8))
        setBalanceUpdatedAt(new Date(message.body.updated_at));
        setUpdatingBalance(false);
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
      setAddress(bet.address || "");
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

        {address === "" ?
          <Box boxShadow='md' borderWidth='1px' marginBottom='5' padding='2' borderRadius='lg' textAlign="left">

            <InputGroup>
              <InputLeftAddon children='Step 1' />

              <Button
                borderTopLeftRadius='0'
                borderBottomLeftRadius='0'
                width='100%'
                disabled={address !== "" || !otherUserConnected}
                loadingText='Generating'
                variant='outline'
                isLoading={generatingEscrow}
                onClick={async e => {
                  setInitiatedEscrow(true);
                  setGeneratingEscrow(true);

                  let thresh = window.generateThresholdKey();
                  setPrivateThresholdKey(thresh.privateShare);
                  setThresholdX(thresh.publicShareX);
                  setThresholdY(thresh.publicShareY);

                  ws.send(JSON.stringify({
                    type: MessageType.GeneratingEscrow,
                    body: {
                      x: thresh.publicShareX,
                      y: thresh.publicShareY,
                    },
                  }));

                  //let offer = await createOffer(p2p);
                  //await setupP2P(ws, MessageType.Offer, offer);
                }}
              >
                {address !== "" ? <CheckCircleIcon color="green" fontSize="xl" /> : otherUserConnected ? "Generate escrow wallet" : "Other user needs to be connected"}
              </Button>
            </InputGroup>

          </Box> :
          <Box boxShadow='md' borderWidth='1px' marginBottom='5' padding='2' borderRadius='lg' textAlign="left">
            <Button
              size='xs'
              width='100%'
              isLoading={updatingBalance}
              loadingText='Updating balance'
              variant='outline'
              onClick={e => {
                setUpdatingBalance(true);
                ws.send(JSON.stringify({
                  type: MessageType.RefreshBalance,
                }));
              }
              }
              marginBottom="10px"
            >
              Refresh balance
            </Button>
            <Stat>
              <StatNumber>{balance} eth
                <Tooltip label='Balance is secured in an escrow wallet, noone on planet earth knows the secret key until the bet is resolved.'>
                  <LockIcon fontSize="md" color="steelblue" marginLeft="10px" />
                </Tooltip>
              </StatNumber>
              <StatLabel>{address}</StatLabel>
              <StatHelpText fontSize="xs">Last Updated {balanceUpdatedAt.toUTCString()}</StatHelpText>
            </Stat>
          </Box>
        }

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