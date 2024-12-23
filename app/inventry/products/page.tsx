'use client'

import React, { use, useEffect, useState } from 'react';
import Link from "next/link"

import productsData from './sample/dummy_products.json'

type ProductData = {
    id: number | null;
    name: string;
    price: number;
    description: string;
};

type InputData = {
    id: string;
    name: string;
    price: string;
    description: string;
}

export default function Page() {
    //読み込みデータ保持
    const [data, setData] = useState<Array<ProductData>>([]);

    useEffect(() => {
        setData(productsData);
    }, [])

    //登録データを保持
    const [input, setInput] = useState<InputData>({
        id: '',
        name: '',
        price: '',
        description: ''
    });
    //登録データの値を更新
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value, name} = event.target;
        setInput({...input, [name]: value});
    };

    //新規登録処理、新規登録行の表示状態を保持
    const [shownNewRow, setShownNewRow] = useState(false);
    const handleShownNewRow = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setShownNewRow(true);
    };
    const handleAddCancel = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setShownNewRow(false);
    };
    const handdleAdd = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        //バックエンドを使用した処理を呼ぶ
        setShownNewRow(false);
    };

    //更新・削除処理、更新・削除行の表示状態を保持
    const [edditingRow, setEdditingRow] = useState(0);
    const handleEditRow = (id: number) => {
        setShownNewRow(false);
        setEdditingRow(id);
        const selectedProduct: ProductData = data.find((v) => v.id === id) as ProductData;
        setInput({
            id: id.toString(),
            name: selectedProduct.name,
            price: selectedProduct.price.toString(),
            description: selectedProduct.description
        });
    };
    const handleEditCancel = (id: number) => {
        setEdditingRow(0);
    };
    const handleEdit = (id: number) => {
        setEdditingRow(0);
    };
    const handleDelete = (id: number) => {
        setEdditingRow(0);
    };

    return(
        <div>
            <h2>商品一覧</h2>
            <button onClick={handleShownNewRow}>商品を追加する</button>
            <table>
                <thead>
                    <tr>
                        <th>商品ID</th>
                        <th>商品名</th>
                        <th>単価</th>
                        <th>説明</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {shownNewRow ? (
                        <tr>
                            <td></td>
                            <td><input type="text" name='name' onChange={handleInput} /></td>
                            <td><input type="number" name='price' onChange={handleInput} /></td>
                            <td><input type="text" name='description' onChange={handleInput} /></td>
                            <td></td>
                            <td><button onClick={handleAddCancel}>キャンセル</button>
                                <button onClick={handdleAdd}>登録する</button>
                            </td>
                        </tr>
                    ) : "" }
                    {data.map((data: any) => (
                        edditingRow === data.id ? (
                            <tr key={data.id}>
                                <td>{data.id}</td>
                                <td><input type="text" name='name' defaultValue={data.name} onChange={handleInput} /></td>
                                <td><input type="number" name='price' defaultValue={data.price} onChange={handleInput} /></td>
                                <td><input type="text" name='description' defaultValue={data.description} onChange={handleInput} /></td>
                                <td></td>
                                <td><button onClick={() => handleEditCancel(data.id)}>キャンセル</button>
                                    <button onClick={() => handleEdit(data.id)}>更新する</button>
                                    <button onClick={() => handleDelete(data.id)}>削除する</button>
                                </td>
                            </tr>
                        ) : (
                            <tr key={data.id}>
                                <td>{data.id}</td>
                                <td>{data.name}</td>
                                <td>{data.price}</td>
                                <td>{data.description}</td>
                                <td><Link href={`/inventry/products/${data.id}`}>在庫確認</Link></td>
                                <td>
                                    <button onClick={() => handleEditRow(data.id)}>更新・削除</button>
                                </td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        </div>
    )
}