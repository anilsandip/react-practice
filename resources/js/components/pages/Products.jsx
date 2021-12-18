import React, {useEffect} from "react";
import { Outlet, useNavigate } from 'react-router-dom'

function Products() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/products');
    }, []);

    return (
        <>
            <Outlet />
        </>
    );
}

export default Products;
