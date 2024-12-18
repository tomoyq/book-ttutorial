'use client'

import { useEffect } from "react";

export default function Page() {
    let data = {name: '初期値'};

    //初回レンダリングが終わってから変数に代入している
    //再レンダリングは行われないため画面上の文字も変わらない
    useEffect(() => {
        const change = {name: '変更'};
        data = change;
    }, []);

    return (
        <div>
            hello {data.name}
        </div>
    );
};
