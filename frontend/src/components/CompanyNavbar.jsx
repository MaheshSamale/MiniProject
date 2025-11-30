import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function CompanyNavbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/company-login');
    };

    return (
        <nav className="navbar navbar-expand-lg bg-success navbar-dark sticky-top shadow">
            <div className="container-fluid px-3 px-md-4">
                {/* Brand */}
                <Link className="navbar-brand fw-bold fs-5" to="/company-dashboard">
                    <i className="fas fa-utensils me-2"></i>
                    FoodCoupon Admin
                </Link>

                {/* Mobile Toggle */}
                <button 
                    className="navbar-toggler border-0 p-1 rounded" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="navbar-nav me-auto ms-3 ms-lg-0">
                        <Link className="nav-link px-3 py-2" to="/company-dashboard">
                            <i className="fas fa-tachometer-alt me-1"></i>Dashboard
                        </Link>
                        <Link className="nav-link px-3 py-2" to="/company-employees">
                            <i className="fas fa-users me-1"></i>Employees
                        </Link>
                        <Link className="nav-link px-3 py-2" to="/company-vendors">
                            <i className="fas fa-store me-1"></i>Vendors
                        </Link>
                        <Link className="nav-link px-3 py-2" to="/company-coupons">
                            <i className="fas fa-ticket-alt me-1"></i>Coupons
                        </Link>
                    </div>

                    {/* User Profile & Logout */}
                    <div className="d-flex align-items-center">
                        <div className="dropdown ms-2">
                            <a 
                                className="d-flex align-items-center text-white text-decoration-none dropdown-toggle p-2" 
                                href="#" 
                                role="button" 
                                data-bs-toggle="dropdown"
                            >
                                <i className="fas fa-user-circle me-2 fs-5"></i>
                                <span className="fw-bold small d-block d-md-inline">
                                    {user.name || 'Admin'}
                                </span>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-1">
                                <li><button className="dropdown-item py-2 fw-semibold text-danger w-100 text-start" onClick={logout}>Logout</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default CompanyNavbar;
