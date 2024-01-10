import { Container, Divider, FormControl, Grid, IconButton, List, ListItem, ListItemText, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useEffect, useRef, useState } from "react";
import './Chatroom.css';
import SendIcon from '@mui/icons-material/Send';

function ChatRoom(){

    const ENTER_KEY_CODE = 13;

    // const chatMessageDto = {
    //     user: 'naveen',
    //     message: 'this is naveen'
    // }
    const name = localStorage.getItem('userName');
    const teamName = localStorage.getItem('teamName');
    console.log(name);
    const scrollBottomRef = useRef(null);
    const webSocket = useRef(null);
    const [chatMessages, setChatMessages] = useState([]);
    // const [user, setUser] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log('Connecting WebSocket..');
        webSocket.current = new WebSocket('wss://1cw5xmuen5.execute-api.us-east-1.amazonaws.com/pythonProd');
        const openWebSocket = () => {
            webSocket.current.onopen = (event) => {
                console.log("Sending team name to socket");
                const message = {
                    action: "setTeamName",
                    name: name,
                    teamID: teamName
                  };
                  webSocket.current.send(JSON.stringify(message));
                };
                
                // webSocket.current.onmessage = (event) => {
                //   const data = JSON.parse(event.data);
                //   console.log("Received message:", data);
                  // Handle the message received from the server
                  // Update your state or perform any other action based on the message content
                // };
            
                // webSocket.current.onclose = (event) => {
                //   console.log('Disconnect:', event);
                // };
              };
        openWebSocket();
        return () => {
            console.log('Disconnecting WebSocket..');
            webSocket.current.close();
        }
    }, []);

    useEffect(() => {
        webSocket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received message:', data);
            console.log(typeof data);
            // console.log(data.System);
            // const temp = data.System;
            // console.log(typeof temp);
            setChatMessages((prevChatMessages) => [...prevChatMessages, data]);
            // setChatMessages(data);
            console.log(data);
            console.log(chatMessages);
            if(scrollBottomRef.current) {
                scrollBottomRef.current.scrollIntoView({ behavior: 'smooth'});
            }
        }
    }, [chatMessages]);

    // const handleUserChange = (event) => {
    //     setUser(event.target.value);
    // }

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    }

    const handleEnterKey = (event) => {
        if(event.keyCode === ENTER_KEY_CODE){
            sendMessage();
        }
    }

    const sendMessage = () => {
        console.log('Send!');
        // if(user && message) {
            console.log('Send!');
            const payload = {
                name: name,
                message: message,
                teamID: teamName,
                action: "sendMessage",
              };
            webSocket.current.send(JSON.stringify(payload));
            setMessage("");
            // webSocket.current.send({user:"naveen", message: "this","teamId": "team1", action: "sendMessage"});
            // webSocket.current.onmessage = (event) => {
            //     const data = JSON.parse(event.data);
            //     console.log("Received message:", data);
                // Handle the message received from the server
                // Update your state or perform any other action based on the message content
            //   };
            // setMessage('');
        // }
    };

    // const listChatMessages = chatMessages.map((chatMessage, index) => (
    //     <ListItem key={index}>
    //       <ListItemText primary={chatMessage.System ? chatMessage.System : `${user}: ${chatMessage.message}`} />
    //     </ListItem>
    //   ));
    const listChatMessages = chatMessages.map((chatMessage, index) => {
        if (chatMessage.System) {
          // Display system message
          return (
            <ListItem key={index}>
              <ListItemText primary={`System: ${chatMessage.System}`} />
            </ListItem>
          );
        } else {
          // Display user message
          const userName = Object.keys(chatMessage)[0]; // Assuming there's only one key (e.g., 'naveen')
          const userMessage = chatMessage[userName];
          return (
            <ListItem key={index}>
              <ListItemText primary={`${userName}: ${userMessage}`} />
            </ListItem>
          );
        }
      });

    return (
        <Fragment>
            <Container>
                <Paper elevation={5}>
                    <Box p={3}>
                        <Typography variant="h4" gutterBottom>
                            Happy chatting!
                        </Typography>
                        <Divider />
                        <Grid container spacing={4} alignItems="center">
                            <Grid id="chat-window" xs={12} item>
                                <List id="chat-window-messages">
                                    {listChatMessages}
                                    <ListItem ref={scrollBottomRef}></ListItem>
                                </List>
                            </Grid>
                            <Grid xs={2} item>
                                <FormControl fullWidth>
                                    {/* <TextField onChange={handleUserChange}
                                        value={user}
                                        label="Nickname" */}
                                        {/* variant="outlined"/> */}
                                    {/* <Typography variant="outlined">{user}</Typography> */}
                                </FormControl>
                            </Grid>
                            <Grid xs={9} item>
                                <FormControl fullWidth>
                                    <TextField onChange={handleMessageChange} onKeyDown={handleEnterKey}
                                        value={message}
                                        label="Type your message..."
                                        variant="outlined"/>
                                </FormControl>
                            </Grid>
                            <Grid xs={1} item>
                                <IconButton onClick={sendMessage}
                                    aria-label="send"
                                    color="primary">
                                        <SendIcon />
                                </IconButton>
                            </Grid>
                            
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </Fragment>
    );
}

export default ChatRoom;