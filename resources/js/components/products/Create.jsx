import React, {useEffect, useState} from "react";
import {Button, Card, Checkbox, Form, FormLayout, List, Page, TextField, Stack, Thumbnail, Caption, DropZone} from "@shopify/polaris";
import { NoteMinor, CircleCancelMajor } from "@shopify/polaris-icons";
import {useNavigate, useLocation, useParams} from "react-router-dom";
import {LoaderComponent} from "../common/Loader";


function Create() {
    const [product, setProduct] = useState({
        title: null,
        authorName: null,
        description: null,
        numberOfPages: null,
        price: null,
        compareAtPrice: null,
        wholesalePrice: null,
    });

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageTitle, setPageTitle] = useState('Create Product');

    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    useEffect(async () => {
        if(/\/products\/[0-9]+\/edit/.test(location.pathname)) {
            setPageTitle('Edit Product')
            await getProduct();
        }
    }, []);

    const getProduct = async () => {
        try {
            setLoading(true);
            let {data} = await axios.get(`/api/products/${id}`);
            setProduct({
                id: data.id,
                title: data.title,
                description: data.description,
                product_id: data.product_id,
                variant_id: data.variant_id,
                authorName: data.author ? data.author : '',
                price: data.price?.toString(),
                compareAtPrice: data.compare_at_price?.toString(),
                wholesalePrice: data.wholesale_price?.toString(),
                numberOfPages: data.no_of_pages?.toString(),
            });
            setImages(data.images);
            setLoading(false);
        }
        catch(error) {
            console.log(error)
        }
    }

    const handleDropZoneDrop = (_dropFiles, acceptedFiles, _rejectedFiles) => setImages((images) => [...images, ...acceptedFiles]);

    const handleImageCancel = (file) => {
        const tempImages = [...images];
        if (!(file instanceof File)) {
            setImages(_.reject(tempImages, { id: file.id, src: file.src }));
        } else {
            setImages(_.reject(tempImages, { name: file.name, type: file.type, size: file.size, lastModified: file.lastModified }));
        }
    }

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg', 'image/svg'];

    const uploadedImages = images.length > 0 ? (
        <Stack vertical>
            {images.map((file, index) => (
                <Stack alignment="center" key={index} className={'Margin-top--4px'}>
                    <Thumbnail
                        size="small"
                        alt={file.name}
                        source={!(file instanceof File) ? file.src :
                                (
                                    validImageTypes.includes(file.type)
                                    ? window.URL.createObjectURL(file)
                                    : NoteMinor
                                )
                        }
                    />
                    <div>
                        {file.name ? file.name : `image-${index+1}`}
                        {
                            file.size &&
                            <Caption>{file.size} bytes </Caption>
                        }
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
       try {
           const formData = new FormData();
           for (const [key,value] of Object.entries(product)) {
               formData.append(key, value);
           }
           images.forEach((image) => {
               if(!(image instanceof File)) {
                   formData.append('images[]', image.id);
               } else {
                   formData.append('imageFiles[]', image);
               }
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

    const handleOnChange = (value, id) => {
        setProduct({
            ...product,
            [id]:value
        })
    };

    return (
        <>
            {
                loading
                ?
                <LoaderComponent/>
                :
                <Page title={pageTitle}>
                    <Card sectioned>
                        <Form onSubmit={handleSubmit}>
                            <FormLayout>
                                <TextField
                                    value={product.title}
                                    id="title"
                                    onChange={(value, id) => handleOnChange(value, id)}
                                    label="Title"
                                    type="text"
                                    autoComplete={product.title}
                                />
                                <TextField
                                    value={product.description}
                                    id="description"
                                    onChange={(value, id) => handleOnChange(value, id)}
                                    label="Description"
                                    type="text"
                                    autoComplete={product.description}
                                    multiline={true}
                                    maxHeight={110}
                                />

                                Images
                                <div style={{ background: '#f8f8f8', padding: '2rem' }}>
                                    <Stack>
                                        <Stack.Item fill>
                                            {uploadedImages}
                                        </Stack.Item>
                                        <Stack.Item>
                                            <div style={{ width: 120, height: 120 }}>
                                                <DropZone onDrop={handleDropZoneDrop} type="image"
                                                          accept={validImageTypes}>
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
                                        value={product.price}
                                        id="price"
                                        onChange={(value, id) => handleOnChange(value, id)}
                                        label="Price" type="number"
                                        autoComplete={product.price}
                                    />
                                    <TextField
                                        value={product.compareAtPrice}
                                        id="compareAtPrice"
                                        onChange={(value, id) => handleOnChange(value, id)}
                                        label="Compare At Price"
                                        type="number"
                                        autoComplete={product.compareAtPrice}
                                    />
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <TextField
                                        value={product.authorName}
                                        id="authorName"
                                        onChange={(value, id) => handleOnChange(value, id)}
                                        label="Author Name"
                                        type="text"
                                        autoComplete={product.authorName}
                                    />
                                    <TextField
                                        value={product.numberOfPages}
                                        id="numberOfPages"
                                        onChange={(value, id) => handleOnChange(value, id)}
                                        label="No. Of Pages"
                                        type="number" autoComplete={product.numberOfPages}
                                    />
                                </FormLayout.Group>
                                <TextField
                                    value={product.wholesalePrice}
                                    id="wholesalePrice"
                                    onChange={(value, id) => handleOnChange(value, id)}
                                    label="Wholesale Price"
                                    type="number"
                                    autoComplete={product.wholesalePrice}
                                />
                                <Button submit primary loading={loading}>Submit</Button>
                            </FormLayout>
                        </Form>
                    </Card>
                </Page>
            }
        </>
    );
}
export default Create;
