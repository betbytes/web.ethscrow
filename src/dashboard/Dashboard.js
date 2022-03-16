import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StatNumber, Box, Text, Button, Center, SimpleGrid, Menu, MenuButton, MenuItem, MenuList, Stat, StatLabel, StatHelpText, Badge, useDisclosure, Modal, Stack, Skeleton, AccordionIcon, HStack, Accordion, AccordionItem, AccordionButton, AccordionPanel } from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon, CheckIcon, MinusIcon, InfoOutlineIcon, CloseIcon } from "@chakra-ui/icons";
import { API_URL } from "../utils/constants";
import { acceptBet, declineBet, getBets, resolveConflict } from './DashboardAPI';
import NewBetDialog from './NewBetDialog';

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [activeBets, setActiveBets] = useState([]);
  const [indoxBets, setIndoxBets] = useState([]);
  const [mediatedBets, setMediatedBets] = useState([]);
  const [sentBets, setSentBets] = useState([]);
  const [completedBets, setCompletedBets] = useState([]);
  const [loaded, setLoaded] = useState(false);

  let navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [privateKey, setPrivateKey] = useState("")

  useEffect(() => {
    let user = localStorage.getItem("username");
    if (!user) {
      navigate("/login");
    } else {
      setUsername(user);
      setPrivateKey(localStorage.getItem(user));
      getAndSetBets();
    }
  }, []);

  const getAndSetBets = async () => {
    let bets = await getBets();
    console.log(bets);
    setActiveBets(bets.active ?? []);
    setIndoxBets(bets.inbox ?? []);
    setMediatedBets(bets.resolve ?? []);
    setSentBets(bets.sent ?? []);
    setCompletedBets(bets.completed ?? []);
    setLoaded(true);
  };

  const logout = (e) => {
    localStorage.clear();

    fetch(API_URL + "/user/logout", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      withCredentials: true,
    });

    navigate("/login");
  };

  return (

    <Center justifyContent="center" display="flex" alignItems="center">
      <div>

        <Box boxShadow='md' borderWidth='1px' marginBottom='10' marginTop='10' padding='2' paddingLeft='5' borderRadius='lg' alignItems='center'>
          <SimpleGrid
            columns={2}
            spacing='8'
            textAlign='center'
            rounded='lg'
          >
            <h1>Welcome back, {username}</h1>

            <Button
              size='xs'
              width='100%'
              loadingText='Logging in'
              variant='outline'
              onClick={logout}
            >
              Logout
            </Button>
          </SimpleGrid>
        </Box>

        {!loaded && <>
          <Box boxShadow='md' borderWidth='1px' marginBottom='10px' marginTop='10' padding='2' borderRadius='lg' alignItems='left'>
            <Stack>
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
            </Stack>
          </Box>
          <Box boxShadow='md' borderWidth='1px' marginBottom='10px' padding='2' borderRadius='lg' alignItems='left'>
            <Stack>
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
            </Stack>
          </Box>
          <Box boxShadow='md' borderWidth='1px' marginBottom='10px' padding='2' borderRadius='lg' alignItems='left'>
            <Stack>
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
            </Stack>
          </Box>
        </>
        }

        <Box boxShadow='md' borderWidth='1px' marginBottom='5' marginTop='10px' padding='2' borderRadius='lg' alignItems='left'>
          <SimpleGrid
            columns={2}
            spacing='8'
            textAlign='center'
            rounded='lg'
          >
            <h1>Active bets</h1>

            <Button
              size='xs'
              width='100%'
              loadingText='Logging in'
              variant='outline'
              onClick={onOpen}
            >
              Create a new bet
            </Button>
          </SimpleGrid>

          <SimpleGrid
            spacing='2'
            paddingTop='5'
            textAlign='center'
            rounded='lg'
          >

            {activeBets.map(bet => (
              <Menu key={bet.id}>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" height='auto' p='2'>
                  <Stat textAlign="left">
                    <StatLabel>{bet.reason}</StatLabel>
                    <StatNumber fontSize="lg">Bet with {bet.bettor_username === username ? bet.caller_username : bet.bettor_username}</StatNumber>
                    <StatHelpText isTruncated>Mediated by {bet.mediator_username} • {bet.created_at.split("T")[0]}</StatHelpText>

                  </Stat>
                </MenuButton>
                <MenuList>
                  <Link to={"/pool/" + bet.id} target="_blank">
                    <MenuItem icon={<ExternalLinkIcon />}>Open</MenuItem>
                  </Link>

                  <MenuItem >🎉 I won</MenuItem>
                  <MenuItem >🙃 I lost</MenuItem>
                  <MenuItem >🚩 Conflict</MenuItem>
                </MenuList>
              </Menu>
            ))}

          </SimpleGrid>
        </Box>

        <Accordion allowMultiple>
          {!indoxBets.length ? <div></div> :
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex='1' textAlign='left' >
                    <Text textAlign="left" p="2">Invitations
                      <Badge ml='1' fontSize='0.8em' colorScheme='green' variant="subtle">
                        New
                      </Badge>
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <SimpleGrid
                  spacing='2'
                  paddingTop='5'
                  textAlign='center'
                  rounded='lg'
                >
                  {indoxBets.map(bet => (
                    <Menu key={bet.id}>
                      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" height='auto' p='2' textAlign="left">
                        <Stat textAlign="left">
                          <StatLabel isTruncated>{bet.reason}</StatLabel>
                          <StatNumber fontSize="lg">From {bet.bettor_username}</StatNumber>
                          <StatHelpText>{bet.created_at}</StatHelpText>

                        </Stat>
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={e => {
                          acceptBet(bet.id);
                          setTimeout(getAndSetBets, 500);
                        }}>✔️ Accept</MenuItem>
                        <MenuItem onClick={e => {
                          declineBet(bet.id);
                          setTimeout(getAndSetBets, 500);
                        }}>❌ Decline</MenuItem>
                      </MenuList>
                    </Menu>
                  ))}

                </SimpleGrid>
              </AccordionPanel>
            </AccordionItem>}

          {!mediatedBets.length ? <div></div> :
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex='1' textAlign='left' >
                    <Text textAlign="left" p="2">Mediate bets
                      <Badge ml='1' fontSize='0.8em' colorScheme='orange' variant="subtle">
                        Resolve as the mediator
                      </Badge>
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <SimpleGrid
                  spacing='2'
                  paddingTop='5'
                  textAlign='center'
                  rounded='lg'
                >
                  {mediatedBets.map(bet => (
                    <Menu key={bet.id} >
                      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" height='auto' p='2' textAlign="left">
                        <Stat textAlign="left">
                          <StatLabel isTruncated>{bet.reason}</StatLabel>
                          <StatNumber fontSize="lg">Between {bet.bettor_username} & {bet.caller_username}</StatNumber>
                          <StatHelpText>{bet.created_at.split("T")[0]}</StatHelpText>

                        </Stat>
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={e => {
                          resolveConflict(privateKey, true, bet);
                          setTimeout(getAndSetBets, 500);
                        }}>🎉 {bet.bettor_username} won</MenuItem>
                        <MenuItem onClick={e => {
                          resolveConflict(privateKey, false, bet);
                          setTimeout(getAndSetBets, 500);
                        }}>🎉 {bet.caller_username} won</MenuItem>
                      </MenuList>
                    </Menu>
                  ))}

                </SimpleGrid>
              </AccordionPanel>
            </AccordionItem>}

          {!sentBets.length ? <div></div> :
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex='1' textAlign='left'>
                    <Text textAlign="left" p="2">Sent bets
                      <Badge ml='1' fontSize='0.8em' colorScheme='yellow' variant="subtle">
                        Waiting to be accepted
                      </Badge>
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <SimpleGrid
                  spacing='2'
                  paddingTop='5'
                  textAlign='center'
                  rounded='lg'
                >
                  {sentBets.map(bet => (

                    <Menu key={bet.id}>
                      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" height='auto' p='2' textAlign="left">
                        <Stat textAlign="left">
                          <StatLabel isTruncated>{bet.reason}</StatLabel>
                          <StatNumber fontSize="lg">Between {bet.bettor_username} & {bet.caller_username}</StatNumber>
                          <StatHelpText>{bet.created_at.split("T")[0]}</StatHelpText>

                        </Stat>
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={e => {
                          acceptBet(bet.id);
                          setTimeout(getAndSetBets, 500);
                        }}>Cancel</MenuItem>
                      </MenuList>
                    </Menu>
                  ))}

                </SimpleGrid>
              </AccordionPanel>
            </AccordionItem>}

          {!completedBets.length ? <div></div> :
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex='1' textAlign='left'>
                    <Text textAlign="left" p="2">History
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <SimpleGrid
                  spacing='2'
                  paddingTop='5'
                  textAlign='center'
                  rounded='lg'
                >
                  {completedBets.map(bet => (

                    <Menu key={bet.id}>
                      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" height='auto' p='2' textAlign="left">
                        <HStack width="100%">
                          <div>
                            <Text fontSize="sm">With {bet.bettor_username === username ? bet.caller_username : bet.bettor_username}</Text>
                            <Text fontSize="xs">{bet.created_at.split("T")[0]}</Text>
                          </div>
                          <Text fontSize="sm" width="100%" textAlign="right">{bet.bettor_state === 1 ? bet.bettor_username === username ? "(won) 🎉" : "(lost) 🙃" : bet.bettor_username === username ? "(lost) 🙃" : "(won) 🎉"}</Text>
                        </HStack>
                      </MenuButton>
                      <MenuList>
                        <Link to={"/pool/" + bet.id} target="_blank">
                          <MenuItem icon={<ExternalLinkIcon />}>Open</MenuItem>
                        </Link>
                      </MenuList>
                    </Menu>

                  ))}

                </SimpleGrid>
              </AccordionPanel>
            </AccordionItem>}
        </Accordion>

        <Modal
          isOpen={isOpen}
          onClose={onClose}
        ><NewBetDialog onClose={onClose} getAndSetBets={getAndSetBets} />
        </Modal>

      </div>
    </Center >
  )
}

export { Dashboard };
