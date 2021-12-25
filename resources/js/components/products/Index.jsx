import React, {useEffect, useState} from "react";
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
            setLoading(true);
            let { data } = await axios.get(`api/products`, {params: options});
            data.data.forEach((product) => {
                productsArr.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    compareAtPrice: product.compare_at_price,
                    author: product.author || 'N/A' ,
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

    const handleEdit = (id, index) => {
        navigate(`/products/${id}/edit`);
    }

    const handleDelete = (id, index) => {
        setProductIndex(index);
        setModal(true);
    }

    const handleConfirm = async (confirmation) => {
        setConfirm(confirmation);
        if(confirmation) {
            console.log(`Confirmed ${productIndex}`);
            try {
                setLoading(true);
                let { data } = await axios.delete(`api/products/${products[productIndex].id}`);
                console.log(data.message);
                getProducts(options)
            } catch (error) {
                console.log(error)
            }
            setLoading(false);
        }
        else {
            console.log(`Declined ${productIndex}`);
        }
        setModal(false);
        setProductIndex(null);
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
        products.forEach((product, index) => {
            productsArr.push(
                [
                    <Link to={`/products/${product.id}`}>
                        { product.title }
                    </Link>,
                    product.author,
                    product.price,
                    <div className={"StyleDataTableActions"}>
                        <ButtonGroup>
                            <Button plain monochrome icon={EditMinor} onClick={() => handleEdit(product.id, index)}/>
                            <Button plain destructive icon={DeleteMinor} onClick={() => handleDelete(product.id, index)}/>
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
                    modal && (productIndex || productIndex === 0) &&
                    <ConfirmDialogue
                        message={`Are you sure want to delete ${products[productIndex].title} product ?`}
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
