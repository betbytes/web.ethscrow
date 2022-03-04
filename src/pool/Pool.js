import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatNumber, Box, Text, Button, Center, SimpleGrid, InputRightElement, Stat, StatLabel, StatHelpText, Tooltip, Modal, ModalOverlay, HStack, useDisclosure, InputGroup, InputLeftAddon, ModalBody, Input, ModalContent, Skeleton, ModalHeader, ModalCloseButton, useToast, Link, Heading } from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon, MinusIcon, InfoOutlineIcon, CloseIcon, CheckCircleIcon, LockIcon, DownloadIcon, ArrowUpIcon, CheckIcon } from "@chakra-ui/icons";
import { BetState, createAnswer, createOffer, generateEscrow, handleICEAnswerEvent, handleICECandidateEvent, MessageType, setupP2P, submitMessage } from './PoolAPI';
import SubmitState from './SubmitState';

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

  const toast = useToast({
    position: 'top',
  });

  const [loaded, setLoaded] = useState(false);
  const chatBoxRef = useRef(null);
  const pool = props.pool;
  const bet = pool.pool;
  const ws = props.webSocket;
  const navigate = useNavigate();
  const [otherUserConnected, setOtherUserConnected] = useState(pool.other_user_connected);
  const [username, setUsername] = useState("");
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [generatingEscrow, setGeneratingEscrow] = useState(false);
  const [initiatedEscrow, setInitiatedEscrow] = useState(false);
  const [iceSet, setIceSet] = useState(false);
  p2p.onicecandidate = e => handleICECandidateEvent(e, ws);
  const [privateThresholdKey, setPrivateThresholdKey] = useState("");
  const [encOtherShare, setEncOtherShare] = useState("")
  const [thresholdX, setThresholdX] = useState("");
  const [thresholdY, setThresholdY] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState((0).toFixed(8));
  const [balanceUpdatedAt, setBalanceUpdatedAt] = useState(new Date());
  const [updatingBalance, setUpdatingBalance] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isSubmitOpen, onOpen: onSubmitOpen, onClose: onSubmitClose } = useDisclosure();
  const [state, setState] = useState(0);
  const [newState, setNewState] = useState(0)
  const [completed, setCompleted] = useState(false)


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

        if (encOtherShare === "") {
          setEncOtherShare(message.body.enc_other_share);
        }

        if (initiatedEscrow) {
          let address = window.generateEscrowAddress(thresholdX, thresholdY, bobX, bobY);
          setAddress(address);

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

          let address = window.generateEscrowAddress(thresh.publicShareX, thresh.publicShareY, bobX, bobY);
          setAddress(address);

          let encryptedShare = window.encrypt(pool.mediator_public_key, thresh.privateShare);

          ws.send(JSON.stringify({
            type: MessageType.GeneratingEscrow,
            body: {
              x: thresh.publicShareX,
              y: thresh.publicShareY,
              enc_other_share: `${encryptedShare.c1x}-${encryptedShare.c1y}-${encryptedShare.c2x}-${encryptedShare.c2y}`,
            },
          }));
        }
        break;
      case MessageType.InitializePool: // not a used case anymore
        bet.address = message.body.address;
        bet.initialized = true;
        setGeneratingEscrow(false);
        localStorage.setItem(address, privateThresholdKey);
        localStorage.setItem(`other-${address}`, encOtherShare);
        onOpen();
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
      case MessageType.PoolStateChange:
        if (message.body.bettor_username === username) {
          setState(message.body.bettor_state);
        } else {
          setState(message.body.caller_state);
        }
        setCompleted((message.body.bettor_state === 1 && message.body.caller_state === -1) || (message.body.bettor_state === -1 && message.body.caller_state === 1));
        break;
      default:
        break;
    }

    console.log(message);
  };

  const savePrivateThreshold = (e) => {
    console.log(privateThresholdKey);
    const element = document.createElement("a");
    const file = new Blob([`${privateThresholdKey}=${encOtherShare}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `ethscrow-${bet.id}-${username}.key`;
    document.body.appendChild(element);
    element.click();
  }

  const savePrivateKey = (e) => {
    let key = window.generateEscrowPrivateKey(privateThresholdKey, bet.threshold_key);
    const element = document.createElement("a");
    const file = new Blob([key], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `ethscrow-won-${bet.id}-DO-NOT-DELETE.key`;
    document.body.appendChild(element);
    element.click();
  }

  const uploadPrivateThreshold = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (e) {
      let data = e.target.result.split("=");
      setPrivateThresholdKey(data[0]);
      setEncOtherShare(data[1]);
      localStorage.setItem(address, data[0]);
      localStorage.setItem(`other-${address}`, data[1]);
    }
  }

  useEffect(() => {
    let user = localStorage.getItem("username");
    if (!user) {
      navigate("/login");
    } else {
      console.log(pool);
      if (bet.bettor_username === user) {
        setState(bet.bettor_state);
      } else {
        setState(bet.caller_state);
      }
      setCompleted((bet.bettor_state === 1 && bet.caller_state === -1) || (bet.bettor_state === -1 && bet.caller_state === 1));

      setUsername(user);
      setChats(bet.chats)
      setAddress(bet.address || "");
      if (bet.address) {
        setPrivateThresholdKey(localStorage.getItem(address));
        setEncOtherShare(localStorage.getItem(`other-${address}`));
      }
      setLoaded(true);
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

        <Skeleton isLoaded={loaded}>
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
        </Skeleton>

        <Skeleton isLoaded={loaded}>
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
                    let encryptedShare = window.encrypt(pool.mediator_public_key, thresh.privateShare);

                    setPrivateThresholdKey(thresh.privateShare);
                    setThresholdX(thresh.publicShareX);
                    setThresholdY(thresh.publicShareY);

                    ws.send(JSON.stringify({
                      type: MessageType.GeneratingEscrow,
                      body: {
                        x: thresh.publicShareX,
                        y: thresh.publicShareY,
                        enc_other_share: `${encryptedShare.c1x}-${encryptedShare.c1y}-${encryptedShare.c2x}-${encryptedShare.c2y}`,
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
              <HStack spacing='5px' marginBottom="10px">
                <Button
                  size='xs'
                  width='75%'
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
                >
                  Refresh balance
                </Button>

                {!privateThresholdKey ?
                  <input type="file" name="file" onChange={uploadPrivateThreshold} width="25%" /> :
                  <Button
                    size='xs'
                    width='25%'
                    isLoading={updatingBalance}
                    loadingText='Updating balance'
                    variant='outline'
                    onClick={savePrivateThreshold}
                  >
                    <DownloadIcon />
                  </Button>}
              </HStack>

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
        </Skeleton>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader><CheckIcon color="green" marginRight="15px" />Escrow Wallet Generated</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Transfer To </Text>
              <Text>{address}</Text>
              <Button
                size='xs'
                width='100%'
                variant='outline'
                onClick={() => {
                  navigator.clipboard.writeText(address);
                  toast({
                    title: 'Copied To Clipboard.',
                    status: 'success',
                    duration: 500,
                    isClosable: true,
                  });
                }}
              >
                Copy To Clipboard
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Skeleton isLoaded={loaded}>
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

            {!completed && <InputGroup>
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
            </InputGroup>}

          </Box>
        </Skeleton>

        <Skeleton isLoaded={loaded}>
          <Box boxShadow='md' borderWidth='1px' marginBottom='5' padding='2' borderRadius='lg' textAlign="left">
            { }
            {!completed && state === BetState.NeutralState && <SimpleGrid
              columns={2}
              spacing='2'
              textAlign='center'
              rounded='lg'
              marginBottom="5px"
            >
              <Button
                borderTopRightRadius='0'
                borderBottomRightRadius='0'
                width='100%'
                disabled={state !== BetState.NeutralState}
                loadingText='Generating'
                variant='outline'
                backgroundColor={state === BetState.WonState ? "green" : "white"}
                textColor={state === BetState.WonState ? "white" : "black"}
                onClick={e => {
                  setNewState(BetState.WonState);
                  onSubmitOpen();
                }}
              >
                I won
              </Button>
              <Button
                borderTopLeftRadius='0'
                borderBottomLeftRadius='0'
                width='100%'
                disabled={state !== BetState.NeutralState}
                loadingText='Generating'
                variant='outline'
                backgroundColor={state === BetState.LostState ? "red" : "white"}
                textColor={state === BetState.LostState ? "white" : "black"}
                onClick={e => {
                  setNewState(BetState.LostState);
                  onSubmitOpen();
                }}
              >
                I lost
              </Button>
            </SimpleGrid>}
            {!completed && (bet.bettor_state === BetState.ConflictState || bet.caller_state === BetState.ConflictState) && <Text textAlign="center">🚩 Bet is currently in-conflict. <br /> Waiting on {bet.mediator_username} to resolve.</Text>}
            {!completed && !(bet.bettor_state === BetState.ConflictState || bet.caller_state === BetState.ConflictState) && state === BetState.WonState && <Text textAlign="center">🎉 You claimed a win. <br /> Waiting on {bet.bettor_username === username ? bet.caller_username : bet.bettor_username} to respond.</Text>}
            {!completed && !(bet.bettor_state === BetState.ConflictState || bet.caller_state === BetState.ConflictState) && <Text textAlign="center" fontSize='sm'>Have a conflict? <Link color='steelblue' onClick={e => {
              setNewState(BetState.ConflictState);
              onSubmitOpen();
            }}>Submit to mediator</Link></Text>}
            {completed && state === BetState.WonState &&
              <>
                <Text textAlign="center">You <Text as="span" fontSize="xl" color="green">won</Text> 🎉🎉</Text>
                <Button
                  borderTopLeftRadius='0'
                  borderBottomLeftRadius='0'
                  width='100%'
                  loadingText='Generating'
                  marginTop="5px"
                  variant='outline'
                  backgroundColor={"white"}
                  textColor={"black"}
                  onClick={savePrivateKey}
                >
                  Download escrow private key
                </Button>
                <Text textAlign="center">Or</Text>
                <InputGroup>
                  <InputLeftAddon children='0x' fontSize="sm" />
                  <Input fontSize="sm" placeholder='deposit wallet address' />
                  <InputRightElement width="9rem">
                    <Button h='1.75rem' size='xs' onClick={e => console.log(e)}>
                      Transfer all out
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </>
            }
            {completed && state === BetState.LostState &&
              <Text textAlign="center">You <Text as="span" fontSize="xl" color="red">lost</Text> 🙃🙂</Text>
            }
          </Box>
        </Skeleton>

        <Modal
          isOpen={isSubmitOpen}
          onClose={onSubmitClose}
        ><SubmitState poolID={bet.id} onClose={onSubmitClose} state={newState} encOtherShare={encOtherShare} privateThresholdKey={privateThresholdKey} ws={ws} />
        </Modal>
      </div >
    </Center >
  );
};

export { Pool };