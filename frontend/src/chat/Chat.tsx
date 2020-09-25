import React, { ChangeEvent, useState, useEffect, useRef } from 'react';
import {
  Grid,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import * as signalR from '@microsoft/signalr';

import useNotification from '../utils/hooks/useNotification';
import SpeechBubble from './SpeechBubble';

const useStyles = makeStyles(() => ({
  fullHeight: {
    height: '100%',
  },
}));

interface Props {
  username: string;
}

type Message = {
  message: string;
  user: string;
  userId: string;
  type: 'message' | 'connectionMessage' | 'disconnectionMessage';
  messageId: string;
};

const Chat = ({ username }: Props) => {
  const classes = useStyles();
  const [inputText, setInputText] = useState('');
  const [connectionId, setConnectionId] = useState<Message['userId']>('');
  const [messages, setMessages] = useState<Message[]>([] as Message[]);
  const connection = useRef<signalR.HubConnection>();
  const messageInputRef = useRef<HTMLInputElement>();
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const notify = useNotification();

  // On mount, set focus to username field
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, []);

  // Set up connection
  useEffect(() => {
    if (!connection.current) {
      const c = new signalR.HubConnectionBuilder()
        .withUrl(`${process.env.REACT_APP_API_URL}/hub`)
        .withAutomaticReconnect()
        .build();
      c.on(
        'messageReceived',
        (user: string, userId: string, messageId: string, message: string) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { user, userId, message, type: 'message', messageId },
          ]);
        }
      );
      c.on(
        'userConnected',
        (user: string, userId: string, messageId: string) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { user, userId, message: '', type: 'connectionMessage', messageId },
          ]);
        }
      );
      c.on('setConnectionId', (userId: string) => {
        setConnectionId(userId);
      });

      c.on(
        'userDisconnected',
        (user: string, userId: string, messageId: string) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user,
              userId,
              message: '',
              type: 'disconnectionMessage',
              messageId,
            },
          ]);
        }
      );

      c.start()
        .then(() => {
          connection.current = c;
          c.invoke('userConnected', username);
        })
        .catch((err: Error) => notify({ message: err.message, type: 'error' }));
    }
    return () => {
      if (connection.current) {
        connection.current.stop().then(() => {
          if (connection.current) {
            connection.current.invoke('userDisconnected', username);
            connection.current = undefined;
          }
        });
      }
    };
  }, [notify, username]);

  useEffect(() => {
    // Scroll to the newest message
    const newestMessage = document.getElementById('newest-item');
    if (messageContainerRef && messageContainerRef.current && newestMessage) {
      const newestMessageHeight = newestMessage.clientHeight + 50;
      if (
        messageContainerRef.current.scrollTop +
          messageContainerRef.current.clientHeight >=
        messageContainerRef.current.scrollHeight - newestMessageHeight
      ) {
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      }
    }
  }, [messages]);

  const handleInputChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setInputText(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username.length > 0 && inputText.length > 0 && connection.current) {
      connection.current.send('newMessage', username, inputText);
      setInputText('');
    }
  };

  return (
    <>
      <Grid item xs={12} style={{ height: '80%' }}>
        <Paper
          elevation={16}
          className={classes.fullHeight}
          style={{ overflow: 'auto', padding: 5, display: 'flex' }}
          id="chat-container"
          ref={messageContainerRef}
          component="div"
        >
          <Grid
            container
            style={{
              alignContent: 'flex-end',
              padding: 20,
              marginTop: 'auto',
            }}
          >
            {messages.map((m, index) => {
              return m.type === 'message' ? (
                <SpeechBubble
                  id={index === messages.length - 1 ? 'newest-item' : undefined}
                  key={m.messageId}
                  message={m.message}
                  user={m.user}
                  isOwn={m.userId === connectionId}
                />
              ) : (
                <Grid
                  id={index === messages.length - 1 ? 'newest-item' : undefined}
                  key={m.messageId}
                  item
                  xs={12}
                  style={{
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body1">{`${m.user} ${
                    m.type === 'connectionMessage'
                      ? 'connected'
                      : 'disconnected'
                  }`}</Typography>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} style={{ height: '5%' }}>
        <Paper elevation={16} style={{ padding: 5 }}>
          <form onSubmit={handleSubmit}>
            <Grid container>
              <Grid item xs={9} sm={10}>
                <TextField
                  inputRef={messageInputRef}
                  className={classes.fullHeight}
                  InputProps={{ classes: { root: classes.fullHeight } }}
                  fullWidth
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="Enter message"
                  disabled={username.length <= 0}
                />
              </Grid>
              <Grid container item xs={3} md={2}>
                <IconButton
                  type="submit"
                  disabled={username.length <= 0 || inputText.length <= 0}
                  style={{ marginLeft: 'auto' }}
                >
                  <SendIcon color="primary" />
                </IconButton>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </>
  );
};
export default Chat;
