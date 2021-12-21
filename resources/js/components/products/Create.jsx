import React, {useState} from "react";
import {Button, Card, Checkbox, Form, FormLayout, List, Page, TextField, Stack, Thumbnail, Caption, DropZone, } from "@shopify/polaris";
import { NoteMinor } from "@shopify/polaris-icons";


function Create() {
    const [title, setTitle] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [description, setDescription] = useState('');
    const [numberOfPages, setNumberOfPages] = useState(null);
    const [price, setPrice] = useState(0);
    const [compareAtPrice, setCompareAtPrice] = useState(0);
    const [wholeSalePrice, setWholeSalePrice] = useState(0);

    const [images, setImages] = useState([]);

    const handleDropZoneDrop = (_dropFiles, acceptedFiles, _rejectedFiles) => setImages((images) => [...images, ...acceptedFiles]);

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const uploadedImages = images.length > 0 && (
        <Stack vertical>
            {images.map((file, index) => (
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

    const handleSubmit = () => {
        let form = {
            title: title,
            authorName: authorName,
            description: description,
            numberOfPages: numberOfPages,
            images: images,
            price: price,
            compareAtPrice: compareAtPrice,
            wholesalePrice: wholeSalePrice,
        }
        console.log('Submitted', form);
        alert('Submitted');
    }

    const handleTitleChange = ((value) => setTitle(value));
    const handleAuthorNameChange = ((value) => setAuthorName(value));
    const handleDescriptionChange = ((value) => setDescription(value));
    const handleNumberOfPagesChange = ((value) => setNumberOfPages(value));
    const handlePriceChange = ((value) => setPrice(value));
    const handleCompareAtPriceChange = ((value) => setCompareAtPrice(value));
    const handleWholeSalePriceChange = ((value) => setWholeSalePrice(value));

    return (
        <>
            <Page fullWidth title="Create Product">
                <Card
                    primaryFooterAction={
                        {
                            content: 'Create',
                            onAction: () => alert('hello')
                        }
                    }
                    sectioned
                >
                    <Form onSubmit={handleSubmit}>
                        <FormLayout>
                            <TextField
                                value={title}
                                onChange={handleTitleChange}
                                label="Title"
                                type="text"
                                autoComplete={title}
                            />
                            <FormLayout.Group>
                                <FormLayout>
                                    <TextField
                                        value={authorName}
                                        onChange={handleAuthorNameChange}
                                        label="Author Name"
                                        type="text"
                                        autoComplete={authorName}
                                    />
                                    <TextField
                                        value={numberOfPages}
                                        onChange={handleNumberOfPagesChange}
                                        label="No. Of Pages"
                                        type="number" autoComplete={numberOfPages}
                                    />
                                </FormLayout>
                                <TextField
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    label="Description"
                                    type="text"
                                    autoComplete={description}
                                    multiline={true}
                                    maxHeight={110}
                                />
                            </FormLayout.Group>
                            <DropZone onDrop={handleDropZoneDrop}>
                                {uploadedImages}
                                {
                                    !images.length &&
                                    <DropZone.FileUpload
                                        actionTitle={'Add file'}
                                        actionHint={'or drop file to upload'}
                                    />
                                }
                            </DropZone>
                            <FormLayout.Group>
                                <TextField
                                    value={price}
                                    onChange={handlePriceChange}
                                    label="Price" type="number"
                                    autoComplete={price}
                                />
                                <TextField
                                    value={compareAtPrice}
                                    onChange={handleCompareAtPriceChange}
                                    label="Compare At Price"
                                    type="number"
                                    autoComplete={compareAtPrice}
                                />
                            </FormLayout.Group>
                            <TextField
                                value={wholeSalePrice}
                                onChange={handleWholeSalePriceChange}
                                label="Wholesale Price"
                                type="number"
                                autoComplete={wholeSalePrice}
                            />
                            <Button submit>Submit</Button>
                        </FormLayout>
                    </Form>
                </Card>
            </Page>
        </>
    );
}
export default Create;
