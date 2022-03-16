import { API_URL } from "../utils/constants";

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
  InitializePool: 10,
  PoolStateChange: 11,
};

export const BetState = {
  LostState: -1,
  WonState: 1,
  NeutralState: 0,
  ConflictState: -2,
}

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

export async function setupP2P(ws, messageType, data) {
  ws.send(JSON.stringify({
    type: messageType,
    body: {
      data: data
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
    type: MessageType.AnswerCandidate,
    body: {
      data: event.candidate,
    },
  }))
}

export async function handleICEAnswerEvent(sdp, p2p) {
  if (sdp && sdp.candidate) {
    try {
      var candidate = new RTCIceCandidate(sdp);
      await p2p.addIceCandidate(candidate);
    } catch (e) { }
  }
}

export async function submitStateChange(id, state, encOtherShare, privateThresholdKey) {
  let changedState = {
    new_state: state,
  };

  if (state === BetState.LostState) {
    changedState.threshold_key = privateThresholdKey;
  } else if (state === BetState.ConflictState) {
    changedState.threshold_key = encOtherShare;
    changedState.plain_threshold_key = privateThresholdKey;
  }

  let res = await fetch(API_URL + `/broker/${id}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    withCredentials: true,
    body: JSON.stringify(changedState),
  });

  let response = await res.json();
  console.log(response);

  return { status: res.status };
}

export async function transferAllOut(id, toAddress, privateKey) {
  let genResponse = await fetch(API_URL + `/broker/${id}/withdraw/generate`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    withCredentials: true,
    body: JSON.stringify({ to: toAddress }),
  });

  let tx = await genResponse.json();
  let signedTx = window.signEthTx(JSON.stringify(tx.transaction), tx.network_id, privateKey);

  let processResponse = await fetch(API_URL + `/broker/${id}/withdraw`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    withCredentials: true,
    body: signedTx,
  });

  let processJSON = await processResponse.json();

  return { status: processResponse.status, hash: processJSON.hash };
}