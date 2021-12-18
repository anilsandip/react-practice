import React from "react";
import { AppProvider,  Frame } from "@shopify/polaris";
import {Provider} from "@shopify/app-bridge-react";
import {BrowserRouter as Router, Link} from "react-router-dom";
import Menu from "../routes/Menu";
import Content from "./Content";

function App() {
    const config = {
        apiKey : document.getElementById("apiKey").value,
        shopOrigin : document.getElementById("shopOrigin").value,
        host: document.getElementById("shopify_host").value,
        planId : document.getElementById("planId").value,
        forceRedirect : true,
    };

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
