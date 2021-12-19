import React, {useState, useEffect} from "react";
import {Modal, TextContainer} from "@shopify/polaris"

function ConfirmDialogue({message = '', options = {}, setConfirm}) {
    const [active, setActive] = useState(true);
    const [primaryAction, setPrimaryAction] = useState({});
    const [secondaryActions, setSecondaryActions] = useState([]);

    const agree = () => {
        setActive(false);
        setConfirm(true);
    }

    const close = () => {
        setActive(false);
        setConfirm(false);
    }

    useEffect(() => {
        let action = {
           content: 'Yes',
           destructive: false,
           onAction: agree,
        };
        if(options.primaryAction) {
            action.content = options.primaryAction.content || 'Yes';
            action.destructive = options.primaryAction.destructive || false;
        }
        setPrimaryAction(action);

        action = [
            {
               content: 'No',
               destructive: false,
               onAction: close,
            }
        ];
        if(options.secondaryAction) {
            action[0].content = options.secondaryAction.content || 'No';
            action[0].destructive = options.secondaryAction.destructive || false;
        }
        setSecondaryActions(action);
    }, []);

    return (
        <>
            <Modal
                open={active}
                sectioned
                onClose={close}
                title="Delete"
                primaryAction={primaryAction}
                secondaryActions={secondaryActions}
            >
                <Modal.Section>
                    <TextContainer>
                        <p>
                            {message}
                        </p>
                    </TextContainer>
                </Modal.Section>
            </Modal>
        </>
    );
}
export default ConfirmDialogue;
