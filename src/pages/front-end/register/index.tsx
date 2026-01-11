import { Button, Form, Input, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { User, Lock, ArrowRight, Github, Mail, Globe, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Register submit:", values);
    // 模拟注册成功后的跳转
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const goLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f2f5] relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-green-400/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-teal-400/20 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 w-full max-w-[1000px] h-[700px] bg-white rounded-[24px] shadow-2xl flex overflow-hidden m-4"
      >
        {/* 左侧展示区 */}
        <div className="hidden lg:flex w-[45%] bg-[#00b96b] relative overflow-hidden flex-col justify-between p-12 text-white">
          <div className="z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">木瓜编程</span>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              加入社区
              <br />
              共创未来
            </h2>
            <p className="text-green-100 text-lg opacity-90">
              创建账号，立即享受海量编程资源，与百万开发者共同进步。
            </p>
          </div>

          {/* 装饰圆圈 */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />

          <div className="z-10 flex gap-4 text-sm text-green-100">
            <span>© 2024 MG Code</span>
            <span>隐私政策</span>
            <span>服务条款</span>
          </div>
        </div>

        {/* 右侧表单区 */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-white relative">
          <div className="max-w-[400px] mx-auto w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">创建账号</h1>
              <p className="text-gray-500">
                请填写以下信息完成注册
              </p>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
              className="space-y-3"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: "请输入用户名" }]}
              >
                <Input
                  prefix={<User className="w-5 h-5 text-gray-400 mr-2" />}
                  placeholder="用户名"
                  className="!h-11 !rounded-xl !bg-gray-50 !border-gray-200 hover:!bg-white focus:!bg-white transition-all duration-300"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "请输入邮箱" },
                  { type: 'email', message: "请输入有效的邮箱地址" }
                ]}
              >
                <Input
                  prefix={<Mail className="w-5 h-5 text-gray-400 mr-2" />}
                  placeholder="邮箱地址"
                  className="!h-11 !rounded-xl !bg-gray-50 !border-gray-200 hover:!bg-white focus:!bg-white transition-all duration-300"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password
                  prefix={<Lock className="w-5 h-5 text-gray-400 mr-2" />}
                  placeholder="设置密码"
                  className="!h-11 !rounded-xl !bg-gray-50 !border-gray-200 hover:!bg-white focus:!bg-white transition-all duration-300"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: "请确认密码" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<ShieldCheck className="w-5 h-5 text-gray-400 mr-2" />}
                  placeholder="确认密码"
                  className="!h-11 !rounded-xl !bg-gray-50 !border-gray-200 hover:!bg-white focus:!bg-white transition-all duration-300"
                />
              </Form.Item>

              <Form.Item name="agreement" valuePropName="checked" rules={[
                { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('请同意服务条款')) }
              ]}>
                <Checkbox className="text-gray-500 text-sm">
                  我已阅读并同意 <span className="text-[#00b96b] cursor-pointer">服务条款</span> 和 <span className="text-[#00b96b] cursor-pointer">隐私政策</span>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !h-11 !rounded-xl !text-lg !font-medium !bg-[#00b96b] hover:!bg-[#009456] shadow-lg shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-0.5 !border-none"
                >
                  <span className="flex items-center justify-center gap-2">
                    立即注册
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              </Form.Item>
            </Form>

            <div className="mt-6 text-center text-sm text-gray-500">
              已有账号？
              <span 
                onClick={goLogin}
                className="text-[#00b96b] font-medium cursor-pointer hover:underline ml-1"
              >
                直接登录
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
