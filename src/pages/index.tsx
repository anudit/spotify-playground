import { Flex, Heading } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { SpotifyData } from 'types';

export default function App() {
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "code"
  const SCOPES = ["user-read-playback-state", "user-read-currently-playing"]

  const [code, setCode] = useState("")
  const [np, setNp] = useState<null | SpotifyData>(null);

  useEffect(() => {
        const codeInUrl = new URL(window.location.href).searchParams.get('code')
        if (!code && codeInUrl != undefined){
            window.localStorage.setItem("code", codeInUrl)
            setCode(codeInUrl)
        }

        fetch('/api/np').then(e=>e.json()).then(setNp)

  }, [])

  const logout = () => {
      setCode("")
      window.localStorage.removeItem("code")
  }

  return (
      <Flex direction="column">
        <h1>Spotify</h1>
        <Flex direction="column" mt={4}>
            {
                np && np?.is_playing == true ? (
                    <p>Playing {np.item.name + " - " + np.item.album.artists.map(e=>e.name).join(', ')}</p>
                ) : (
                    <p>Not Playing</p>
                )
            }
        </Flex>
        <br/>
        <Flex direction="column">
            {!code ?
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES.join(' ')}`}>
                    Join with Spotify
                </a>
            : (
                <>
                    <p>Code: {code}</p>
                    <br/>
                    <button onClick={logout}>Logout</button>
                </>
            )}
        </Flex>
        
      </Flex>
  );
}