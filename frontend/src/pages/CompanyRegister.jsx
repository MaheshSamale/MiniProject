import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerCompany } from '../services/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

function CompanyRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company_name: '', name: '', email: '', phone: '', password: '', address: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const registerCompanyHandler = async () => {
        if (!formData.company_name || !formData.email || !formData.password) {
            return alert('Please fill required fields');
        }
        
        setLoading(true);
        try {
            const result = await registerCompany(
                formData.company_name, formData.name, 
                formData.email, formData.phone, 
                formData.password, formData.address
            );
            console.log(result)
            
            if (result.status == "success") {
                alert('Company registered successfully!');
                navigate('/company-login');
            } else {
                alert(result.error);
            }
        } catch (ex) {
            alert('Registration failed');
        }
        setLoading(false);
    }

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-4">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-body p-5">
                                <div className="mb-4 text-center">
                                    <h2 className="fw-bold text-dark mb-1">Register Company</h2>
                                    <p className="text-muted">Create your company account</p>
                                </div>

                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Company Name *</label>
                                        <input 
                                            name="company_name"
                                            type="text" 
                                            className="form-control form-control-lg rounded-3" 
                                            placeholder="TechCorp Pvt Ltd"
                                            value={formData.company_name}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Admin Name *</label>
                                        <input 
                                            name="name"
                                            type="text" 
                                            className="form-control form-control-lg rounded-3" 
                                            placeholder="Admin User"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Email *</label>
                                        <input 
                                            name="email"
                                            type="email" 
                                            className="form-control form-control-lg rounded-3" 
                                            placeholder="admin@company.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Phone</label>
                                        <input 
                                            name="phone"
                                            type="tel" 
                                            className="form-control form-control-lg rounded-3" 
                                            placeholder="9876543210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Password *</label>
                                        <input 
                                            name="password"
                                            type="password" 
                                            className="form-control form-control-lg rounded-3" 
                                            placeholder="Enter password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Address</label>
                                        <input 
                                            name="address"
                                            type="text" 
                                            className="form-control form-control-lg rounded-3" 
                                            placeholder="123 MG Road, Pune"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <button 
                                    className="btn btn-success btn-lg w-100 rounded-3 fw-semibold py-3 mt-4 mb-3"
                                    onClick={registerCompanyHandler}
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Register Company'}
                                </button>

                                <div className="text-center">
                                    <Link to="/company-login" className="text-decoration-none fw-semibold text-success">
                                        Already have account? Sign In →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyRegister;
