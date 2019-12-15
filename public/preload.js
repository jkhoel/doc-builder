const { ipcRenderer, remote } = require('electron');
const Store = remote.require('electron-store');
const EventEmitter = remote.require('events');

// Store Schema
const schema = {
  startDate: {
    type: 'string',
    default: '2019-01-01 00:00'
  },
  endDate: {
    type: 'string',
    default: '2019-12-31 24:00'
  },
  filter: {
    type: 'array',
    default: []
  },
  timestamp: {
    type: 'number',
    default: 0
  },
  bookings: {
    type: 'array',
    default: []
  },
  resources: {
    type: 'array',
    default: []
  }
};

// Initialize the store
const appData = new Store({ schema });

// Define store functions
const getValue = async key => {
  return await appData.get(key);
};

const setValue = async (key, value) => {
  appData.set(key, value);
  return await appData.store;
};

const getStore = async () => {
  return await appData.store;
};

const getVersion = () =>
  new Promise((res, reject) => {
    ipcRenderer.send('app_version');
    ipcRenderer.on('app_version', (event, arg) => {
      ipcRenderer.removeAllListeners('app_version');
      res(arg.version);
    });
  });

// UPDATE Events
const updateEvents = new EventEmitter();

ipcRenderer.on('foo', (event, arg) => {
  ipcRenderer.removeAllListeners('foo');

  console.log('update_available - dummy');
  updateEvents.emit('update_available');
});

ipcRenderer.on('update_available', () => {
  ipcRenderer.removeAllListeners('update_available');
  updateEvents.emit('update_available');
});

ipcRenderer.on('update_downloaded', () => {
  ipcRenderer.removeAllListeners('update_downloaded');
  updateEvents.emit('update_downloaded');
});

// Application Function-wrappers
const restartApp = () => {
  ipcRenderer.send('restart_app');
};

// Compile all custom code to the window:
window.appData = {
  getValue,
  setValue,
  getStore,
  getVersion,
  updateEvents,
  restartApp
};
