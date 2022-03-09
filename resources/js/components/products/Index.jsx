import React, {useCallback, useEffect, useState} from "react";
import {Card, DataTable, Page, ButtonGroup, Button, Pagination, Spinner, Filters} from "@shopify/polaris";
import { DeleteMinor, EditMinor } from "@shopify/polaris-icons";
import { useNavigate, Link, useParams, useSearchParams, useLocation } from "react-router-dom"
import ConfirmDialogue from "../common/ConfirmDialogue"
import {LoaderComponent} from "../common/Loader";

function Index() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [options, setOptions] = useState({});
    const [pagination, setPagination] = useState({});
    const [modal, setModal] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [productIndex, setProductIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    const [queryValue, setQueryValue] = useState('');

    useEffect( async () => {
        const currentParams = Object.fromEntries([...searchParams]);
        let params = options;
        params.page = currentParams.page || 1;
        params.search = currentParams.search || '';
        setOptions(params);
        setQueryValue(params.search);
        await getProducts(params);
    }, []);

    const getProducts = async (options = {}) => {
        let productsArr = [];
        try {
            let { data } = await axios.get(`api/products`, {params: options});
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
                page: data.current_page,
                search: queryValue
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
        console.log(`Edit ${index}`);
    }

    const handleDelete = (id, index) => {
        setProductIndex(index);
        setModal(true);
        console.log(`Delete ${index}`);
    }

    const handleConfirm = async (confirmation) => {
        setConfirm(confirmation);
        if(confirmation) {
            console.log(`Confirmed ${productIndex}`);
            try {
                setLoading(true);
                let parameters = {
                    id: products[productIndex].id,
                }
                let { data } = await axios.delete(`api/products`, {params: parameters});
                console.log(data.message);
                await getProducts(options)
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

    const handleFiltersQueryChange = async (value) => {
        setQueryValue(value);
        let params = options;
        params.page = 1;
        params.search = value;
        setOptions(params);
        let searchParam = { page: 1 };
        if(value) {
            searchParam.search = value;
        }
        setSearchParams({...searchParams, ...searchParam});
        await getProducts(params);
    };

    const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
    const handleFiltersClearAll = useCallback(() => {
        handleQueryValueRemove();
    }, [
        handleQueryValueRemove,
    ]);

    const handlePrev = async () => {
        let params = options;
        params.page--;
        params.search = queryValue;
        setOptions(params);
        let searchParam = { page: params.page };
        if(queryValue) {
            searchParam.search = queryValue;
        }
        setSearchParams({...searchParams, ...searchParam});
        await getProducts(params);
    }

    const handleNext = async () => {
        let params = options;
        params.page++;
        params.search = queryValue;
        setOptions(params);
        let searchParam = { page: params.page };
        if(queryValue) {
            searchParam.search = queryValue;
        }
        setSearchParams({...searchParams, ...searchParam});
        await getProducts(params);
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
                    <Filters
                        queryValue={queryValue}
                        filters={[]}
                        onQueryChange={handleFiltersQueryChange}
                        onQueryClear={handleQueryValueRemove}
                        onClearAll={handleFiltersClearAll}
                        queryPlaceholder="Filter items"
                    />
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
