import {Outlet} from "react-router-dom";
import React from "react";

const Question = () => {
  return (
    <div className="flex flex-col border border-red-500">      <Outlet /></div>
  )
}
export default Question