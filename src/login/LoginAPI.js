import { API_URL } from "../utils/constants";

export function login(user, password) {
  return fetch(API_URL + "/login", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: user, password: password }),
  }).then(data => data.json())
}