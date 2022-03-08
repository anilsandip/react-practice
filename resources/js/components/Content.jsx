import React, {useEffect} from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import {History} from "@shopify/app-bridge/actions";
import {routes as AppRoutes, INDEX} from "../routes/route";

function Content(){
    const location = useLocation();
    let history = History.create(window.shopify_app_bridge);

    useEffect(() => {
        let path = location.pathname === INDEX || location.pathname === '' ? '/products' : location.pathname;
        let query = processQuery(location.search);
        if(query.length) {
            path = path + query;
        }
        history.dispatch(History.Action.PUSH, path);
    }, [location]);

    const processQuery = (query) => {
        let queries = query.split('?');
        let preparedQueries = [];
        if(queries.length === 2) {
            queries = queries[1].split('&');
            queries.forEach((param) => {
                let tempParam = param.split('=');
                if(tempParam.length === 2 && !(tempParam[0] === 'host' || tempParam[0] === 'token')) {
                    preparedQueries.push(param);
                }
            })
        }
        if(preparedQueries.length) {
            preparedQueries = preparedQueries.join('&');
            preparedQueries = `?${preparedQueries}`;
        }
        return preparedQueries;
    }

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
