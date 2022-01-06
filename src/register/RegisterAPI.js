import { API_URL } from "../utils/constants";

export function register(email, user, password, pubkey) {
  return fetch(API_URL + "/register", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email, username: user, password: password, publickey: pubkey }),
  }).then(data => data.json())
}