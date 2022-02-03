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

export async function createOffer(p2p) {
  let offer = await p2p.createOffer();
  await p2p.setLocalDescription(offer);
  return p2p.localDescription;
}

export async function createAnswer(p2p, sdp, initialized) {
  let desc = new RTCSessionDescription(sdp);
  await p2p.setRemoteDescription(desc);
  if (!initialized) {
    let answer = await p2p.createAnswer();
    await p2p.setLocalDescription(answer);
    return p2p.localDescription;
  }
}

export function handleICECandidateEvent(event, ws) {
  ws.send(JSON.stringify({
    type: MessageType.OfferCandidate,
    body: {
      sdp: event.candidate,
    },
  }))
}

export function handleICEAnswerEvent(sdp, p2p) {
  var candidate = new RTCIceCandidate(sdp);
  await p2p.addIceCandidate(candidate);
}