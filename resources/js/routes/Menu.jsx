import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { History } from "@shopify/app-bridge/actions";
import {routes as AppRoutes} from "../routes/route";
import { Stack } from "@shopify/polaris";

const Menu = (props) => {

    const location = useLocation();
    const currentRoute = AppRoutes.find((route) => {
        return location.pathname === route.path
    });

    let history = History.create(window.shopify_app_bridge);

    useEffect(() => {
        history.dispatch(History.Action.PUSH, location.pathname)
    }, [location.pathname]);

    return(
        <div className="Menu">
            <div className={`Polaris-Card Remove_Card_Border_Radius Tabs`}>
                <div className="Polaris-Tabs__Wrapper">
                    <Stack>
                        <Stack.Item fill>
                            <ul role="tablist" className="Polaris-Tabs Padding-Left--20px">
                                { AppRoutes.map((route,i) => {
                                    return <li className="Polaris-Tabs__TabContainer" key={i}>
                                        <Link to={route.path}>
                                            <button role="tab" type="button"
                                                    className={`Polaris-Tabs__Tab ${currentRoute.path === route.path ? 'Polaris-Tabs__Tab--selected' : ""}`}>
                                            <span className="Polaris-Tabs__Title Polaris-Tabs--newDesignLanguage">
                                                {route.page.title}
                                            </span>
                                            </button>
                                        </Link>
                                    </li>
                                })}
                            </ul>
                        </Stack.Item>
                    </Stack>
                </div>
            </div>
        </div>
    );
};

export default Menu;