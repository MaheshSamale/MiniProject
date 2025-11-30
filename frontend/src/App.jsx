
import { Routes , Route } from 'react-router'
import CompanyLogin from './pages/CompanyLogin'
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyRegister from './pages/CompanyRegister'


function App() {

  return (

    <Routes>
      <Route path="/company-login" element={<CompanyLogin />} />
      <Route path="/register-company" element={<CompanyRegister />} />
      <Route path="/*" element={<CompanyLogin />} />
      <Route path="/company-dashboard" element={<CompanyDashboard />} />
    </Routes>
  );
}

export default App
