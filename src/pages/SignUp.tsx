import React, { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppInner';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
// import DismissKeyboardView from '../components/DismissKeyboardView';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignUp({navigation}: SignUpScreenProps) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef<TextInput | null>(null);
    const nameRef = useRef<TextInput | null>(null);
    const passwordRef = useRef<TextInput | null>(null);
    

    console.log(email)

    console.log(Config.API_URL)

    const onChangeEmail = useCallback((text: string) => {
        setEmail(text.trim());
    }, []);
    const onChangeName = useCallback((text: string) => {
        setName(text.trim());
    }, []);
    const onChangePassword = useCallback((text: string) => {
        setPassword(text.trim());
    }, []);
    const onSubmit = useCallback(async () => {
        if (!email || !email.trim()) {
            return Alert.alert('알림', '이메일을 입력해주세요.');
        }
        if (!name || !name.trim()) {
            return Alert.alert('알림', '이름을 입력해주세요.');
        }
        if (!password || !password.trim()) {
            return Alert.alert('알림', '비밀번호를 입력해주세요.');
        }
        if (
            !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
                email,
            )
        ) {
            return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.');
        }
        if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
            return Alert.alert(
                '알림',
                '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
            );
        }
        console.log(email, name, password);
        try {
            setLoading(true)
            console.log(Config.API_URL)
            const response = await axios.post(`${Config.API_URL}/user`, { email, name, password })
            console.log(response)
            Alert.alert('알림', '회원가입이 완료되었습니다.');
            navigation.navigate('SignIn');
            
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response) {
                Alert.alert('알림', axiosError.response.data.message);
            } else {
                Alert.alert('알림', '알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false)
        }

        Alert.alert('알림', '회원가입 되었습니다.');
    }, [email, name, password]);

    const canGoNext = email && name && password;
    return (
        <KeyboardAvoidingView behavior='position'>
            <View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>이메일</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={onChangeEmail}
                        placeholder="이메일을 입력해주세요"
                        placeholderTextColor="#666"
                        textContentType="emailAddress"
                        value={email}
                        returnKeyType="next"
                        clearButtonMode="while-editing"
                        ref={emailRef}
                        onSubmitEditing={() => nameRef.current?.focus()}
                        blurOnSubmit={false}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>이름</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="이름을 입력해주세요."
                        placeholderTextColor="#666"
                        onChangeText={onChangeName}
                        value={name}
                        textContentType="name"
                        returnKeyType="next"
                        clearButtonMode="while-editing"
                        ref={nameRef}
                        onSubmitEditing={() => passwordRef.current?.focus()}
                        blurOnSubmit={false}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>비밀번호</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="비밀번호를 입력해주세요(영문,숫자,특수문자)"
                        placeholderTextColor="#666"
                        onChangeText={onChangePassword}
                        value={password}
                        keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
                        textContentType="password"
                        secureTextEntry
                        returnKeyType="send"
                        clearButtonMode="while-editing"
                        ref={passwordRef}
                        onSubmitEditing={onSubmit}
                    />
                </View>

                <View style={styles.buttonZone}>
                    <Pressable
                        style={
                            canGoNext
                                ? StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
                                : styles.loginButton
                        }
                        disabled={!canGoNext || loading}
                        onPress={onSubmit}>
                        {
                            loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.loginButtonText}>회원가입</Text>
                            )
                        }
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    textInput: {
        padding: 5,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    inputWrapper: {
        padding: 20,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 20,
    },
    buttonZone: {
        alignItems: 'center',
    },
    loginButton: {
        backgroundColor: 'gray',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    loginButtonActive: {
        backgroundColor: 'blue',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default SignUp;