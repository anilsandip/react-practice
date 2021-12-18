import React, {useEffect} from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import {History} from "@shopify/app-bridge/actions";
import {routes as AppRoutes} from "../routes/route";

function Content(){
    // const currentRoute = JSON.parse(localStorage.getItem('currentRoute'));
    const location = useLocation();
    let history = History.create(window.shopify_app_bridge);

    useEffect(() => {
        history.dispatch(History.Action.PUSH, location.pathname)
    }, [location.pathname]);

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
