import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    loading: false,
    input: '',
  },
  reducers: {
    setInput(state, action) {
      state.input = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const { setInput, addMessage, setLoading, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
