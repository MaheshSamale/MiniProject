import React from 'react'
import CompanyNavbar from '../components/CompanyNavbar'

function CompanyDashboard() {
  return (
    <div className="min-vh-100 bg-light">
    <CompanyNavbar />
    {/* Remove old navbar code, keep rest of dashboard */}
    <div className="container py-4 px-3">
        {/* Stats cards, tables, etc... */}
    </div>
</div>
  )
}

export default CompanyDashboard
