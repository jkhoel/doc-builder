import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import {
  Snackbar,
  SnackbarContent,
  IconButton,
  Button
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';

const useStylesWrapper = makeStyles(theme => ({
  info: {
    backgroundColor: green[600]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
}));

function SnackbarContentWrapper({
  message,
  variant,
  className,
  onClose,
  onUpdate,
  ...other
}) {
  const classes = useStylesWrapper();

  const actions = [
    <Button key="restart-btn" color="primary" size="small" onClick={onUpdate}>
      Update
    </Button>,
    <IconButton
      key="close-btn"
      aria-label="close"
      color="inherit"
      onClick={onClose}
    >
      <CloseIcon className={classes.icon} />
    </IconButton>
  ];

  return (
    <SnackbarContent
      className={classes[variant] + ' ' + className}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <InfoIcon className={classes.icon + ' ' + classes.iconVariant} />
          {message}
        </span>
      }
      action={actions}
      {...other}
    />
  );
}

SnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  onUpdate: PropTypes.func,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired
};

export default function AppUpdater({ children }) {
  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  const { updateEvents } = window.appData;
  updateEvents.on('update_available', () => {
    updateEvents.removeAllListeners('update_available');

    setUpdateAvailable(true);
  });

  const handleClose = () => {
    setUpdateAvailable(false);
  };

  const handleUpdate = () => {
    window.appData.restartApp();
  };

  const message = `An update is available! Install now?`;

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      open={updateAvailable}
    >
      <SnackbarContentWrapper
        onUpdate={handleUpdate}
        onClose={handleClose}
        variant="info"
        message={message}
      />
    </Snackbar>
  );
}
