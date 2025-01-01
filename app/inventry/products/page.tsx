'use client'

import React, { useEffect, useState } from 'react';
import Link from "next/link"

import { useForm, Controller } from 'react-hook-form';
import {
    Alert,
    AlertColor,
    Box,
    Button,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material"
import {Add as AddIcon, Cancel as CancelIcon, Update as UpdateIcon, Delete as DeleteIcon} from "@mui/icons-material"
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8000';

type ProductData = {
    id: number | null;
    name: string;
    price: number;
    description: string;
};

export default function Page() {
    const {
        control,
        handleSubmit,
        reset,
    } = useForm()

    //検証ルール
    const validationRules = {
        name: {
            required: "入力必須項目です",
            maxLength: {value: 100, message: "100文字以内の商品名を入力してください"}
        },
        price: {
            required: "入力必須項目です",
            min: {value: 1, message: "1から99999999の数値を入力してください"},
            max: {value: 99999999, message: "1から99999999の数値を入力してください"}
        },
        description: {
            required: "入力必須項目です"
        }
    }
 
    //読み込みデータ保持
    const [data, setData] = useState<Array<ProductData>>([]);
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState<AlertColor>('success');
    const [message, setMessage] = useState('');
    const result = (severity: AlertColor, message: string) => {
        setOpen(true);
        setSeverity(severity);
        setMessage(message);
    };

    const handleClose = (event: any, reason: any) => {
        setOpen(false);
    };

    useEffect(() => {
        axios.get('/api/inventory/products/',
            //これを必ず入れる
            {withCredentials: true,}
        )
        .then((res) => res.data)
        .then((data) => {
            setData(data);
        })
    }, [open]);

    const [id, setId] = useState<number | null>(0);
    //submit時のactionを分岐させる
    const [action, setAction] = useState<string>('');
    const onSubmit = (event: any): void => {
        const data: ProductData = {
            id: id,
            name: event.name,
            price: Number(event.price),
            description: event.description,
        };
        console.log(data)
        //actionによってHTTPメソッドと使用するパラメーターを切り替える
        if (action === "add") {
            handleAdd(data);
        } else if (action === "update") {
            if (data.id === null){
                return;
            }
            handleEdit(data);
        } else if (action === "delete") {
            if (data.id === null) {
                return;
            }
            handleDelete(data.id);
        }
    };

    //新規登録処理、新規登録行の表示状態を保持
    const handleShownNewRow = () => {
        setId(null);
        reset({
            name: "",
            price: "0",
            description: "",
        });
    };
    const handleAddCancel = () => {
        setId(0);
    };
    const handleAdd = (data: ProductData) => {
        result('success', '商品が登録されました');
        setId(0);
    };

    //更新・削除処理、更新・削除行の表示状態を保持
    const handleEditRow = (id: number | null) => {
        const selectedProduct: ProductData = data.find((v) => v.id === id) as ProductData;
        setId(selectedProduct.id);
        reset({
            name: selectedProduct.name,
            price: selectedProduct.price,
            description: selectedProduct.description,
        });
    };
    const handleEditCancel = () => {
        setId(0);
    };
    const handleEdit = (data: ProductData) => {
        result('success', '商品が更新されました');
        setId(0);
    };
    const handleDelete = (id: number) => {
        result('success', '商品が削除されました');
        setId(0);
    };

    return(
        <>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert severity={severity}>{message}</Alert>
            </Snackbar>
            <Typography variant='h5'>商品一覧</Typography>
            <Button
                variant='contained'
                startIcon={<AddIcon />}
                onClick={() => handleShownNewRow()}
            >
                商品を追加する
            </Button>
            <Box 
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{height: 400, width: "100%"}}    
            >
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>商品ID</TableCell>
                                <TableCell>商品名</TableCell>
                                <TableCell>単価</TableCell>
                                <TableCell>説明</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {id === null ? (
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>
                                        <Controller
                                            name='name'
                                            control={control}
                                            rules={validationRules.name}
                                            render={({field, fieldState}) => (
                                                <TextField
                                                    {...field}
                                                    type='text'
                                                    label='商品名'
                                                    error={fieldState.invalid}
                                                    helperText={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Controller
                                            name='price'
                                            control={control}
                                            rules={validationRules.price}
                                            render={({field, fieldState}) => (
                                                <TextField
                                                    {...field}
                                                    type='number'
                                                    label='価格'
                                                    error={fieldState.invalid}
                                                    helperText={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Controller
                                            name='description'
                                            control={control}
                                            rules={validationRules.description}
                                            render={({field, fieldState}) => (
                                                <TextField
                                                    {...field}
                                                    type='text'
                                                    label='商品説明'
                                                    error={fieldState.invalid}
                                                    helperText={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    {/* ルーティングのために追加 */}
                                    <TableCell></TableCell>
                                    <TableCell>
                                        <Button 
                                            variant='outlined'
                                            startIcon={<CancelIcon/>}
                                            onClick={() => handleAddCancel()}
                                        >
                                            キャンセル
                                        </Button>
                                        <Button 
                                            variant='outlined'
                                            startIcon={<AddIcon />}
                                            onClick={() => setAction("add")}
                                            type='submit'
                                        >
                                            登録する
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ) : "" }
                            {data.map((data: any) => (
                                id === data.id ? (
                                    <TableRow key={data.id}>
                                        <TableCell>{data.id}</TableCell>
                                        <TableCell>
                                            <Controller
                                                name='name'
                                                control={control}
                                                rules={validationRules.name}
                                                render={({field, fieldState}) => (
                                                    <TextField
                                                        {...field}
                                                        type='text'
                                                        label='商品名'
                                                        error={fieldState.invalid}
                                                        helperText={fieldState.error?.message}
                                                        value={data.name}
                                                    />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Controller
                                                name='price'
                                                control={control}
                                                rules={validationRules.price}
                                                render={({field, fieldState}) => (
                                                    <TextField
                                                        {...field}
                                                        type='number'
                                                        label='価格'
                                                        error={fieldState.invalid}
                                                        helperText={fieldState.error?.message}
                                                        value={data.price}
                                                    />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Controller
                                                name='description'
                                                control={control}
                                                rules={validationRules.description}
                                                render={({field, fieldState}) => (
                                                    <TextField
                                                        {...field}
                                                        type='text'
                                                        label='商品説明'
                                                        error={fieldState.invalid}
                                                        helperText={fieldState.error?.message}
                                                        value={data.description}
                                                    />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>
                                            <Button 
                                                variant='outlined'
                                                startIcon={<CancelIcon/>}
                                                onClick={() => handleEditCancel()}
                                            >
                                                キャンセル
                                            </Button>
                                            <Button
                                                variant='outlined'
                                                startIcon={<UpdateIcon />}
                                                onClick={() => setAction("update")}
                                                type='submit'
                                            >
                                                更新する
                                            </Button>
                                            <Button
                                                variant='outlined'
                                                startIcon={<DeleteIcon />}
                                                onClick={() => setAction("delete")}
                                                type='submit'
                                            >
                                                削除する
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow key={data.id}>
                                        <TableCell>{data.id}</TableCell>
                                        <TableCell>{data.name}</TableCell>
                                        <TableCell>{data.price}</TableCell>
                                        <TableCell>{data.description}</TableCell>
                                        <TableCell><Link href={`/inventry/products/${data.id}`}>在庫確認</Link></TableCell>
                                        <TableCell>
                                            <Button 
                                                variant='outlined'
                                                startIcon={<UpdateIcon />}
                                                onClick={() => handleEditRow(data.id)}
                                            >
                                                更新・削除
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}