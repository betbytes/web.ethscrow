import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatNumber, Box, Text, Button, Center, SimpleGrid, Menu, MenuButton, MenuItem, MenuList, Stat, StatLabel, StatHelpText, Badge } from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon, CheckIcon, MinusIcon, InfoOutlineIcon, CloseIcon } from "@chakra-ui/icons";

const Dashboard = () => {

  const tempData = [
    {
      id: "S543GD134BD",
      amount: 2.3,
      with: "bob",
      date: "Feb 10 2021",
    },
    {
      id: "S543GD13234BD",
      amount: 0.3,
      with: "billy",
      date: "Feb 10 2021",
    },
    {
      id: "S54354GD134BD",
      amount: 0.543,
      with: "frank",
      date: "Feb 10 2021",
    }
  ];

  const navigate = useNavigate();

  const [username, setUsername] = useState("");

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
            <h1>Welcome back, {username}</h1>

            <Button
              size='xs'
              width='100%'
              loadingText='Logging in'
              variant='outline'
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
            {tempData.map(bet => (
              <Menu key={bet.id}>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" height='auto' p='2'>
                  <Stat textAlign="left">
                    <StatLabel>Bet with {bet.with}</StatLabel>
                    <StatNumber fontSize="lg">{bet.amount} eth</StatNumber>
                    <StatHelpText>As of {bet.date}</StatHelpText>

                  </Stat>
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<ExternalLinkIcon />}>Open</MenuItem>
                  <MenuItem icon={<CheckIcon />}>I won</MenuItem>
                  <MenuItem icon={<MinusIcon />}>I lost</MenuItem>
                  <MenuItem icon={<InfoOutlineIcon />}>Conflict</MenuItem>
                </MenuList>
              </Menu>
            ))}
          </SimpleGrid>
        </Box>

        <Box boxShadow='md' borderWidth='1px' marginBottom='10' marginTop='10' padding='2' borderRadius='lg' alignItems='left'>
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
            {tempData.map(bet => (
              <Menu key={bet.id + "43"}>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" p='2' textAlign="left">
                  <Text size="sm">Test</Text>
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<ExternalLinkIcon />}>Open</MenuItem>
                  <MenuItem icon={<CloseIcon />}>Decline</MenuItem>
                </MenuList>
              </Menu>
            ))}
          </SimpleGrid>
        </Box>

      </div>
    </Center>
  )
}

export { Dashboard };
