import { Modal, ModalOverlay, ModalContent, Button, ModalHeader, ModalCloseButton, Stack, Text, Alert, InputLeftElement, ModalFooter, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import "../App.css";
import { API_URL } from "../utils/constants";
import { useToast } from '@chakra-ui/react'

const SubmitState = (props) => {

  const toast = useToast({
    position: 'top',
  });

  const submitState = async (e) => {
    props.ws.send(JSON.stringify({

    }));
    toast({
      title: 'State Updated.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    props.onClose();
  };

  return (
    <div>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>          {
          (props.state === 1 &&
            <Text>Are you sure you <Text as="span" fontSize="xl" color="green">won</Text>?</Text>)
          || (props.state === -1 &&
            <Text>Are you sure you <Text as="span" fontSize="xl" color="red">lost</Text>?</Text>)
          || (props.state === -2 &&
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