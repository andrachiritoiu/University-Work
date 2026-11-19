import {createBrowserRouter, RouterProvider} from "react-router-dom"

import {WalletProvider} from './utils/Context.jsx';
import routes from "./routes/router.jsx"

import './App.css';

const router = createBrowserRouter(routes)

function App() {
    return (
        <WalletProvider>
            <RouterProvider router={router}/>
        </WalletProvider>
    )
}

export default App
