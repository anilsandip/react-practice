import React from "react";
import {Page} from "@shopify/polaris";
import {MobileBackArrowMajor} from "@shopify/polaris-icons";

function Show() {
    return (
        <Page
            fullWidth
            title="Product Details"
            primaryAction={{content: 'Go Back', icon: MobileBackArrowMajor}}
        >
            <p>Wide page content</p>
        </Page>
    );
}
export default Show;
