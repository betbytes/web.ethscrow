import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatNumber, Box, Text, Button, Center, SimpleGrid, InputRightElement, MenuButton, MenuItem, MenuList, Alert, AlertIcon, CloseButton, Badge, InputGroup, InputLeftAddon, Input, InputRightAddon } from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon, MinusIcon, InfoOutlineIcon, CloseIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { API_URL } from '../utils/constants';

const PoolState = () => {
  let { PoolId } = useParams();

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://" + API_URL.substring(7) + "/broker/" + PoolId);
    ws.current.onopen = () => console.log("ws opened");

  }, []);

  return (
    <div>

    </div>
  );
};

export default PoolState;
