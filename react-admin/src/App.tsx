

import '@ant-design/v5-patch-for-react-19';
import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css'
import DashboardPage from './pages/DashboardPage';
import DefaultLayout from './layouts/DefaultLayout';
import LoginPage from './pages/LoginPage';
import NoPage from './pages/NoPage';
import EmptyLayout from './layouts/EmptyLayout';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />} >
          <Route index element={<DashboardPage />} />
        </Route>
        <Route path="/login" element={<EmptyLayout />} >
          <Route index element={<LoginPage />} />
        </Route>

        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
