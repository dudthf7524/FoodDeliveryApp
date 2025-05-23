import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// action : state로 바꾸는 행위/동작
// dispatch : 그 액션을 실제로 실행하는 함수
// reducer : 액션이 실제로 실행되면 state를 바꾸는 로직 


const initialState = {
  name: '',
  email: '',
  accessToken: '',
  money: 0,
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken;
    },
    setMoney(state, action: PayloadAction<number>) {
      state.money = action.payload;
    },
  },
  extraReducers: builder => { },
});

export default userSlice;