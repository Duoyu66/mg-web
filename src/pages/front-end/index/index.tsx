import {Button} from "antd";
import {useNavigate} from "react-router-dom";

const Index = () => {
    const nav = useNavigate();
    const goFrontHome = () => {
        nav('/front/home')
    }
    return (
        <div className="flex flex-col justify-center items-center">
            我是门户
            <Button onClick={goFrontHome}>立即学习</Button>
        </div>
    )
}
export default Index