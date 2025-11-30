import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyNavbar from '../components/CompanyNavbar';
import { getEmployees, addEmployee } from '../services/employee';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function CompanyEmployees() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', pin_code: '',
        employee_code: '', department: '', designation: ''
    });

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        console.log(token)
        if (!token) {
            navigate('/company-login');
            return;
        }
        fetchEmployees(token);
    }, [navigate]);

    const fetchEmployees = async (token) => {
        try {
            const result = await getEmployees(token);
            setEmployees(result.data || []);
        } catch (ex) {
            console.log('Failed to fetch employees');
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addEmployeeHandler = async () => {
        if (!formData.name || !formData.email || !formData.employee_code) {
            alert('Please fill required fields');
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            const result = await addEmployee(formData, token);
            
            if (result.success) {
                alert('Employee added successfully!');
                setShowAddModal(false);
                setFormData({ name: '', email: '', phone: '', pin_code: '', employee_code: '', department: '', designation: '' });
                fetchEmployees(token);
            } else {
                alert(result.error);
            }
        } catch (ex) {
            alert('Failed to add employee');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light">
            <CompanyNavbar />
            <div className="container py-4 px-3">
                <div className="row mb-4">
                    <div className="col-12">
                        <button 
                            className="btn btn-success btn-lg w-100 w-md-auto rounded-3 shadow-sm py-3"
                            onClick={() => setShowAddModal(true)}
                        >
                            <i className="fas fa-user-plus me-2"></i>
                            Add New Employee
                        </button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-sm border-0 rounded-3">
                            <div className="card-header bg-white border-0 pb-0">
                                <h5 className="mb-3 fw-bold text-dark">
                                    <i className="fas fa-users me-2 text-success"></i>
                                    Employees ({employees.length})
                                </h5>
                            </div>
                            <div className="card-body p-0">
                                {employees.length === 0 ? (
                                    <div className="text-center py-5 text-muted">
                                        <i className="fas fa-users fa-3x mb-3 opacity-50"></i>
                                        <p className="fs-5">No employees added yet</p>
                                        <button className="btn btn-success" onClick={() => setShowAddModal(true)}>
                                            Add First Employee
                                        </button>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-success">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Code</th>
                                                    <th>Department</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employees.map(emp => (
                                                    <tr key={emp.id || emp.user_id}>
                                                        <td>{emp.name}</td>
                                                        <td>{emp.email}</td>
                                                        <td><span className="badge bg-primary">{emp.employee_code}</span></td>
                                                        <td>{emp.department || '-'}</td>
                                                        <td><span className="badge bg-success">Active</span></td>
                                                        <td>
                                                            <button className="btn btn-sm btn-outline-primary me-1">Edit</button>
                                                            <button className="btn btn-sm btn-outline-danger">Remove</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content rounded-4 shadow-lg">
                            <div className="modal-header border-0 bg-success text-white">
                                <h5 className="modal-title fw-bold">
                                    <i className="fas fa-user-plus me-2"></i>Add Employee
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Name *</label>
                                        <input name="name" className="form-control form-control-lg" placeholder="John Doe" value={formData.name} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Email *</label>
                                        <input name="email" type="email" className="form-control form-control-lg" placeholder="john@company.com" value={formData.email} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Phone</label>
                                        <input name="phone" type="tel" className="form-control form-control-lg" placeholder="9876543210" value={formData.phone} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">PIN Code</label>
                                        <input name="pin_code" className="form-control form-control-lg" placeholder="400001" value={formData.pin_code} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Employee Code *</label>
                                        <input name="employee_code" className="form-control form-control-lg" placeholder="EMP001" value={formData.employee_code} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Department</label>
                                        <input name="department" className="form-control form-control-lg" placeholder="IT" value={formData.department} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Designation</label>
                                        <input name="designation" className="form-control form-control-lg" placeholder="Developer" value={formData.designation} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0 bg-light">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-success px-4" onClick={addEmployeeHandler}>
                                    <i className="fas fa-check me-2"></i>Add Employee
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CompanyEmployees;
