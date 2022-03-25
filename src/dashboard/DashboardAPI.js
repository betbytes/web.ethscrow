import { BetState } from "../pool/PoolAPI";
import { API_URL } from "../utils/constants";

export async function getBets() {
  let betsRes = await fetch(API_URL + "/user/pool", {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    withCredentials: true,
  });

  return await betsRes.json();
}

export async function acceptBet(id) {
  let res = await fetch(API_URL + `/broker/${id}/accept`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    withCredentials: true,
  });

  return { status: res.status };
}

export async function declineBet(id) {
  let res = await fetch(API_URL + `/broker/${id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    withCredentials: true,
  });

  return { status: res.status };
}

export async function resolveConflict(privateKey, bettorWon, bet) {
  let threshKey;

  if ((bet.bettor_state === BetState.ConflictState && bettorWon) || (bet.caller_state === BetState.ConflictState && !bettorWon)) {
    let keyParts = bet.threshold_key.split("-");
    threshKey = window.decrypt(privateKey, keyParts[0], keyParts[1], keyParts[2], keyParts[3]);
  } else if ((bet.bettor_state === BetState.ConflictState && !bettorWon) || (bet.caller_state === BetState.ConflictState && bettorWon)) {
    threshKey = bet.conflict_temp_data;
  }

  let res = await fetch(API_URL + `/broker/${bet.id}/resolve`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    withCredentials: true,
    body: JSON.stringify({
      threshold_key: threshKey,
      winner_username: bettorWon ? bet.bettor_username : bet.caller_username,
    }),
  });

  return { status: res.status };
}