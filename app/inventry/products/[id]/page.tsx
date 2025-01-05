'use client'

import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
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
import axios from '../../../../plugins/axios';

import changeDateFormat from './functions/date_format'

type ProductData = {
    id: number;
    name: string;
    price: number;
    description: string;
};

type InventoryData = {
    id: number;
    type: number;
    date: string;
    unit: number;
    quantity: number;
    price: number;
    inventory: number;
};

type FormData = {
    product: number;
    quantity: number;
    purchase_date?: string;
    sales_date?: string;
};

export default function Page({params}: {params: {id: number},}) {
    const {
        control,
        handleSubmit,
        reset,
    } = useForm();

    //検証ルール
    const validationRules = {
        quantity: {
            required: "入力必須項目です",
        },
    }

    //読み込みデータを保持
    const [product, setProduct] = useState<ProductData>({id: 0, name: '', price: 0, description: ''});
    const [data, setData] = useState<Array<InventoryData>>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        axios.get(`/api/inventory/products/${params.id}`)
        .then((res) => {
            setProduct(res.data)
        });

        axios.get(`/api/inventory/inventories/${params.id}`)
        .then((res) => {
            const inventoryData: InventoryData[] = [];
            let key: number = 1;
            let inventory: number = 0;

            res.data.forEach((e: InventoryData) => {
                
                const newElement = {
                    id: key++,
                    type: e.type,
                    date: e.date,
                    unit: e.unit,
                    quantity: e.quantity,
                    price: Number(e.unit * e.quantity),
                    //売るときは在庫数から引く
                    inventory: e.type === 1 ? inventory += e.quantity : inventory -= e.quantity,
                };
                inventoryData.unshift(newElement);
            });
            setData(inventoryData);
            
        });
    }, [open]);

    //submit時のactionを分岐させる
    const [action, setAction] = useState<string>('');
    const onSubmit = (event: any): void => {
        //actionによってHTTPメソッドと使用するパラメーターを切り替える
        if (action === "purchase") {
            handlePurchase({
                product: product.id,
                purchase_date: changeDateFormat(new Date()),
                quantity: Number(event.quantity),
            });
        } else if (action === "wholesale") {
            handleWholesale({
                product: product.id,
                sales_date: changeDateFormat(new Date()),
                quantity: Number(event.quantity),
            });
        }
    };

    const handleClose = (event: any, reason: any) => {
        setOpen(false);
    };

    const [severity, setSeverity] = useState<AlertColor>('success');
    const [message, setMessage] = useState('');
    const result = (severity: AlertColor, message: string) => {
        setOpen(true);
        setSeverity(severity);
        setMessage(message);
    };

    //仕入れ時実行
    const handlePurchase = (data: FormData) => {
        axios.post('/api/inventory/purchases/', data)
        .then(() => {
            result('success', '商品を仕入れました');
            reset({
                quantity: '',
            });
        });
    };

    //卸し時実行
    const handleWholesale = (data: FormData) => {
        axios.post('/api/inventory/sales/', data)
        .then(() => {
            result('success', '商品を卸しました');
            reset({
                quantity: '',
            });
        });
    };

    return(
        <>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} >
                <Alert severity={severity}>{message}</Alert>
            </Snackbar>
            <Typography variant='h5'>商品在庫管理</Typography>
            <Typography variant='h6'>在庫処理</Typography>
            <Box 
                component='form'
                onSubmit={handleSubmit(onSubmit)}
            >
                <Typography component='span'>商品名: {product.name}</Typography>
                <Box component='div'>
                <Controller
                    name='quantity'
                    control={control}
                    rules={validationRules.quantity}
                    render={({field, fieldState}) => (
                        <TextField
                            {...field}
                            type='number'
                            label='個数'
                            error={fieldState.invalid}
                            helperText={fieldState.error?.message}
                        />
                    )}
                />
                </Box>
                <Button 
                    variant='outlined'
                    onClick={() => setAction('purchase')}
                    type='submit'
                >
                    商品を仕入れる
                </Button>
                <Button
                    variant='outlined'
                    onClick={() => setAction('wholesale')}
                    type='submit'
                >
                    商品を卸す
                </Button>
            </Box>
            <Typography variant='h6'>在庫履歴</Typography>
            <TableContainer 
                component={Paper}
                sx={{width: "100%"}}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>処理種別</TableCell>
                            <TableCell>処理日時</TableCell>
                            <TableCell>単価</TableCell>
                            <TableCell>数量</TableCell>
                            <TableCell>価格</TableCell>
                            <TableCell>在庫数</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length !== 0 ? data.map((data: InventoryData) => (
                            <TableRow key={data.id}>
                                <TableCell>{data.type}</TableCell>
                                <TableCell>{data.date}</TableCell>
                                <TableCell>{data.unit}</TableCell>
                                <TableCell>{data.quantity}</TableCell>
                                <TableCell>{data.price}</TableCell>
                                <TableCell>{data.inventory}</TableCell>
                            </TableRow>
                        )): <TableRow><TableCell>データはありません。</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}