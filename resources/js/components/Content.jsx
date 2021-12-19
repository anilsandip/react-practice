import React, {useEffect} from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import {History} from "@shopify/app-bridge/actions";
import {routes as AppRoutes, INDEX} from "../routes/route";

function Content(){
    const location = useLocation();
    let history = History.create(window.shopify_app_bridge);

    useEffect(() => {
        history.dispatch(History.Action.PUSH, location.pathname === INDEX ? '/products' : location.pathname)
    }, [location.pathname]);

    const prepareRoutes = (route, index) => {
        let preparedRoute = <Route exact path={route.path} key={index} element={<route.page.component />} />;
        if(route.children) {
            let children = [];
            route.children.map((r,i) => {
                 children.push(prepareRoutes(r, `${index}.${i}`));
            });
            preparedRoute = <Route exact path={route.path} key={index} element={<route.page.component />} >{children}</Route>;
        }
        return preparedRoute;
    }

    return (
        <div className="Content-Div-Padding-Top">
            <Routes>
                {AppRoutes.map((route,index) => {
                    return prepareRoutes(route, index);
                })}
            </Routes>
        </div>
    );
}

export default Content;
