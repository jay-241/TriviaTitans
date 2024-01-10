import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import '../Styles/Profile.css';
import ChatBot from '../Components/Chatbot';
export default function Leaderboard() {
  // const [user, setUser] = useState()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    if (localStorage.getItem('token')) {
            setIsLoggedIn(true);     
    }

  }, [])

  return (
    <>
    <Header/>
    <ChatBot/>
    { isLoggedIn ?
        
    <div><iframe width="1500" height="700" src="https://lookerstudio.google.com/embed/reporting/a7978eb9-2345-4d44-aa51-5232ef51a0c8/page/mzhYD" frameborder="0" allowfullscreen></iframe></div>
    
    : 
    
    <div>
        <p className='error-message'>You are not Logged In!!</p>
        <a className='loginFirst' href='https://titans.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=5cm5p1n8m11vvclk312lifshs1&redirect_uri=https://serverless-bco7bjmf2q-uc.a.run.app' onClick={() => navigate('/logout')}>Login</a>
    </div>
     }
    </>
  )
}