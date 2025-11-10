

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
import AppointmentManager from './modules/dashboard/pages/AppoinmentPage';
import AuditLogTable from './modules/dashboard/components/AuditLogTable';
import CustomerPage from './modules/dashboard/pages/CustomerPage';
import ServiceDetailPage from './modules/view/pages/ServiceDetailPage';
import ProfileForm from './modules/view/components/ProfileForm';
import ProfilePage from './modules/view/pages/ProfilePage';
import ChangePasswordForm from './modules/view/components/ChangePasswordForm';
import AppointmentHistory from './modules/view/components/AppointmentHistory';
import ProductPageView from './modules/view/pages/ProductPage';
import ProductDetail from './modules/view/pages/ProductDetailPage';
import CartPage from './modules/view/components/CartPage';
import PaymentSuccess from './modules/view/components/PaymentSuccess';
import CheckoutPage from './modules/view/pages/CheckoutPage';
import PaymentReturnPage from './modules/dashboard/components/PaymentReturnPage';
import SpinWheel from './modules/view/components/SpinWheel';
import { CartProvider } from './shared/context/CartContext';
import OrderDetailsPage from './modules/view/components/OrderDetailPage';
import OrderProductPage from './modules/dashboard/pages/OrderProductPage';



const queryClient = new QueryClient();

function App() {


  return (

    <QueryClientProvider client={queryClient}>
      <HeadProvider>
        <CartProvider>
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


                <Route path="booking" element={<AppointmentManager />} />
                <Route path="orders" element={<OrderProductPage />} />
                <Route path="history" element={<AuditLogTable />} />
                <Route path="customer" element={<CustomerPage />} />
                {/* <Route path="orders" element={<OrderPage />} /> */}

              </Route>
              <Route path="/login" element={<EmptyLayout />} >
                <Route index element={<LoginPage />} />
              </Route>
              <Route path="/register" element={<EmptyLayout />} >
                <Route index element={<RegisterStaff />} />
              </Route>
              <Route path="/cart" element={<EmptyLayout />} >
                <Route index element={<CartPage />} />
              </Route>
              <Route path="/payment-success" element={<EmptyLayout />} >
                <Route index element={<PaymentSuccess />} />
              </Route>
              <Route path="/checkout" element={<EmptyLayout />} >
                <Route index element={<CheckoutPage />} />
              </Route>
              <Route path="/products" element={<EmptyLayout />} >
                <Route index element={<ProductPageView />} />
              </Route>
               <Route path="/orderpage" element={<EmptyLayout />} >
                <Route index element={<OrderDetailsPage />} />
              </Route>
              <Route path="*" element={<NoPage />} />
              <Route path="/home" element={
                <PrivateRoute allowedRoles={[]}>
                  <EmptyLayout />
                </PrivateRoute>
              }>



                <Route index element={<HomePage />} />
              </Route>
              <Route path="/profile" element={<ProfilePage />}>
                <Route index element={<ProfileForm />} /> {/* 👈 route mặc định */}
                <Route path="info" element={<ProfileForm />} />
                <Route path="password" element={<ChangePasswordForm />} />
                <Route path="orders" element={<AppointmentHistory />} />
                <Route path="products" element={<OrderDetailsPage />} />
              </Route>


              <Route
                path="/services/:id"
                element={
                  <PrivateRoute allowedRoles={[]}>
                    <EmptyLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<ServiceDetailPage />} />

              </Route>
              <Route
                path="/products/:id"
                element={
                  <PrivateRoute allowedRoles={[]}>
                    <EmptyLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<ProductDetail />} />

              </Route>
            // App.tsx hoặc routes.tsx
              <Route path="/payment-return" element={<PaymentReturnPage />} />

              <Route path="/spinwheel" element={<SpinWheel />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </HeadProvider>
    </QueryClientProvider>
  )
}

export default App
