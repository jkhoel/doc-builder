/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import PropTypes from 'prop-types';
import moment from 'moment'

// const ipcRenderer = window.require('electron').ipcRenderer;


// Important! This is the default store object, and must match the default schema set in electron.js
const defaultStore = {
  filter: [],
  startDate: "2019-01-01 00:00",
  endDate: "2019-12-31 24:00",
  timestamp: null,
  bookings: [],
  resources: [],
}

export const StoreContext = React.createContext({
  filter: [],
  startDate: "2019-01-01 00:00",
  endDate: "2019-12-31 24:00",
  timestamp: 0,
  bookings: [],
  resources: [],
  getStoreData: () => null,
  updateStoreData: () => null
})

export const StoreConsumer = StoreContext.Consumer;

export function StoreProvider({ children }) {
  const [store, setStore] = React.useState(defaultStore)

  React.useEffect(() => {
    getStoreData()
  }, []);

  const compareObjectKeys = (a, b) => {
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
  }

  const getStoreData = () => {
    console.log('STORE - getStoreData()')

    window.appData.getStore().then(appData => {
      // If the store-object contains the same keys as our defaultStore object - set our store state to that data
      if (compareObjectKeys(defaultStore, appData)) {
        setStore((prevState) => ({ ...prevState, ...appData }));
      } else {
        // ... if it is not, we need to initialize our default store
        setStore(defaultStore)
      }
    })


  }

  const updateStoreData = (key, value) => {
    console.log('STORE - updateStoreData()')

    // window.appData.getStore().then(res => console.log('yolo! ', res))
    window.appData.setValue(key, value).then(() => {
      getStoreData()
    })


    // ipcRenderer
    //   .invoke('store-set-value', key, value)
    //   .then(() => {
    //     getStoreData()
    //   });
  }

  const updateTimestamp = () => {
    updateStoreData('timestamp', parseInt(moment().format('X')))
  }

  return (
    <StoreContext.Provider value={{
      filter: store.filter,
      startDate: store.startDate,
      endDate: store.endDate,
      timestamp: store.timestamp,
      bookings: store.bookings,
      resources: store.resources,
      getStoreData,
      updateStoreData,
      updateTimestamp
    }}>
      {children}
    </StoreContext.Provider>
  )
}

StoreContext.propTypes = {
  children: PropTypes.any,
};

StoreContext.defaultProps = {
  children: {},
};