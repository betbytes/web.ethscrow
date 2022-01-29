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

  let json = await res.json();

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

  let json = await res.json();

  return { status: res.status };
}