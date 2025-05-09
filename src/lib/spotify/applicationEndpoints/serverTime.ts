export const getServerTime = (i: RequestInit) => 
    fetch('https://open.spotify.com/server-time', i)
    .then(r=>r.json())
    .then(r=>r as {serverTime: number});