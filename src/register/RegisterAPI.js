import { API_URL } from "../utils/constants";

export async function register(email, user, pubkey) {
  let res = await fetch(API_URL + "/register", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email, username: user, publickey: pubkey }),
  });

  if (res.status !== 200) {
    return { status: 400 };
  }

  let resJson = await res.json();

  return Object.assign(resJson, {
    status: res.status,
  })
}