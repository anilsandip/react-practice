import React from "react";
import {Card, List, Page} from "@shopify/polaris";

function Create() {
    return (
        <>
            <Page fullWidth title="Create Product">
                <Card primaryFooterAction={{content: 'Create'}}>
                    <Card.Section title="Items">
                        <List>
                            <List.Item>1 × Oasis Glass, 4-Pack</List.Item>
                            <List.Item>1 × Anubis Cup, 2-Pack</List.Item>
                        </List>
                    </Card.Section>
                </Card>
            </Page>
        </>
    );
}
export default Create;
