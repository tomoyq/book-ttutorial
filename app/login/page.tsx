'use client'

import {
    createTheme,
    Box,
    Button,
    Container,
    CssBaseline,
    TextField,
    ThemeProvider,
    Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import axios from '../../plugins/axios';
import { useState } from 'react';

type FormData = {
    username: string,
    password: string,
};

export default function Page() {
    const {
        control,
        handleSubmit,
    } = useForm();
    const router = useRouter();

    const [authError, setAuthError] = useState("");

    //検証ルール
    const validationRules = {
        username: {
            required: "入力必須項目です",
        },
        password: {
            required: "入力必須項目です",
            minLength: {value: 5, message: '5文字以上の文字列にしてください'}
        },
    }

    const defaultTheme = createTheme();

    const onSubmit = (event: any): void => {
        const data: FormData = {
            username: event.username,
            password: event.password,
        };

        handleLogin(data);
    };

    const handleLogin = (data: FormData) => {
        axios.post("/api/inventory/login/", data)
        .then((res) => {
            router.push("/inventry/products/");
        })
        .catch(function (error) {
            setAuthError("ユーザー名またはパスワードに誤りがあります。")
        });
        
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component='main'>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component='h1' variant='h5'>
                        ログイン
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        {authError && (
                            <Typography variant='body2' color='error'>
                                {authError}
                            </Typography>
                        )}{" "}
                        <Controller
                            name='username'
                            control={control}
                            rules={validationRules.username}
                            render={({field, fieldState}) => (
                                <TextField
                                    {...field}
                                    type='text'
                                    label='ユーザー名(必須)'
                                    variant='filled'
                                    fullWidth
                                    margin='normal'
                                    error={fieldState.invalid}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                        <Controller
                            name='password'
                            control={control}
                            rules={validationRules.password}
                            render={({field, fieldState}) => (
                                <TextField
                                    {...field}
                                    type='password'
                                    label='パスワード(必須)'
                                    variant='filled'
                                    autoComplete='current-password'
                                    fullWidth
                                    margin='normal'
                                    error={fieldState.invalid}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                        <Button
                            variant='contained'
                            type='submit'
                            fullWidth
                            sx={{mt: 3, mb: 2}}
                        >
                            ログイン
                        </Button>
                    </Box> 
                </Box>
            </Container>
        </ThemeProvider>
    )
}