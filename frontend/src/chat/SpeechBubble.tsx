import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  ownMessage: {
    display: 'table',
    maxWidth: '40%',
    backgroundColor: theme.palette.primary.main,
    borderRadius: 15,
    padding: 15,
    marginLeft: 'auto',
    position: 'relative',
    '&:before': {
      content: '""',
      width: 0,
      height: 0,
      position: 'absolute',
      borderLeft: `15px solid ${theme.palette.primary.main}`,
      borderRight: `15px solid transparent`,
      borderTop: `15px solid ${theme.palette.primary.main}`,
      borderBottom: `15px solid transparent`,
      right: -16,
      top: 0,
    },
  },
  message: {
    display: 'table',
    maxWidth: '40%',
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 15,
    padding: 15,
    marginRight: 'auto',
    position: 'relative',
    '&:before': {
      content: '""',
      width: 0,
      height: 0,
      position: 'absolute',
      borderLeft: `15px solid transparent`,
      borderRight: `15px solid ${theme.palette.secondary.main}`,
      borderTop: `15px solid ${theme.palette.secondary.main}`,
      borderBottom: `15px solid transparent`,
      left: -16,
      top: 0,
    },
  },
  usernameText: {
    fontWeight: 450,
    fontSize: '0.75rem',
  },
  messageText: {
    fontSize: '1rem',
  },
}));

interface Props {
  user: string;
  message: string;
  isOwn: boolean;
}

const SpeechBubble: React.FC<Props> = ({ user, message, isOwn }: Props) => {
  const classes = useStyles();
  return (
    <Box style={{ width: '100%', marginTop: 10 }}>
      <Box className={isOwn ? classes.ownMessage : classes.message}>
        <Typography
          className={classes.usernameText}
          style={{ textAlign: isOwn ? 'start' : 'end' }}
        >
          {user}
        </Typography>
        <Typography className={classes.messageText}>{message}</Typography>
      </Box>
    </Box>
  );
};

export default SpeechBubble;
