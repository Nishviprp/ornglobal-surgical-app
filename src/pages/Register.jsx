import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { authService } from '../services/authService';
import { hospitalService } from '../services/hospitalService';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    hospitalId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [showNewHospital, setShowNewHospital] = useState(false);
  const [newHospital, setNewHospital] = useState({ name: '', city: '', country: '' });
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    setLoadingHospitals(true);
    const result = await hospitalService.getAllHospitals();
    if (result.success) {
      setHospitals(result.data);
    } else {
      toast.error('Failed to load hospitals');
    }
    setLoadingHospitals(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewHospitalChange = (e) => {
    const { name, value } = e.target;
    setNewHospital((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddHospital = async () => {
    if (!newHospital.name || !newHospital.city || !newHospital.country) {
      toast.error('Please fill all hospital details');
      return;
    }

    setLoading(true);
    const result = await hospitalService.createHospital(
      newHospital.name,
      newHospital.city,
      newHospital.country
    );

    if (result.success) {
      toast.success('Hospital added successfully');
      setFormData((prev) => ({
        ...prev,
        hospitalId: result.data.id,
      }));
      setNewHospital({ name: '', city: '', country: '' });
      setShowNewHospital(false);
      fetchHospitals();
    } else {
      toast.error('Failed to add hospital');
    }
    setLoading(false);
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Invalid email format');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (!formData.hospitalId) {
      toast.error('Please select or create a hospital');
      return false;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await authService.registerUser(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      formData.hospitalId
    );

    if (result.success) {
      toast.success(result.message);
      navigate('/verify-otp', { state: { email: formData.email } });
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex-center min-h-screen bg-gradient-to-br from-medical-lightblue to-white p-4">
      <div className="card w-full max-w-md">
        <div className="card-header">
          <h1 className="text-2xl font-bold text-medical-blue">Create Account</h1>
          <p className="text-sm text-gray-600 mt-1">Register to access ORNGlobal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field w-full"
              placeholder="john@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input-field w-full pr-10"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="input-field w-full pr-10"
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Hospital Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
            {loadingHospitals ? (
              <div className="text-center py-2 text-gray-500">Loading hospitals...</div>
            ) : (
              <select
                name="hospitalId"
                value={formData.hospitalId}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              >
                <option value="">Select a hospital</option>
                {hospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name} - {hospital.city}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={() => setShowNewHospital(!showNewHospital)}
              className="text-sm text-medical-blue hover:underline mt-2"
            >
              {showNewHospital ? 'Cancel' : 'Create new hospital'}
            </button>
          </div>

          {/* New Hospital Form */}
          {showNewHospital && (
            <div className="p-3 bg-medical-lightblue rounded-lg space-y-2">
              <input
                type="text"
                name="name"
                value={newHospital.name}
                onChange={handleNewHospitalChange}
                className="input-field w-full text-sm"
                placeholder="Hospital name"
              />
              <input
                type="text"
                name="city"
                value={newHospital.city}
                onChange={handleNewHospitalChange}
                className="input-field w-full text-sm"
                placeholder="City"
              />
              <input
                type="text"
                name="country"
                value={newHospital.country}
                onChange={handleNewHospitalChange}
                className="input-field w-full text-sm"
                placeholder="Country"
              />
              <button
                type="button"
                onClick={handleAddHospital}
                disabled={loading}
                className="btn-primary w-full text-sm"
              >
                {loading ? 'Adding...' : 'Add Hospital'}
              </button>
            </div>
          )}

          {/* Terms & Conditions */}
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-gray-700">
              I agree to the{' '}
              <span className="text-medical-blue hover:underline cursor-pointer">
                terms and conditions
              </span>
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-medical-blue font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
