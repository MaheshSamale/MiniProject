import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyNavbar from '../components/CompanyNavbar';
import { getVendors, addVendor } from '../services/vendor';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function CompanyVendors() {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        vendor_name: '', phone: '', location: ''
    });

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/company-login');
            return;
        }
        fetchVendors(token);
    }, [navigate]);

    const fetchVendors = async (token) => {
        try {
            const result = await getVendors(token);
            setVendors(result.data || []);
        } catch (ex) {
            console.log('Failed to fetch vendors');
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addVendorHandler = async () => {
        if (!formData.vendor_name) {
            alert('Please fill vendor name');
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            const result = await addVendor(formData, token);
            
            if (result.success) {
                alert('Vendor added successfully!');
                setShowAddModal(false);
                setFormData({ vendor_name: '', phone: '', location: '' });
                fetchVendors(token);
            } else {
                alert(result.error);
            }
        } catch (ex) {
            alert('Failed to add vendor');
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
                            <i className="fas fa-store-plus me-2"></i>
                            Add New Vendor
                        </button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-sm border-0 rounded-3">
                            <div className="card-header bg-white border-0 pb-0">
                                <h5 className="mb-3 fw-bold text-dark">
                                    <i className="fas fa-store me-2 text-success"></i>
                                    Vendors ({vendors.length})
                                </h5>
                            </div>
                            <div className="card-body p-0">
                                {vendors.length === 0 ? (
                                    <div className="text-center py-5 text-muted">
                                        <i className="fas fa-store fa-3x mb-3 opacity-50"></i>
                                        <p className="fs-5">No vendors added yet</p>
                                        <button className="btn btn-success" onClick={() => setShowAddModal(true)}>
                                            Add First Vendor
                                        </button>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-success">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Location</th>
                                                    <th>Phone</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {vendors.map(vendor => (
                                                    <tr key={vendor.id || vendor.user_id}>
                                                        <td>{vendor.vendor_name || vendor.name}</td>
                                                        <td>{vendor.location || '-'}</td>
                                                        <td>{vendor.phone}</td>
                                                        <td><span className="badge bg-success">Active</span></td>
                                                        <td>
                                                            <button className="btn btn-sm btn-outline-success me-1">QR</button>
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

            {/* Add Vendor Modal - GREEN THEME */}
            {showAddModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 shadow-lg">
                            <div className="modal-header border-0 bg-success text-white">
                                <h5 className="modal-title fw-bold">
                                    <i className="fas fa-store-plus me-2"></i>Add Vendor
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Vendor Name *</label>
                                        <input name="vendor_name" className="form-control form-control-lg" placeholder="Canteen A" value={formData.vendor_name} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Location</label>
                                        <input name="location" className="form-control form-control-lg" placeholder="Building 1, Floor 2" value={formData.location} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Phone</label>
                                        <input name="phone" type="tel" className="form-control form-control-lg" placeholder="9876543210" value={formData.phone} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0 bg-light">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-success px-4" onClick={addVendorHandler}>
                                    <i className="fas fa-check me-2"></i>Add Vendor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CompanyVendors;
