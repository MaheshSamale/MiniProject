
import { Routes , Route } from 'react-router'
import CompanyLogin from './pages/CompanyLogin'
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyRegister from './pages/CompanyRegister'
import { ToastContainer } from 'react-toastify';
import CompanyEmployees from './pages/CompanyEmployees';
import CompanyVendors from './pages/CompanyVendors';


function App() {

  return (
    <>
        <Routes>
      <Route path="/company-login" element={<CompanyLogin />} />
      <Route path="/register-company" element={<CompanyRegister />} />
      <Route path="/*" element={<CompanyLogin />} />
      <Route path="/company-dashboard" element={<CompanyDashboard />} />
      <Route path='/company-employees' element={<CompanyEmployees/>}/>
      <Route path='/company-vendors' element={<CompanyVendors/>}/>
      {/* <Route path='/company-coupons' element={<Company/>}/> */}
    </Routes>

       <ToastContainer />
  
    </>


  );
}

export default App
