// features/theme/model/themeSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.isDarkMode = !state.isDarkMode;
    },
    setDark(state) {
      state.isDarkMode = true;
    },
    setLight(state) {
      state.isDarkMode = false;
    },
  },
});

export const { toggleTheme, setDark, setLight } = themeSlice.actions;
export default themeSlice.reducer;
