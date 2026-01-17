import axios from 'axios'
import 'nprogress/nprogress.css' // 这个nprogress样式必须引入

const requestClient = axios.create({
    // baseURL:'https://platform-test.auoktalk.com',
    baseURL: '/',
    timeout: 5000
})
//配置请求拦截器
requestClient.interceptors.request.use(config => {
    // 从本地存储获取 token
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config
}, error => {
    // 请求错误时停止进度条
    return Promise.reject(error);
})
//配置相应拦截器
requestClient.interceptors.response.use(res => {
    return res.data
}, (error) => {
    console.log("响应失败", error)
    return Promise.reject(new Error('fail'))
})
export default requestClient
