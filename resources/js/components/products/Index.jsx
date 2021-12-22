import React, {useEffect, useState} from "react";
import { API } from  '../../api';
import {Card, DataTable, Page, ButtonGroup, Button, Pagination, Spinner} from "@shopify/polaris";
import { DeleteMinor, EditMinor } from "@shopify/polaris-icons";
import { useNavigate, Link } from "react-router-dom"
import ConfirmDialogue from "../common/ConfirmDialogue"
import {LoaderComponent} from "../common/Loader";

function Index() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [options, setOptions] = useState([]);
    const [pagination, setPagination] = useState({});
    const [modal, setModal] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [productIndex, setProductIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        getProducts();
    }, []);

    const getProducts = async (options = {}) => {
        let productsArr = [];
        try {
            let { data } = await API.get(`api/products`, {params: options});
            data.data.forEach((product) => {
                productsArr.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    compareAtPrice: product.compare_at_price,
                    author: product.author,
                })
            });
            setProducts(productsArr);

            let paginationParams = {
                hasNext: !!data.next_page_url,
                hasPrev: !!data.prev_page_url,
                to: data.to,
                from: data.from,
                total: data.total,
            };
            setPagination(paginationParams);

            setOptions({
                page: data.current_page
            })
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
    };

    const handleAdd = () => {
        navigate('/products/create');
    }

    const handleEdit = (index) => {
        alert(`Edit ${index}`);
    }

    const handleDelete = (index) => {
        setModal(true);
        setProductIndex(index);
        console.log(`Delete ${index}`);
    }

    const handleConfirm = (confirmation) => {
        setConfirm(confirmation);
        setModal(false);
        if(confirmation) {
            console.log(`Confirmed ${productIndex}`);
        }
        else {
            setProductIndex(null);
            console.log(`Declined ${productIndex}`);
        }
    }

    const primaryAction = {
        content: 'Add',
        onAction: handleAdd
    };

    const columnContentTypes = [
        'text',
        'numeric',
        'numeric',
        'numeric',
        'text',
    ];

    const headings = [
        'Name',
        'Author Name',
        'Price',
        'Action',
    ];

    const rows = () => {
        let productsArr = [];
        products.forEach((product) => {
            productsArr.push(
                [
                    <Link to="/products/1">
                        { product.title }
                    </Link>,
                    product.author,
                    product.price,
                    <div className={"StyleDataTableActions"}>
                        <ButtonGroup>
                            <Button plain monochrome icon={EditMinor} onClick={() => handleEdit(product.id)}/>
                            <Button plain destructive icon={DeleteMinor} onClick={() => handleDelete(product.id)}/>
                        </ButtonGroup>
                    </div>,
                ],
            )
        })
        return productsArr;
    }

    const handlePrev = () => {
        let params = options;
        params.page--;
        setOptions(params);
        getProducts(options);
    }

    const handleNext = () => {
        let params = options;
        params.page++;
        setOptions(params);
        getProducts(options);
    }

    const footerContent = (
        <>
            Showing {pagination.from} - {pagination.to} of {pagination.total} products

            <div style={{display: "flex", justifyContent: "center", marginTop: "15px"}}>
                <Pagination
                    hasPrevious={pagination.hasPrev}
                    onPrevious={handlePrev}
                    hasNext={pagination.hasNext}
                    onNext={handleNext}
                />
            </div>
        </>
    );

    return (
        <>
            <Page fullWidth title="Products" primaryAction={primaryAction}>
                {
                    loading &&
                    <LoaderComponent />
                }
                <Card>
                    <DataTable
                        columnContentTypes={columnContentTypes}
                        headings={headings}
                        rows={rows()}
                        footerContent={footerContent}
                    />
                </Card>
                {
                    modal &&
                    <ConfirmDialogue
                        message={`Are you sure want to delete this product ?`}
                        options={{
                            primaryAction: {
                                destructive: true,
                            }
                        }}
                        setConfirm={handleConfirm}
                    />
                }
            </Page>
        </>
    );
}
export default Index;
