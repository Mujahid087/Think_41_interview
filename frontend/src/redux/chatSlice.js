import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    loading: false,
    input: '',
    sessionId: null,
    userId: 'user123',
    sessionList: [],
  },
  reducers: {
    setInput(state, action) {
      state.input = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
    },
    setSessionId(state, action) {
      state.sessionId = action.payload;
    },
    setSessionList(state, action) {
      state.sessionList = action.payload;
    },
  },
});

export const {
  setInput,
  addMessage,
  setMessages,
  setLoading,
  clearMessages,
  setSessionId,
  setSessionList,
} = chatSlice.actions;

export default chatSlice.reducer;
