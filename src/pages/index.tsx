import { Flex, Code } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { SpotifyData } from 'types';
import useSWR, { Fetcher } from 'swr';
import fetcher from 'scripts/utils';
import Link from 'next/link';
import SpButton from 'components/Button';
import { SpotifyLogo } from 'components/icons';

export default function App() {
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPES = ["streaming", "user-modify-playback-state", "user-read-private", "user-read-email", "user-read-playback-state", "user-read-currently-playing"]

  const [authToken, setAuthToken] = useState<false | string>(false)
  const [status, setStatus] = useState<string>("")
  

  const { data: np, error, isLoading } = useSWR<SpotifyData>('/api/np', fetcher, { refreshInterval: 2000 })

  useEffect(() => {
        const codeInUrl = new URL(window.location.href.replace('#', '?')).searchParams.get('access_token')
        if (!authToken && codeInUrl != undefined){
            window.localStorage.setItem("code", codeInUrl)
            setAuthToken(codeInUrl);
            window.location.hash="";
        }
  }, [])

  async function playTrack(){

    if (np && np?.is_playing == true){
        let res = await fetch('https://api.spotify.com/v1/me/player/play', {
            method:"PUT",
            body:JSON.stringify({
                "uris": [np.item.uri],
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (res.status == 204){
            console.log('Playing')
            setStatus('Playing')
        }
        else {
            let text = await res.text();
            setStatus(text);
        }
    }
    else {
        alert('Not Playing Anything')
    }
    
  }

  const logout = () => {
    setAuthToken(false)
      window.localStorage.removeItem("code")
  }

  return (
    <Flex direction="column" justifyContent='center' alignItems="center" minH="100vh">
      <Flex direction="column" w={{base:"100%", md:"50%"}} alignItems="center" justifyContent='center'>
        <Link href="/">
            <SpotifyLogo height='auto' width={64*4}/>
        </Link>
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
        <Flex direction="column" alignItems='center' justifyContent='center'>
            {!authToken ?
                <Link href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES.join('+')}`}>
                    <SpButton>
                        Join with Spotify
                    </SpButton>
                </Link>
            : (
                <>
                    <span>{status ? status : ""}</span>
                    <br/>
                    <Flex direction={{base:"column", md:"row"}}>
                        <SpButton onClick={playTrack} mr={2} isDisabled={!Boolean(np?.is_playing)}>Play in-sync</SpButton>
                        <SpButton onClick={logout}>Logout</SpButton>
                    </Flex>
                </>
            )}
        </Flex>
        
      </Flex>
    </Flex>
  );
}