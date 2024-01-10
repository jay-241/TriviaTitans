// import { useEffect } from 'react';
// import Header from '../Components/Header';
// import '../Styles/Home.css';
// import Chatroom from '../Components/ChatRoom';
// // import { createSession } from '../Services/UserPool';

// function JoinGame() {

//     const chatboxStyle = {
//         position: 'fixed',
//         bottom: '15px',
//         right: '15px',
//         width: '500px',
//         height: '500px',
//         // border: '1px solid #ccc', 
//         // overflow: 'hidden' 
//     };

//     // useEffect(() => {
//     //     const queryParameters = new URLSearchParams(window.location.hash.substring(1));
//     //     const idTokenParam = queryParameters.get("id_token");
//     //     const accessTokenParam = queryParameters.get("access_token");
//     //     const verified = localStorage.getItem('verified');
//     //     if (idTokenParam && accessTokenParam) {
//     //         localStorage.setItem('token', accessTokenParam);
//     //         localStorage.setItem('idToken', idTokenParam);
//     //     }
//     //     const token = localStorage.getItem('token');
//     //     const idToken = localStorage.getItem('idToken');
//     //     if (token && idToken && verified !== 'true') {
//     //         window.location.href = 'http://localhost:3000/verify';
//     //     }
//     // }, [])

//     return (
//         <>
//             <Header />
//             JoinGame
//             <div style={chatboxStyle}>
//                 <Chatroom />
//             </div>

//         </>
//     )
// }

// export default JoinGame;