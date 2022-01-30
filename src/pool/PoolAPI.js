export const MessageType = {
  Connect: 0,
  Disconnect: 1,
  Chat: 2,
  PoolDetails: 3,
  RefreshBalance: 4,
  GeneratingEscrow: 5,
  Offer: 6,
  Answer: 7,
  OfferCandidate: 8,
  AnswerCandidate: 9,
};

export async function submitMessage(ws, msg) {
  if (msg === "") {
    return;
  }

  ws.send(JSON.stringify({
    type: MessageType.Chat,
    body: {
      message: msg,
      important: true,
    },
  }));
}

export async function generateEscrow(ws) {
  ws.send(JSON.stringify({
    type: MessageType.GeneratingEscrow,
    body: {
      important: true,
    },
  }));
}