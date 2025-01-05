import axios from "axios";
const axios_instance = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    baseURL: "http://localhost:8000",
    withCredentials: true,
});

axios_instance.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axios_instance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        const originalConfig = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            !originalConfig.retry
        ) {
            //認証エラーの場合はリフレッシュトークンを使ってリトライ
            originalConfig.retry = true;
            //以下の場合はリトライしない
            //ログイン処理の場合
            if (originalConfig.url === '/api/inventory/login/') {
                return Promise.reject(error);
            }

            axios_instance
            .post('/api/inventory/retry/', { refresh: "" })
            .then((res) => {
                return axios_instance(originalConfig);
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
        } else if (error.response && error.response.status !== 422) {
            //認証エラーまたは業務エラー以外の場合は適切な画面に遷移
            window.location.href = '/login/'; 
        } else {
            return Promise.reject(error);
        }
    }
);

export default axios_instance;