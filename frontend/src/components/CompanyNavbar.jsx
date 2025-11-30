import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        <nav className="navbar navbar-expand-lg navbar-dark bg-success sticky-top shadow">
            <div className="container-fluid px-3 px-md-4">
                {/* Brand */}
                <div className="navbar-brand d-flex align-items-center fw-bold">
                    <i className="fas fa-utensils me-2"></i>
                    <span>FoodCoupon Admin</span>
                </div>

                {/* Mobile Toggle */}
                <button 
                    className="navbar-toggler border-0 p-1 rounded" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <i className="fas fa-bars fs-5"></i>
                </button>

                {/* Navigation */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto ms-3 ms-lg-0">
                        <li className="nav-item">
                            <a className="nav-link px-2 py-2" href="#dashboard">
                                <i className="fas fa-tachometer-alt me-1"></i>Dashboard
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link px-2 py-2" href="#employees">
                                <i className="fas fa-users me-1"></i>Employees
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link px-2 py-2" href="#vendors">
                                <i className="fas fa-store me-1"></i>Vendors
                            </a>
                        </li>
                    </ul>

                    {/* User Profile - SHOWS ON ALL DEVICES */}
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
                            {/* <span className="d-md-none text-muted small">({us || 'User'})</span> */}
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-1">
                            <li>
                                <span className="dropdown-item-text px-3 py-2 small">
                                    <i className="fas fa-user me-2"></i>
                                    {user.name || 'Admin'}
                                </span>
                            </li>
                            <li>
                                <span className="dropdown-item-text px-3 py-1 small text-muted">
                                    {user.email || ''}
                                </span>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button className="dropdown-item py-2 fw-semibold text-danger" onClick={logout}>
                                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default CompanyNavbar;
