import axios from 'axios'
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css' // 这个nprogress样式必须引入

const requestClient = axios.create({
    // baseURL:'https://platform-test.auoktalk.com',
    baseURL: '/',
    timeout: 5000
})
//配置请求拦截器
requestClient.interceptors.request.use(config => {
    NProgress.start();
    // 从本地存储获取 token
    const token = 'KZxl0vLTyJq9o5ywvW24UOb0a7azGL59PA3eNoK2yiubwDdwYGyeM9OGdo0fop91vbbNbwyOCq1gQFnIutVXId2YZFQL0TK+VA4HiF8UhxjaqvSWrzNvOV7rDCdQ4HR03GWGUcu3Y1JYF7KccMMgeN7ySM5TzpNJ8eqkDlOMRQ/5/1tH6ZjOxVHmi+OUUngrrxiW2CR1yTx5cqrlOKSPyWhzGfrm6iOYjm6A7fADOO0l14pMhbYzU3tcbyObelA7'
    sessionStorage.setItem('token', token);
    // config.headers['third-admin-token'] = token
    // config.headers['Authorization'] = 'Bearer'

    return config
}, error => {
    // 请求错误时停止进度条
    NProgress.done();
    return Promise.reject(error);
})
//配置相应拦截器
requestClient.interceptors.response.use(res => {
    NProgress.done();
    return res.data
}, (error) => {
    NProgress.done();
    console.log("响应失败", error)
    return Promise.reject(new Error('fail'))
})
export default requestClient
