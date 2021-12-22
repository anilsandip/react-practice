import Home from "../components/pages/Home";
import Products from "../components/pages/Products";
import Test from "../components/pages/Test";
import Index from "../components/products/Index";
import Create from "../components/products/Create";
import Show from "../components/products/Show";

const INDEX = '/';
const PRODUCTS = '/products';
const PRODUCTS_LAYOUT = {
    LIST_PRODUCTS: '',
    CREATE_PRODUCT: 'create',
    SHOW_PRODUCT: ':id',
    EDIT_PRODUCT: ':id/edit',
};
const TEST = '/test';

const routes = [
    {
        path: INDEX,
        exact: true,
        page: {
            component: Home,
            title: 'Home'
        }
    },
    {
        path: PRODUCTS,
        exact: true,
        page: {
            component: Products,
            title: 'Products'
        },
        children: [
            {
                path: PRODUCTS_LAYOUT.LIST_PRODUCTS,
                exact: true,
                page: {
                    component: Index,
                    title: 'Products'
                }
            },
            {
                path:  PRODUCTS_LAYOUT.CREATE_PRODUCT,
                exact: true,
                page: {
                    component: Create,
                    title: 'Create Product'
                }
            },
            {
                path: PRODUCTS_LAYOUT.SHOW_PRODUCT,
                exact: true,
                page: {
                    component: Show,
                    title: 'Product'
                }
            },
            {
                path: PRODUCTS_LAYOUT.EDIT_PRODUCT,
                exact: true,
                page: {
                    component: Create,
                    title: 'Product'
                }
            },
        ]
    },
    {
        path: TEST,
        exact: true,
        page: {
            component: Test,
            title: 'Test'
        }
    },
];

export {routes, INDEX};
