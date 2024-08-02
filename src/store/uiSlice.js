// src/store/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    currentDate: new Date(),
    view: 'month',
    timelineStart: new Date(),
    timelineEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  },
  reducers: {
    setCurrentDate: (state, action) => {
      state.currentDate = action.payload;
    },
    setView: (state, action) => {
      state.view = action.payload;
    },
    setTimelineRange: (state, action) => {
      state.timelineStart = action.payload.start;
      state.timelineEnd = action.payload.end;
    },
  },
});

export const { setCurrentDate, setView, setTimelineRange } = uiSlice.actions;
export default uiSlice.reducer;