import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiLogOut,
  FiUser,
  FiBuilding2,
  FiFileText,
  FiShare2,
  FiEye,
  FiPlus,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getHospitalById } from '../services/hospitalService';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [hospital, setHospital] = useState(null);
  const [hospitalLoading, setHospitalLoading] = useState(true);

  // Load hospital details
  useEffect(() => {
    const loadHospital = async () => {
      if (user?.hospital_id) {
        const result = await getHospitalById(user.hospital_id);
        if (result.success) {
          setHospital(result.data);
        }
      }
      setHospitalLoading(false);
    };

    loadHospital();
  }, [user?.hospital_id]);

  const handleLogout = async () => {
    const result = await logout();
    if (result?.success !== false) {
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } else {
      toast.error('Failed to logout');
    }
  };

  if (!user) {
    return (
      <div className="flex-center min-h-screen bg-medical-lightblue">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-medical-lightblue">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-medical-blue rounded-lg flex-center">
                <FiFileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-medical-blue">ORNGlobal</h1>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-medical-red hover:bg-medical-lightred rounded-lg transition font-medium"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-slideInUp">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user.first_name}! 👋
          </h2>
          <p className="text-gray-600">
            Here's an overview of your surgical procedure documentation system
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* User Profile Card */}
          <div className="card animate-slideInUp md:col-span-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-medical-blue rounded-full flex-center">
                <FiUser className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="card-header mb-0">Your Profile</h3>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Full Name</p>
                <p className="font-semibold text-gray-800">
                  {user.first_name} {user.last_name}
                </p>
              </div>

              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-semibold text-gray-800 break-all">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-gray-600">Role</p>
                <p className="font-semibold text-medical-blue capitalize">
                  {user.role || 'Nurse'}
                </p>
              </div>

              <button className="w-full btn-secondary text-sm mt-4">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Hospital Card */}
          <div className="card animate-slideInUp md:col-span-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-medical-green rounded-full flex-center">
                <FiBuilding2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="card-header mb-0">Hospital</h3>
              </div>
            </div>

            {hospitalLoading ? (
              <div className="flex-center py-8">
                <div className="spinner" />
              </div>
            ) : hospital ? (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-semibold text-gray-800">{hospital.name}</p>
                </div>

                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="font-semibold text-gray-800">
                    {hospital.city}, {hospital.country}
                  </p>
                </div>

                <div className="pt-4">
                  <span className="inline-block px-3 py-1 bg-medical-lightgreen text-medical-green text-xs font-semibold rounded-full">
                    Active
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">Hospital information unavailable</p>
            )}
          </div>

          {/* Quick Stats Card */}
          <div className="card animate-slideInUp md:col-span-1">
            <h3 className="card-header">Statistics</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Total Cases
                  </span>
                  <span className="text-2xl font-bold text-medical-blue">0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-medical-blue h-2 rounded-full"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Cases Shared
                  </span>
                  <span className="text-2xl font-bold text-medical-green">0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-medical-green h-2 rounded-full"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Shared with Me
                  </span>
                  <span className="text-2xl font-bold text-medical-red">0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-medical-red h-2 rounded-full"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideInUp">
          {/* Create Case Card */}
          <div className="card hover:shadow-lg cursor-pointer transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="card-header">Create Case</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Start documenting a new surgical procedure
                </p>
              </div>
              <div className="w-12 h-12 bg-medical-lightblue rounded-lg flex-center">
                <FiPlus className="w-6 h-6 text-medical-blue" />
              </div>
            </div>
            <button className="btn-primary w-full flex-center space-x-2">
              <FiFileText className="w-5 h-5" />
              <span>New Case</span>
            </button>
          </div>

          {/* View Cases Card */}
          <div className="card hover:shadow-lg cursor-pointer transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="card-header">My Cases</h3>
                <p className="text-gray-600 text-sm mb-4">
                  View and manage your surgical case documentation
                </p>
              </div>
              <div className="w-12 h-12 bg-medical-lightgreen rounded-lg flex-center">
                <FiEye className="w-6 h-6 text-medical-green" />
              </div>
            </div>
            <button className="btn-primary w-full flex-center space-x-2">
              <FiFileText className="w-5 h-5" />
              <span>View Cases</span>
            </button>
          </div>
        </div>

        {/* Recent Activity (Phase 2) */}
        <div className="mt-8 card animate-slideInUp">
          <h3 className="card-header">Recent Activity</h3>
          <div className="text-center py-12">
            <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No activity yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Start creating surgical cases to see activity here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
