import { Button, Form, Input, Checkbox, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { User, Lock, ArrowRight, Github, Mail, Globe } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values: { username: string; password: string }) => {
    console.log("Login submit:", values);
    // 模拟登录成功后的跳转
    setTimeout(() => {
      goIndex();
    }, 1000);
  };

  const goIndex = () => {
    navigate("/");
  };

  const goRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f2f5] relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-400/20 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 w-full max-w-[1000px] h-[600px] bg-white rounded-[24px] shadow-2xl flex overflow-hidden m-4"
      >
        {/* 左侧展示区 */}
        <div className="hidden lg:flex w-[45%] bg-[#1677ff] relative overflow-hidden flex-col justify-between p-12 text-white">
          <div className="z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">木瓜编程</span>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              探索编程的
              <br />
              无限可能
            </h2>
            <p className="text-blue-100 text-lg opacity-90">
              加入我们，开启你的技术成长之旅。在这里，灵感与知识碰撞。
            </p>
          </div>

          {/* 装饰圆圈 */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />

          <div className="z-10 flex gap-4 text-sm text-blue-200">
            <span>© 2024 MG Code</span>
            <span>隐私政策</span>
            <span>服务条款</span>
          </div>
        </div>

        {/* 右侧表单区 */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-white relative">
          <div className="max-w-[400px] mx-auto w-full">
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h1>
              <p className="text-gray-500">
                请输入您的账号密码进行登录
              </p>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
              className="space-y-4"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: "请输入用户名/邮箱" }]}
              >
                <Input
                  prefix={<User className="w-5 h-5 text-gray-400 mr-2" />}
                  placeholder="用户名 / 邮箱"
                  className="!h-12 !rounded-xl !bg-gray-50 !border-gray-200 hover:!bg-white focus:!bg-white transition-all duration-300"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password
                  prefix={<Lock className="w-5 h-5 text-gray-400 mr-2" />}
                  placeholder="密码"
                  className="!h-12 !rounded-xl !bg-gray-50 !border-gray-200 hover:!bg-white focus:!bg-white transition-all duration-300"
                />
              </Form.Item>

              <div className="flex items-center justify-between mb-6">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-gray-500">记住我</Checkbox>
                </Form.Item>
                <a className="text-[#1677ff] hover:text-[#165dff] font-medium text-sm cursor-pointer">
                  忘记密码？
                </a>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !h-12 !rounded-xl !text-lg !font-medium !bg-[#1677ff] hover:!bg-[#165dff] shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <span className="flex items-center justify-center gap-2">
                    登录
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              </Form.Item>
            </Form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">其他方式登录</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:border-gray-200 transition-all text-gray-600">
                <Github className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:border-gray-200 transition-all text-gray-600">
                <Mail className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              还没有账号？
              <span 
                onClick={goRegister}
                className="text-[#1677ff] font-medium cursor-pointer hover:underline ml-1"
              >
                立即注册
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
