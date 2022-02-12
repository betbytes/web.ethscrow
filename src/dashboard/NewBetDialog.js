import { Modal, ModalOverlay, ModalContent, Button, ModalHeader, ModalCloseButton, Stack, InputGroup, Input, InputLeftElement, ModalFooter, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import "../App.css";
import { API_URL } from "../utils/constants";
import { useToast } from '@chakra-ui/react'

const NewBetDialog = (props) => {
  const [betWith, setBetWith] = useState("");
  const [mediator, setMediator] = useState("");
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");

  const toast = useToast({
    position: 'top',
  });

  const submitBet = async (e) => {
    let res = await fetch(API_URL + "/broker/create", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      withCredentials: true,
      body: JSON.stringify({
        caller_username: betWith,
        mediator_username: mediator,
        reason: reason,
        proposed_amount: amount,
      }),
    });

    if (res.status !== 201) {
      toast({
        title: 'Invitation could not be sent.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Bet pool invitation sent.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      props.onClose();
    }
  };

  return (
    <div>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a new bet pool</ModalHeader>
        <ModalCloseButton />
        <Stack direction='column' p={2}>
          <Input variant='filled' placeholder='Bet With' value={betWith} onChange={e => setBetWith(e.target.value)} />
          <Input variant='filled' placeholder='Mediator - Optional' value={mediator} onChange={e => setMediator(e.target.value)} />

          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              color='gray.300'
              fontSize='1.2em'
              children='$'
            />
            <Input variant='filled' placeholder='Enter proposed amount in Eth (Ethereum)' value={amount} onChange={e => setAmount(e.target.value)} />
          </InputGroup>

          <Textarea variant='filled' placeholder='Enter the reason of the bet here...' value={reason} onChange={e => setReason(e.target.value)} />

          <Stack direction='row' >
            <Button
              size='sm'
              mr="5"
              width='75%'
              variant='outline'
              onClick={submitBet}
            >Send Invitation
            </Button>
            <Button
              size='sm'
              width='25%'
              onClick={props.onClose}
              variant='outline'
            >Cancel</Button>
          </Stack>
        </Stack>
      </ModalContent>
    </div>
  );
};

export default NewBetDialog;
