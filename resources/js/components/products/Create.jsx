import React, {useCallback, useState} from "react";
import {Button, Card, Checkbox, Form, FormLayout, List, Page, TextField, Stack, Thumbnail, Caption, DropZone, } from "@shopify/polaris";
import { NoteMinor } from "@shopify/polaris-icons";


function Create() {
    const [newsletter, setNewsletter] = useState(false);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [variants, setVariants] = useState([]);

    const [files, setFiles] = useState([]);

    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
            setFiles((files) => [...files, ...acceptedFiles]),
        [],
    );

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const uploadedFiles = files.length > 0 && (
        <Stack vertical>
            {files.map((file, index) => (
                <Stack alignment="center" key={index}>
                    <Thumbnail
                        size="small"
                        alt={file.name}
                        source={
                            validImageTypes.includes(file.type)
                                ? window.URL.createObjectURL(file)
                                : NoteMinor
                        }
                    />
                    <div>
                        {file.name} <Caption>{file.size} bytes</Caption>
                    </div>
                </Stack>
            ))}
        </Stack>
    );

    const createVariant = () => {
        setVariants([[]]);
    }

    const addVariants = (variant, i) => {
        return (
            <>
                <TextField value={title} onChange={handleTitleChange} label="Title" type="text" autoComplete={title}/>
                <TextField value={description} onChange={handleDescriptionChange} label="Description" type="text" autoComplete={description} />
                <DropZone onDrop={handleDropZoneDrop}>
                    {uploadedFiles}
                    {
                        !files.length &&
                        <DropZone.FileUpload actionTitle={'Add file'} actionHint={'or drop file to upload'}/>
                    }
                </DropZone>
            </>
        );
    }
    const handleSubmit = () => {
        alert('Submitted');
    }

    const handleTitleChange = useCallback((value) => setTitle(value), []);
    const handleDescriptionChange = useCallback((value) => setDescription(value), []);

    return (
        <>
            <Page fullWidth title="Create Product">
                <Card primaryFooterAction={{content: 'Create', onAction: createVariant}} sectioned>
                    <Form onSubmit={handleSubmit}>
                        <FormLayout>
                            <TextField value={title} onChange={handleTitleChange} label="Title" type="text" autoComplete={title}/>
                            <TextField value={description} onChange={handleDescriptionChange} label="Description" type="text" autoComplete={description} />
                            <DropZone onDrop={handleDropZoneDrop}>
                                {uploadedFiles}
                                {
                                    !files.length &&
                                    <DropZone.FileUpload actionTitle={'Add file'} actionHint={'or drop file to upload'}/>
                                }
                            </DropZone>
                            { variants.map( (variant, i) => {
                                return addVariants(variant, i);
                            }) }
                            <Button submit>Submit</Button>
                        </FormLayout>
                    </Form>
                </Card>
            </Page>
        </>
    );
}
export default Create;
