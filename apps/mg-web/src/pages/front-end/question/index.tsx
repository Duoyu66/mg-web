import {Outlet} from "react-router-dom";

const Question = () => {
    return (
        <div className="flex flex-col w-full">
            <Outlet/>
        </div>
    )
}
export default Question