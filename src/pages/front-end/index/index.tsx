import {Button} from "antd";
import {useNavigate} from "react-router-dom";

const Index = () => {
    const nav = useNavigate();
    const goFrontHome = () => {
        nav('/front/home')
    }
    return (<div>
        我是门户
        <Button onClick={goFrontHome}>前台首页</Button>
    </div>)
}
export default Index