import React from "react";
import { Routes, Route } from "react-router-dom";
import {routes as AppRoutes} from "../routes/route";

function Content(){
    // const currentRoute = JSON.parse(localStorage.getItem('currentRoute'));
    return (
        <div className="Content-Div-Padding-Top">
            <Routes>
                {AppRoutes.map((route,i) => {
                return  <Route exact path={route.path} key={i} element={<route.page.component />} />
            })}
            </Routes>
        </div>
    );
}

export default Content;
