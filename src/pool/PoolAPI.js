export const MessageType = {
  Connect: 0,
  Disconnect: 1,
  Chat: 2,
  PoolDetails: 3,
  RefreshBalance: 4,
  Offer: 5,
  Answer: 6,
  OfferCandidate: 7,
  AnswerCandidate: 8,
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