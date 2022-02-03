import { API_URL } from "../utils/constants";

export async function register(email, user, pubkey, encPubkey) {
  let res = await fetch(API_URL + "/user/create", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email: (email === "" ? undefined : email), username: user, public_key: pubkey, enc_public_key: encPubkey, }),
  });

  let resJson = await res.json();

  return Object.assign(resJson, {
    status: res.status,
  })
}