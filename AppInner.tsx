import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import Settings from './src/pages/Settings';
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from './src/store/reducer';
import { useEffect } from 'react';
import useSocket from './src/hooks/useSocket';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import userSlice from './src/slices/user';
import { Alert } from 'react-native';
import { useAppDispatch } from './src/store'
import orderSlice from './src/slices/order';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: { orderId: string };
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
  console.log('isLoggedIn', isLoggedIn);

  const [socket, disconnect] = useSocket();

  useEffect(() => {
    const callback = (data: any) => {
      console.log(data);
      dispatch(orderSlice.actions.addOrder(data))
    };
    if (socket && isLoggedIn) {
      console.log(socket);
      socket.emit('acceptOrder', 'hello');
      socket.on('order', callback);
    }
    return () => {
      if (socket) {
        socket.off('order', callback);
      }
    };
  }, [isLoggedIn, socket]);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn);
      disconnect();
    }
  }, [dispatch, isLoggedIn, disconnect]);

  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          return;
        }
        const response = await axios.post(
          `${Config.API_URL}/refreshToken`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        );
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const code = error.response?.data?.code;

          if (code === 'expired') {
            Alert.alert('알림', '다시 로그인 해주세요.');
          } else {
            console.log('다른 코드:', code);
          }
        } else {
          console.error('AxiosError가 아님:', error);
        }
      } finally {
        // TODO: 스플래시 스크린 없애기
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);


  return isLoggedIn ? (
    <Tab.Navigator>
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{ title: '오더 목록' }}
      />
      <Tab.Screen
        name="Delivery"
        component={Delivery}
        options={{ title: '내 오더' }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{ title: '내 정보' }}
      />
    </Tab.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ title: '로그인' }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ title: '회원가입' }}
      />
    </Stack.Navigator>
  );
}

export default AppInner;