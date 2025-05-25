import { fetchRetry } from "../stuff/fetchRetry";

export const getServerTime = (i: RequestInit) => 
    fetchRetry('https://open.spotify.com/server-time', i)
    .then(r=>r.json())
    .then(r=>r as {serverTime: number});