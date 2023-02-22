import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

  const token = Buffer.from(`${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');
  const refresh_token = process.env.REFRESH_TOKEN || "";
  const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
  const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

  const resp = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    body: new URLSearchParams({
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }),      
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }).then(e=>e.json()) as {access_token: string};

  let data = await fetch(NOW_PLAYING_ENDPOINT, {
    method:"GET",
    headers: {
      'Content-Type':'application/json',
      'Authorization':`Bearer ${resp.access_token}`
    }
  }).then(e=>e.json()).catch(console.log);

  if (!data){
    res.status(200).json({})
  }
  else  res.status(200).json(data)
}
