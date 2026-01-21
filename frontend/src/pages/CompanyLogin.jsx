import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginCompany } from '../services/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';

function CompanyLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const loginCompanyHandler = async () => {
        if (!email || !password) return alert('Please fill all fields');
        
        setLoading(true);
        try {
            const result = await loginCompany(email, password);
           
            if (result.status == "success") {
                sessionStorage.setItem('token', result.data.token);
                sessionStorage.setItem('user', JSON.stringify(result.data));
                // alert('Login Successful');
                toast.success("Loginn Successful")
                navigate('/company-dashboard');
            } else {
                alert(result.error);
            }
        } catch (ex) {
            // alert('Login failed');
            toast.error(ex)
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
                                    <h2 className="fw-bold text-dark mb-1">Company Login</h2>
                                    <p className="text-muted">Sign in to your company account</p>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control form-control-lg rounded-3" 
                                        placeholder="admin@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control form-control-lg rounded-3" 
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <button 
                                    className="btn btn-success btn-lg w-100 rounded-3 fw-semibold py-3 mb-3"
                                    onClick={loginCompanyHandler}
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>

                                <div className="text-center">
                                    <Link to="/register-company" className="text-decoration-none fw-semibold text-success">
                                        Create Company Account →
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

export default CompanyLogin;
