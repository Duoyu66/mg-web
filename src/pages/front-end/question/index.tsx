import {Outlet} from "react-router-dom";
import React from "react";

const Question = () => {
  return (
    <div className="flex flex-col w-full">
      <Outlet />
    </div>
  )
}
export default Question