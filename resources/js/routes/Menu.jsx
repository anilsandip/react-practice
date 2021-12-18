import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Stack } from "@shopify/polaris";

const Menu = (props) => {
    const INDEX = '/';
    const PRODUCTS = '/products';
    const CREATE_PRODUCT = '/products/create';
    const SHOW_PRODUCT = '/products/:id';
    const TEST = '/test';

    const menu = [
        {
            paths: [INDEX],
            path: INDEX,
            exact: true,
            title: 'Home'
        },
        {
            paths: [PRODUCTS, CREATE_PRODUCT, SHOW_PRODUCT],
            path: PRODUCTS,
            exact: true,
            title: 'Products'
        },
        {
            paths: [TEST],
            path: TEST,
            exact: true,
            title: 'Test'
        },
    ];

    const location = useLocation();
    const currentRoute = menu.find((route) => {
        return route.paths.includes(location.pathname)
    });

    return(
        <div className="Menu">
            <div className={`Polaris-Card Remove_Card_Border_Radius Tabs`}>
                <div className="Polaris-Tabs__Wrapper">
                    <Stack>
                        <Stack.Item fill>
                            <ul role="tablist" className="Polaris-Tabs Padding-Left--20px">
                                { menu.map((route,i) => {
                                    return <li className="Polaris-Tabs__TabContainer" key={i}>
                                        <Link to={route.path}>
                                            <button role="tab" type="button"
                                                    className={`Polaris-Tabs__Tab ${currentRoute && route.paths.includes(currentRoute.path) ? 'Polaris-Tabs__Tab--selected' : ""}`}>
                                            <span className="Polaris-Tabs__Title Polaris-Tabs--newDesignLanguage">
                                                {route.title}
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
