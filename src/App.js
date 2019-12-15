import React from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import CssBaseline from '@material-ui/core/CssBaseline';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/moment';

import AppUpdater from './components/app-updater';

import { StoreProvider } from './components/context-store';

function App() {
  const [openResourceDialog, setOpenResourceDialog] = React.useState(false);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const defaultToDarkMode = true; // TODO: This basically overrides any settings. Should be user-definable

  window.appData
    .getVersion()
    .then(version => console.log(`Version: ${version}`));

  // Theme Hook from MaterialUI
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode || defaultToDarkMode ? 'dark' : 'light'
        }
      }),
    [prefersDarkMode, defaultToDarkMode]
  );

  const toggleResourceDialog = () => {
    setOpenResourceDialog(!openResourceDialog);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <CssBaseline />
          <AppUpdater />
        </StoreProvider>
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
