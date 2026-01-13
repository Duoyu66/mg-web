import React from 'react';
import { Result, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

interface Props {
    title: string;
}

const AdminGenericPage: React.FC<Props> = ({ title }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
        <h2>{title} 管理</h2>
        <Result
            icon={<SmileOutlined />}
            title={`${title} 功能开发中`}
            subTitle="该模块正在建设中，敬请期待。"
            extra={<Button type="primary">返回控制台</Button>}
        />
    </div>
  );
};

export default AdminGenericPage;
