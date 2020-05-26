import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { GoogleLogin } from 'react-google-login';

require('dotenv').config('../.env')


var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API_KEY}).base('appVzdOnR4SFUPs9G');

const responseGoogle = (response) => {
  const Url='https://oauth2.googleapis.com/token';
  const Data=JSON.stringify({
    code: response.code,
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI,
    grant_type: "authorization_code"
  });
  const otherParam={
    body:Data,
    method: "POST"
  };
  fetch(Url,otherParam)
  .then((res)=> res.json()).then(function(data){
    if(typeof data.access_token !== 'undefined') {
      base('oauth').create([
        {
          "fields": {
            "ID": userId,
            "oauth-token": data.access_token,
            "expires_at": (data.expires_in * 1000) + Date.now(),
            "refresh-token": data.refresh_token
          }
        }
      ], function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record) {
          console.log(record.getId());
        });
      })
    } 
  }).catch(error=>console.log(error))
}

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user_id');

ReactDOM.render(
  <React.StrictMode>
     <GoogleLogin
        clientId={process.env.REACT_APP_CLIENT_ID}
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
        scope={'https://www.googleapis.com/auth/calendar'}
        prompt="consent"
        responseType="code"
        accessType="offline"
      />
  </React.StrictMode>,
  document.getElementById('root')
);
