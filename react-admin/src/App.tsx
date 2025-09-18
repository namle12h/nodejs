

import '@ant-design/v5-patch-for-react-19';
// import { BrowserRouter, Routes, Route } from 'react-router';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'
import DashboardPage from './pages/DashboardPage';
import DefaultLayout from './layouts/DefaultLayout';
import LoginPage from './pages/LoginPage';
import NoPage from './pages/NoPage';
import EmptyLayout from './layouts/EmptyLayout';
import ProductsPage from './pages/ProductsPage';
import {

  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


const queryClient = new QueryClient();

function App() {


  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DefaultLayout />} >
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
          </Route>
          <Route path="/login" element={<EmptyLayout />} >
            <Route index element={<LoginPage />} />
          </Route>

          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
