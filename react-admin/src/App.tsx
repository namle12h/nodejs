

import '@ant-design/v5-patch-for-react-19';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HeadProvider } from "react-head";


import './App.css'
import DashboardPage from './modules/dashboard/pages/DashboardPage';
import DefaultLayout from './shared/layouts/DefaultLayout';
import LoginPage from './shared/LoginPage';
import NoPage from './shared/NoPage';
import EmptyLayout from './shared/layouts/EmptyLayout';
import ProductsPage from './modules/dashboard/pages/ProductsPage';
import {

  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import RegisterStaff from './shared/RegisterPage';
import ServicePage from './modules/dashboard/pages/ServicesPage';
import HomePage from './modules/view/pages/HomePage';
import PrivateRoute from './shared/lib/privateRoute';



const queryClient = new QueryClient();

function App() {


  return (

    <QueryClientProvider client={queryClient}>
      <HeadProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/"
              element={
                <PrivateRoute allowedRoles={[]}>
                  <EmptyLayout />
                </PrivateRoute>
              }>
              <Route index element={<HomePage />} />
            </Route>


            <Route path="/dashboard"
              // element={<DefaultLayout />}
              element={
                <PrivateRoute allowedRoles={["ADMIN", "STAFF"]}>
                  <DefaultLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="services" element={<ServicePage />} />
            </Route>
            <Route path="/login" element={<EmptyLayout />} >
              <Route index element={<LoginPage />} />
            </Route>
            <Route path="/register" element={<EmptyLayout />} >
              <Route index element={<RegisterStaff />} />
            </Route>

            <Route path="*" element={<NoPage />} />
            <Route path="/home" element={
              <PrivateRoute allowedRoles={[]}>
                <EmptyLayout />
              </PrivateRoute>
            }>
              <Route index element={<HomePage />} />
            </Route>


          </Routes>
        </BrowserRouter>
      </HeadProvider>
    </QueryClientProvider>
  )
}

export default App
