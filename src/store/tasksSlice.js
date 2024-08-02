import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      if (action.payload.parentId) {
        const parentTask = state.find(task => task.id === action.payload.parentId);
        if (parentTask) {
          if (!parentTask.subtasks) parentTask.subtasks = [];
          parentTask.subtasks.push(action.payload);
        }
      } else {
        state.push(action.payload);
      }
    },
    updateTask: (state, action) => {
      const updateTaskRecursive = (tasks) => {
        return tasks.map(task => {
          if (task.id === action.payload.id) {
            return { ...task, ...action.payload };
          }
          if (task.subtasks) {
            return { ...task, subtasks: updateTaskRecursive(task.subtasks) };
          }
          return task;
        });
      };
      return updateTaskRecursive(state);
    },
    deleteTask: (state, action) => {
      const deleteTaskRecursive = (tasks) => {
        return tasks.filter(task => {
          if (task.id === action.payload) return false;
          if (task.subtasks) {
            task.subtasks = deleteTaskRecursive(task.subtasks);
          }
          return true;
        });
      };
      return deleteTaskRecursive(state);
    },
    toggleTaskCollapse: (state, action) => {
      const toggleCollapseRecursive = (tasks) => {
        return tasks.map(task => {
          if (task.id === action.payload) {
            return { ...task, collapsed: !task.collapsed };
          }
          if (task.subtasks) {
            return { ...task, subtasks: toggleCollapseRecursive(task.subtasks) };
          }
          return task;
        });
      };
      return toggleCollapseRecursive(state);
    },
  },
});

export const { addTask, updateTask, deleteTask, toggleTaskCollapse } = tasksSlice.actions;
export default tasksSlice.reducer;