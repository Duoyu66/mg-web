import {useDispatch} from "react-redux";
import {useState} from "react";
import {message} from "antd";


export let socket :any=null;
export  const initWebsocket = () => {
    const newSocket = new WebSocket('ws://localhost:8082/your-websocket-endpoint');

    newSocket.onopen = () => {
        // message.success('WebSocket 连接成功！');
    };

    newSocket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data); // 解析 JSON 数据
            console.log('收到消息:', data);
            message.success(`收到消息: ${JSON.stringify(data)}`);
        } catch (err) {
            console.error('消息解析失败:', err);
        }
    };

    newSocket.onerror = (error) => {
        console.error('WebSocket 错误:', error);
        message.error('连接发生错误');
    };

    newSocket.onclose = () => {
        console.log('WebSocket 关闭');
        message.warning('连接已关闭');
    };
    socket=newSocket
}