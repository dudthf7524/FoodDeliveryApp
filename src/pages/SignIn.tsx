import React, { useCallback, useRef, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { RootStackParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import DismissKeyboardView from "../components/DismissKiyboardView";


type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>
function SignIn( {navigation} : SignInScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef<TextInput | null>(null);
    const passwordRef = useRef<TextInput | null>(null);

    // function onSubmit() {
    //     Alert.alert('알림', '안녕')
    // }

    // function onChangeEmail(text: string) {
    //     setEmail(text);
    // }

    // function onChangePassword(text: string) {
    //     setPassword(text);
    // }

    const canGoNext = email && password



    const onChangeEmail = useCallback((text: string) => {
        setEmail(text.trim())
    }, [])

    const onChangePassword = useCallback((text: string) => {
        setPassword(text.trim())
    }, [])

    const onSubmit = useCallback(() => {
        if (!email || !email.trim()) {
            return Alert.alert('알림', '이메일을 입력해주세요')
        }
        if (!password || !password.trim()) {
            return Alert.alert('알림', '비밀번호를 입력해주세요')
        }

        Alert.alert('알림', '로그인 되었습니다.')

    }, [])

    const toSignUp = useCallback(() => {
        navigation.navigate('SignUp')
    }, [navigation])

    return (
        <DismissKeyboardView>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>이메일</Text>
                <TextInput
                    value={email}
                    placeholder="이메일을 입력해주세요"
                    onChangeText={onChangeEmail}
                    style={styles.textInput}
                    importantForAutofill="yes"
                    autoComplete="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                        passwordRef.current?.focus();
                    }}

                    blurOnSubmit={false}
                    ref={emailRef}
                // clearButtonMode="white-editing" //ios만
                />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>비밀번호</Text>
                <TextInput
                    value={password}
                    placeholder="비밀번호를 입력해주세요"
                    onChangeText={onChangePassword}
                    style={styles.textInput}
                    secureTextEntry
                    importantForAutofill="yes"
                    autoComplete="password"
                    textContentType="password"
                    keyboardType="decimal-pad"
                    ref={passwordRef}
                    onSubmitEditing={onSubmit}
                />
            </View>

            <View style={styles.buttonZone}>
                <Pressable
                    onPress={onSubmit}
                    disabled={!canGoNext}
                    style={!canGoNext
                        ? styles.loginButton
                        // [styles.loginButton, styles.loginButtonActive]
                        : StyleSheet.compose(styles.loginButton, styles.loginButtonActive)}
                >
                    <Text style={styles.loginButtonText}>로그인</Text>
                </Pressable>
                <Pressable onPress={toSignUp}>
                    <Text>회원가입</Text>
                </Pressable>
            </View>
        </DismissKeyboardView>

    )
}

const styles = StyleSheet.create({

    inputWrapper: {
        padding: 20,
    },

    textInput: {
        padding: 5,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 20,
    },

    loginButton: {
        backgroundColor: 'gray',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    loginButtonActive: {
        backgroundColor: 'blue'
    },
    loginButtonText: {
        color: 'white'
    },
    buttonZone: {
        alignItems: 'center',
    }
})

export default SignIn;

