import React, {useEffect, useState} from "react";
import {Card, DataTable, Page, ButtonGroup, Button, Pagination} from "@shopify/polaris";
import { DeleteMinor, EditMinor } from "@shopify/polaris-icons";
import { useNavigate, Link } from "react-router-dom"

function Index() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [modal, setModal] = useState(false);

    const handleAdd = () => {
        navigate('/products/create');
    }

    const handleEdit = (index) => {
        alert(`Edit ${index}`);
    }

    const handleDelete = (index) => {
        setModal(true);
        alert(`Delete ${index}`);
    }

    const primaryAction = {
        content: 'Add',
        onAction: () => handleAdd()
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

    const rows = [
        [
            <Link to="/products/1">
                Book 1
            </Link>,
            'Author 1',
            '$122',
            <div className={"StyleDataTableActions"}>
                <ButtonGroup>
                    <Button plain monochrome icon={EditMinor} onClick={() => handleEdit(1)} />
                    <Button plain destructive icon={DeleteMinor} onClick={() => handleDelete(1)} />
                </ButtonGroup>
            </div>,
        ],
        [
            <Link to="/products/2">
                Book 2
            </Link>,
            'Author 2',
            '$111',
            <div className={"StyleDataTableActions"}>
                <ButtonGroup>
                    <Button plain monochrome icon={EditMinor} onClick={() => handleEdit(2)} />
                    <Button plain destructive icon={DeleteMinor} onClick={() => handleDelete(2)} />
                </ButtonGroup>
            </div>,
        ],
        [
            <Link to="/products/3">
                Book 3
            </Link>,
            'Author 3',
            '$333',
            <div className={"StyleDataTableActions"}>
                <ButtonGroup>
                    <Button plain monochrome icon={EditMinor} onClick={() => handleEdit(3)} />
                    <Button plain destructive icon={DeleteMinor} onClick={() => handleDelete(3)} />
                </ButtonGroup>
            </div>,
        ],
    ];

    const footerContent = (
        <>
            Showing {rows.length} of {rows.length} results

            <div style={{display: "flex", justifyContent: "center", marginTop: "15px"}}>
                <Pagination
                    hasPrevious
                    onPrevious={() => {
                        alert('Previous');
                    }}
                    hasNext
                    onNext={() => {
                        alert('Next');
                    }}
                />
            </div>
        </>
    );

    useEffect(() => {
        // setProducts();
    }, [products]);

    return (
        <div>
            <Page fullWidth title="Books" primaryAction={primaryAction}>
                <Card>
                    <DataTable
                        columnContentTypes={columnContentTypes}
                        headings={headings}
                        rows={rows}
                        footerContent={footerContent}
                    />
                </Card>
            </Page>
        </div>
    );
}
export default Index;
