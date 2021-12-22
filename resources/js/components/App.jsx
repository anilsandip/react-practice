import React from "react";
window.axios = require('axios');
import { AppProvider,  Frame } from "@shopify/polaris";
import {Provider} from "@shopify/app-bridge-react";
import {BrowserRouter as Router} from "react-router-dom";
import Menu from "../routes/Menu";
import Content from "./Content";
import { getSessionToken } from '@shopify/app-bridge-utils';

function App() {
    const config = {
        apiKey : document.getElementById("apiKey").value,
        shopOrigin : document.getElementById("shopOrigin").value,
        host: document.getElementById("shopify_host").value,
        planId : document.getElementById("planId").value,
        forceRedirect : true,
    };

    window.axios.defaults.baseURL = process.env.MIX_APP_URL;
    window.axios.interceptors.request.use((config) => {
        return getSessionToken(window.shopify_app_bridge)
            .then((token) => {
                config.headers["Authorization"] = `Bearer ${token}`;
                return config;
            });
    });

    return (
        <AppProvider
            i18n={{
                Polaris: {
                    Frame: {
                        skipToContent: 'Skip to content',
                    },
                    ContextualSaveBar: {
                        save: 'Save',
                        discard: 'Discard',
                    },
                },
            }}
        >
            <Provider config={config}>
                <Frame>
                    <Router>
                        <div className="App">
                            <Menu />
                            <Content />
                        </div>
                    </Router>
                </Frame>
            </Provider>
        </AppProvider>
    );
}
export default App;
