require('dotenv').config({path: '.env.local'})

async function getDetails(){

    const AUTH_CODE = "";

    const token = Buffer.from(`${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');
  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Basic ${token}`);

    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "authorization_code");
    urlencoded.append("code", AUTH_CODE);
    urlencoded.append("redirect_uri", "http://localhost:3000");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    let resp = fetch("https://accounts.spotify.com/api/token", requestOptions)
        .then(response => response.json())

    console.log(resp);

}

getDetails();