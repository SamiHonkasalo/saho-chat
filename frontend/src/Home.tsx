import React, { ChangeEvent, useState, useEffect, useRef } from 'react';
import {
  Button,
  Container,
  Grid,
  makeStyles,
  TextField,
} from '@material-ui/core';
import Chat from './chat/Chat';

const useStyles = makeStyles(() => ({
  fullHeight: {
    height: '100%',
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();
  const [usernameInput, setUsernameInput] = useState('');
  const usernameInputRef = useRef<HTMLTextAreaElement | HTMLInputElement>();
  const [username, setUsername] = useState('');

  // On mount, set focus to username field
  useEffect(() => {
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, []);

  const handleUsernameInputChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setUsernameInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (usernameInput.length > 0) {
      setUsername(usernameInput);
    }
  };

  return (
    <Container
      maxWidth="md"
      className={classes.fullHeight}
      style={{ maxHeight: '85vh' }}
    >
      <Grid container className={classes.fullHeight} justify="center">
        {username.length > 0 ? (
          <Chat username={username} />
        ) : (
          <Grid container item xs={12} alignItems="center" justify="center">
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <TextField
                inputRef={usernameInputRef}
                variant="outlined"
                className={classes.fullHeight}
                InputProps={{ classes: { root: classes.fullHeight } }}
                fullWidth
                value={usernameInput}
                onChange={handleUsernameInputChange}
                placeholder="Enter username"
                color="secondary"
              />
              <Button
                style={{ marginTop: 15 }}
                type="submit"
                variant="contained"
                color="primary"
                disabled={usernameInput.length <= 0}
              >
                Submit
              </Button>
            </form>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Home;
