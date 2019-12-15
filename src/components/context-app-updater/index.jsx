import React from 'react'
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Snackbar, SnackbarContent } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  snackbar: {
    backgroundColor: theme.palette.primary.main,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}))

export const AppUpdaterContext = React.createContext({
  version: '0.0.0',
})

export const AppUpdaterConsumer = AppUpdaterContext.Consumer;

export function AppUpdaterProvider({ children }) {
  const classes = useStyles();

  const [version, setVersion] = React.useState(null)
  const [updateAvailable, setUpdateAvailable] = React.useState(false)
  React.useEffect(() => {
    if (updateAvailable) {
      // Do some update shitz?
      console.log('An Update is available effect')
    }
  }, [updateAvailable])

  React.useEffect(() => {
    getVersion()
  }, []);

  const getVersion = () => {
    console.log(window.appData)
    window.appData.getVersion().then(res => setVersion(res))
  }

  const { updateEvents } = window.appData

  updateEvents.on('update_available', () => {
    // updateEvents.removeAllListeners('update_available');

    console.log('An Update is available!')
    setUpdateAvailable(true)
  })

  return (
    <AppUpdaterContext.Provider value={{ version }}>
      <Snackbar
        className={classes.snackbar}
        open={updateAvailable}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }} >
          <SnackbarContent
            message={<span id="update-message-id" className={classes.message}> Version - {version}</span>}
          />
        </Snackbar>
      {children}
    </AppUpdaterContext.Provider>
  )


}

AppUpdaterContext.propTypes = {
  children: PropTypes.any,
};

AppUpdaterContext.defaultProps = {
  children: {},
};