import React from "react";
import {AppProvider} from "@shopify/polaris";
// import {Provider} from "@shopify/app-bridge-react";
import { BrowserRouter as Router } from "react-router-dom";
import Menu from "../routes/Menu";
import Content from "./Content";

function App() {
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
            <Router>
                <div className="App">
                    <Menu />
                    <Content />
                </div>
            </Router>
        </AppProvider>
    );
}
export default App;
