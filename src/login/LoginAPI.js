import { API_URL } from "../utils/constants";

export async function login(user, privateKey) {
  let challengeRes = await fetch(API_URL + `/user/challenge/${user}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (challengeRes.status !== 200) {
    return { status: 400 };
  }

  let challengeJson = await challengeRes.json();
  let signature = window.sign(privateKey, challengeJson.data);

  let submitRes = await fetch(API_URL + `/user/challenge/${user}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signature),
  });

  if (submitRes.status !== 200) {
    return { status: 400 };
  }

  return { status: 200 };
}