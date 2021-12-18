import Home from "../components/pages/Home";
import Test from "../components/pages/Test";
import Index from "../components/products/Index";
import Create from "../components/products/Create";
import Show from "../components/products/Show";

const INDEX = '/';
const PRODUCTS = '/products';
const CREATE_PRODUCT = '/products/create';
const SHOW_PRODUCT = '/products/:id';
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
            component: Index,
            title: 'Products'
        }
    },
    {
        path: CREATE_PRODUCT,
        exact: true,
        page: {
            component: Create,
            title: 'Create Product'
        }
    },
    {
        path: SHOW_PRODUCT,
        exact: true,
        page: {
            component: Show,
            title: 'Product'
        }
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
