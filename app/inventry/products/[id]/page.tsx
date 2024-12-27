'use client'

import { useForm } from 'react-hook-form';
import inventoriesData from '../sample/dummy_inventories.json';
import productsData from '../sample/dummy_products.json';
import { useEffect, useState } from 'react';

import changeDateFormat from './functions/date_format'

type ProductData = {
    id: number;
    name: string;
    price: number;
    description: string;
};

type InventoryData = {
    id: number;
    type: string;
    date: string;
    unit: number;
    quantity: number;
    price: number;
    inventory: number;
};

export default function Page({params}: {params: {id: number},}) {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm();

    //読み込みデータを保持
    const [product, setProduct] = useState<ProductData>({id: 0, name: '', price: 0, description: ''});
    const [data, setData] = useState<Array<InventoryData>>([]);

    useEffect(() => {
        const selectedProduct: ProductData = productsData.find(v => v.id == params.id)?? {
            id: 0,
            name: '',
            price: 0,
            description: '',
        };
        setProduct(selectedProduct);
        setData(inventoriesData);
    }, []);

    //submit時のactionを分岐させる
    const [action, setAction] = useState<string>('');
    const onSubmit = (event: any): void => {
        //actionによってHTTPメソッドと使用するパラメーターを切り替える
        if (action === "purchase") {
            handlePurchase({
                id: product.id,
                type: "仕入れ",
                date: changeDateFormat(new Date()),
                unit: product.price,
                quantity: Number(event.quantity),
                price: product.price * Number(event.quantity),
                inventory: data.slice(-1)[0].inventory + Number(event.quantity),
            });
        } else if (action === "wholesale") {
            handleWholesale({
                id: product.id,
                type: "卸し",
                date: changeDateFormat(new Date()),
                unit: product.price,
                quantity: Number(event.quantity),
                price: product.price * Number(event.quantity),
                inventory: data.slice(-1)[0].inventory - Number(event.quantity),
            });
        }
    };

    //仕入れ時実行
    const handlePurchase = (data: InventoryData) => {
        console.log(data);
        reset({
            quantity: '',
        });
    };

    //卸し時実行
    const handleWholesale = (data: InventoryData) => {
        console.log(data);
        reset({
            quantity: '',
        });
    };

    return(
        <>
            <h2>商品在庫管理</h2>
            <h3>在庫処理</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>商品名:</label>
                    <span>{product.name}</span>
                </div>
                <div>
                    <label>数量:</label>
                    <input type="text" id='quantity' {...register('quantity', {required: true})}/>
                    {errors.quantity && (
                        <div>
                            個数を入力してください
                        </div>
                    )}
                </div>
                <button onClick={() => setAction('purchase')}>商品を仕入れる</button>
                <button onClick={() => setAction('wholesale')}>商品を卸す</button>
            </form>
            <h3>在庫履歴</h3>
            <table>
                <thead>
                    <tr>
                        <th>処理種別</th>
                        <th>処理日時</th>
                        <th>単価</th>
                        <th>数量</th>
                        <th>価格</th>
                        <th>在庫数</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((data: InventoryData) => (
                        <tr key={data.id}>
                            <td>{data.type}</td>
                            <td>{data.date}</td>
                            <td>{data.unit}</td>
                            <td>{data.quantity}</td>
                            <td>{data.price}</td>
                            <td>{data.inventory}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}