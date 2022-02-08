import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StatNumber, Box, Text, Button, Center, SimpleGrid, Menu, MenuButton, MenuItem, MenuList, Stat, StatLabel, StatHelpText, Badge, useDisclosure, Modal, Heading } from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon, CheckIcon, MinusIcon, InfoOutlineIcon, CloseIcon } from "@chakra-ui/icons";
import { API_URL } from "../utils/constants";
import { acceptBet, declineBet, getBets } from './DashboardAPI';
import NewBetDialog from './NewBetDialog';

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [activeBets, setActiveBets] = useState([]);
  const [indoxBets, setIndoxBets] = useState([]);
  const [mediatedBets, setMediatedBets] = useState([]);
  const [sentBets, setSentBets] = useState([]);

  let navigate = useNavigate();

  const [username, setUsername] = useState("");

  useEffect(() => {
    let user = localStorage.getItem("username");
    if (!user) {
      navigate("/login");
    } else {
      setUsername(user);
      getBets().then(bets => {
        setActiveBets(bets.active ?? []);
        setIndoxBets(bets.inbox ?? []);
        setMediatedBets(bets.resolve ?? []);
        setSentBets(bets.sent ?? []);
      });
    }
  }, []);

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

        <Box boxShadow='md' borderWidth='1px' marginBottom='10' marginTop='10' padding='2' borderRadius='lg' alignItems='left'>
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

            {!activeBets.length ?
              <Text>No active bets</Text> :
              activeBets.map(bet => (
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

                    <MenuItem icon={<CheckIcon />}>I won</MenuItem>
                    <MenuItem icon={<MinusIcon />}>I lost</MenuItem>
                    <MenuItem icon={<InfoOutlineIcon />}>Conflict</MenuItem>
                  </MenuList>
                </Menu>
              ))}

          </SimpleGrid>
        </Box>

        {!indoxBets.length ? <div></div> :
          <Box boxShadow='md' borderWidth='1px' marginBottom='5' marginTop='10' padding='2' borderRadius='lg' alignItems='left'>
            <Text textAlign="left" p="2">Invitations
              <Badge ml='1' fontSize='0.8em' colorScheme='green' variant="subtle">
                New
              </Badge>
            </Text>

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
                    <MenuItem icon={<CheckIcon />} onClick={e => acceptBet(bet.id)}>Accept</MenuItem>
                    <MenuItem icon={<CloseIcon />} onClick={e => declineBet(bet.id)}>Decline</MenuItem>
                  </MenuList>
                </Menu>
              ))}

            </SimpleGrid>
          </Box>
        }
        <Modal
          isOpen={isOpen}
          onClose={onClose}
        ><NewBetDialog onClose={onClose} />
        </Modal>

      </div>
    </Center>
  )
}

export { Dashboard };
