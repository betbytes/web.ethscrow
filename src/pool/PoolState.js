import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatNumber, Box, Text, Button, Center, SimpleGrid, InputRightElement, MenuButton, MenuItem, MenuList, Alert, AlertIcon, CloseButton, Badge, InputGroup, InputLeftAddon, Input, InputRightAddon } from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon, MinusIcon, InfoOutlineIcon, CloseIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { API_URL } from '../utils/constants';
import { Pool } from "./Pool";

const PoolState = () => {
  let { PoolId } = useParams();
  const [isActiveBet, setIsActiveBet] = useState(false);
  const [bet, setBet] = useState({});

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://" + API_URL.substring(7) + "/broker/" + PoolId);
    ws.current.onopen = () => setIsActiveBet(true);
    ws.current.onmessage = (msg) => setBet(JSON.parse(msg.data).body);

  }, []);

  return (
    <div>
      {isActiveBet && Object.keys(bet).length !== 0 && <Pool webSocket={ws.current} bet={bet} />}
      {!isActiveBet &&
        <div>
          <Text>You are not part of the pool</Text>
        </div>}
    </div>
  );
};

export default PoolState;
