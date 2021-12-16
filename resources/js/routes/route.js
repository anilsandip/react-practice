import Home from "../components/pages/Home";
import Test from "../components/pages/Test";

const INDEX = '/';
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
        path: TEST,
        exact: true,
        page: {
            component: Test,
            title: 'Test'
        }
    },
];

export {routes, INDEX};
