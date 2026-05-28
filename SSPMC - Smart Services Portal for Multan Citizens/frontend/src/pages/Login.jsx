import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center pt-24 pb-16 bg-gray-50 px-4 font-sans">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-100 my-auto">
                <div className="text-center mb-6 border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Smart Services & Public Management Console</h2>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Multan District Administration</p>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Citizen Sign In</h3>
                
                <LoginForm />

                <div className="text-center mt-6 text-sm text-gray-500">
                    Are you a new resident? <Link to="/signup" className="text-emerald-500 font-semibold hover:underline">Create an account</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;