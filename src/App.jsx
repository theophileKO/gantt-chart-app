// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import GanttChart from './components/GanttChart';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <GanttChart />
      </div>
    </Provider>
  );
}

export default App;