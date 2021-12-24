import React, {useEffect, useState} from "react";
import {Button, Card, Checkbox, Form, FormLayout, List, Page, TextField, Stack, Thumbnail, Caption, DropZone} from "@shopify/polaris";
import { NoteMinor, CircleCancelMajor } from "@shopify/polaris-icons";
import {useNavigate, useLocation, useParams} from "react-router-dom";
import {LoaderComponent} from "../common/Loader";


function Create() {
    const [title, setTitle] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [description, setDescription] = useState('');
    const [numberOfPages, setNumberOfPages] = useState(null);
    const [price, setPrice] = useState(0);
    const [compareAtPrice, setCompareAtPrice] = useState(0);
    const [wholeSalePrice, setWholeSalePrice] = useState(0);
    const [product, setProduct] = useState({});

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    useEffect(async () => {
        console.log(id);
        if(/\/products\/[0-9]+\/edit/.test(location.pathname)) {
            console.log(location)
            await getProduct();
            console.log(price);
        }
    }, []);

    const getProduct = async () => {
        try {
            let {data} = await axios.get(`/api/products/${id}`);
            await setProduct(data);
            await setTitle(data.title);
            await setAuthorName(data.author);
            await setDescription(data.description);
            await setPrice(data.price);
            await setCompareAtPrice(data.compare_at_price);
            await setWholeSalePrice(data.wholesale_price);
            await setNumberOfPages(data.no_of_pages);
            console.log(data);
        }
        catch(error) {
            console.log(error)
        }
    }

    const handleDropZoneDrop = (_dropFiles, acceptedFiles, _rejectedFiles) => setImages((images) => [...images, ...acceptedFiles]);

    const handleImageCancel = (file) => {
        const tempImages = [...images];
        setImages(_.reject(tempImages, { name: file.name, type: file.type, size: file.size, lastModified: file.lastModified }));
    }

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg', 'image/svg'];

    const uploadedImages = images.length > 0 ? (
        <Stack vertical>
            {images.map((file, index) => (
                <Stack alignment="center" key={index} className={'Margin-top--4px'}>
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
                        {file.name}
                        <Caption>{file.size} bytes</Caption>
                    </div>
                    <Button
                        icon={CircleCancelMajor}
                        monochrome plain
                        onClick={() => handleImageCancel(file)}
                    />
                </Stack>
            ))}
        </Stack>
    ) : null;

    const handleSubmit = async () => {
        setLoading(true);
        let form = {
            title: title,
            authorName: authorName,
            description: description,
            numberOfPages: numberOfPages,
            price: price,
            compareAtPrice: compareAtPrice,
            wholesalePrice: wholeSalePrice,
        }
       try {
           const formData = new FormData();
           for (const [key,value] of Object.entries(form)) {
               formData.append(key, value);
           }
           images.forEach((image) => {
              formData.append('images[]', image)
           });
           const config = {
               headers: {
                   'enctype': 'multipart/form-data'
               }
           }
            let { data } = await axios.post('/api/products', formData, config);
            setLoading(false);
            navigate('/products');
       } catch (error) {
            console.log(error)
       }
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
            <Page title="Create Product">
                {
                    loading &&
                    <LoaderComponent />
                }
                <Card sectioned>
                    <Form onSubmit={handleSubmit}>
                        <FormLayout>
                            <TextField
                                value={title}
                                onChange={handleTitleChange}
                                label="Title"
                                type="text"
                                autoComplete={title}
                            />
                            <TextField
                                value={description}
                                onChange={handleDescriptionChange}
                                label="Description"
                                type="text"
                                autoComplete={description}
                                multiline={true}
                                maxHeight={110}
                            />

                            Images
                            <div style={{background: '#f8f8f8', padding: '2rem'}}>
                                <Stack>
                                    <Stack.Item fill>
                                        {uploadedImages}
                                    </Stack.Item>
                                    <Stack.Item>
                                        <div style={{width: 120, height: 120}}>
                                            <DropZone onDrop={handleDropZoneDrop} type="image" accept={validImageTypes}>
                                                {
                                                    <DropZone.FileUpload
                                                        actionTitle={'Add file'}
                                                        actionHint={'or drop file to upload'}
                                                    />
                                                }
                                            </DropZone>
                                        </div>
                                    </Stack.Item>
                                </Stack>
                            </div>
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
                            <FormLayout.Group>
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
                            </FormLayout.Group>
                            <TextField
                                value={wholeSalePrice}
                                onChange={handleWholeSalePriceChange}
                                label="Wholesale Price"
                                type="number"
                                autoComplete={wholeSalePrice}
                            />
                            <Button submit primary loading={loading}>Submit</Button>
                        </FormLayout>
                    </Form>
                </Card>
            </Page>
        </>
    );
}
export default Create;
