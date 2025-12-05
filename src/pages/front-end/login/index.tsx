import {Button, Form, Input} from 'antd';
import {useNavigate} from "react-router-dom";
// 建议把登录插画图放到本地，比如 src/assets/login-illustration.png
// 然后把下面的 import 路径改成你自己的
// import loginIllustration from '@/assets/login-illustration.png';

const Login = () => {
    const navigate = useNavigate();
    const onFinish = (values: { username: string; password: string }) => {
        // 这里先简单打印，后面你接后端接口即可
        console.log('Login submit:', values);
    };
    const goIndex = () => {
        navigate('/');
    }
    return (
        <div
            className="w-[100vw] h-[100vh] flex items-center justify-center bg-cover bg-center"

        >
            {/* 半透明遮罩，略微压暗背景 */}
            <div className="absolute inset-0 bg-black/25 pointer-events-none"/>

            {/* 中间容器 */}
            <div
                className="relative z-10 flex rounded-[24px] overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,0.18)] bg-white min-h-[420px]">
                {/* 左侧插画区域（整块图片，不要纯蓝色） */}
                <div className="w-[460px] min-h-[420px] overflow-hidden">
                    <img
                        // 如果你有本地图，把这一行改成 src={loginIllustration}
                        src="https://img.zcool.cn/community/01b5d356ddf3dd0000018c1be9f90f.jpg@1280w_1l_2o_100sh.jpg"
                        alt="login-illustration"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* 右侧登录表单 */}
                <div className="w-[420px] min-h-[420px] bg-white/96 px-14 py-10 flex flex-col">
                    {/* 顶部 Logo + 标题，可按你项目替换 */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-semibold tracking-wide text-[#1890ff]">
                                木瓜编程
                            </span>
                            <span className="text-sm text-gray-400">灵感 学习</span>
                        </div>
                        <div className="text-2xl font-semibold text-gray-800">登录</div>
                        <div className="mt-1 text-[13px] text-gray-400">
                            没有账号？
                            <span className="text-[#1890ff] cursor-pointer hover:underline">
                                立即注册
                            </span>
                        </div>
                    </div>

                    {/* 表单 */}
                    <Form layout="vertical" onFinish={onFinish} className="flex-1 flex flex-col justify-between">
                        <div>
                            <Form.Item
                                label="用户名/邮箱"
                                name="username"
                                rules={[{required: true, message: '请输入用户名或邮箱'}]}
                            >
                                <Input
                                    size="large"
                                    placeholder="请输入用户名或邮箱"
                                    className="!border !border-solid !border-gray-300 !rounded-lg !bg-white hover:!border-[#1890ff] focus:!border-[#1890ff] !shadow-none"
                                />
                            </Form.Item>

                            <Form.Item
                                label="登录密码"
                                name="password"
                                rules={[{required: true, message: '请输入密码'}]}
                            >
                                <Input.Password
                                    size="large"
                                    placeholder="请输入密码"
                                    className="!border !border-solid !border-gray-300 !rounded-lg !bg-white hover:!border-[#1890ff] focus:!border-[#1890ff] !shadow-none"
                                />
                            </Form.Item>

                            <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                                <span className="cursor-pointer hover:text-[#1890ff]">
                                    修改密码
                                </span>
                                <span className="cursor-pointer hover:text-[#1890ff]">
                                    免密登录
                                </span>
                            </div>
                        </div>

                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                className="w-full rounded-full !bg-[#1677ff] !border-[#1677ff] hover:!bg-[#165dff] hover:!border-[#165dff]"
                                onClick={goIndex}
                            >
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;