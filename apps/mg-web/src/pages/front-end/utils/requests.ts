import axios from 'axios'
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入

const requests = axios.create({
    baseURL:'/',
    timeout:5000
})
//配置请求拦截器
requests.interceptors.request.use(config=>{
    NProgress.start();
    // 从本地存储获取 token
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = 'Bearer '+token;
    }
    return config;
}, error => {
    // 请求错误时停止进度条
    NProgress.done();
    return Promise.reject(error);
})
//配置相应拦截器
requests.interceptors.response.use(res=>{
    NProgress.done();
    return res.data
},(error)=>{
    NProgress.done();
    console.log("响应失败",error)
    return Promise.reject(new Error('fail'))
})
export default requests
