import { Modal, ModalOverlay, ModalContent, Button, ModalHeader, ModalCloseButton, Stack, Text, Alert, InputLeftElement, ModalFooter, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import "../App.css";
import { API_URL } from "../utils/constants";
import { useToast } from '@chakra-ui/react'
import { BetState, submitStateChange } from "./PoolAPI";

const SubmitState = (props) => {

  const toast = useToast({
    position: 'top',
  });

  const submitState = async (e) => {
    let res = await submitStateChange(props.poolID, props.state, props.encOtherShare, props.privateThresholdKey);
    console.log(res);

    if (res.status === 202) {
      toast({
        title: 'State Updated.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Error updating.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }

    props.onClose();
  };

  return (
    <div>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>          {
          (props.state === BetState.WonState &&
            <Text>Are you sure you <Text as="span" fontSize="xl" color="green">won</Text>?</Text>)
          || (props.state === BetState.LostState &&
            <Text>Are you sure you <Text as="span" fontSize="xl" color="red">lost</Text>?</Text>)
          || (props.state === BetState.ConflictState &&
            <Text>Submit <Text as="span" fontSize="xl" color="orange">conflict</Text> to the mediator.</Text>)

        }</ModalHeader>
        <Stack direction='column' p={2}>
          <Stack direction='row' >
            <Button
              size='sm'
              mr="5"
              width='75%'
              variant='outline'
              onClick={submitState}
            >Yes
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
  )
}

export default SubmitState