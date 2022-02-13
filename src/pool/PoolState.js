import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatNumber, Box, Text, Button, Center, SimpleGrid, InputRightElement, MenuButton, MenuItem, MenuList, Alert, AlertIcon, CloseButton, Badge, InputGroup, InputLeftAddon, Input, InputRightAddon, Spinner } from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon, MinusIcon, InfoOutlineIcon, CloseIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { API_URL } from '../utils/constants';
import { Pool } from "./Pool";

const PoolState = () => {
  let { PoolId } = useParams();
  const [isActiveBet, setIsActiveBet] = useState(false);
  const [pool, setPool] = useState({});
  const [loading, setLoading] = useState(true)

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://" + API_URL.substring(7) + "/broker/" + PoolId);
    ws.current.onclose = () => setLoading(false);
    ws.current.onopen = () => setIsActiveBet(true);
    ws.current.onmessage = (msg) => setPool(JSON.parse(msg.data).body);

  }, []);

  return (
    <div>
      {
        loading && !isActiveBet &&
        <Center className='vertical-center'>
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='steelblue'
            size='xl'
          />
        </Center>
      }
      {isActiveBet && Object.keys(pool).length !== 0 && <Pool webSocket={ws.current} pool={pool} />}
      {!isActiveBet && !loading &&
        <div>
          <Text>You are not part of the pool</Text>
        </div>}
    </div>
  );
};

export default PoolState;
