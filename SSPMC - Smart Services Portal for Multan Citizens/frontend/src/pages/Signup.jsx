import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../components/SignupForm';

const Signup = () => {
    return (
        <div className="w-full min-h-screen flex flex-col items-center pt-24 pb-16 bg-gray-50 px-4 font-sans">
            <div className="max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100 my-auto">
                <div className="text-center mb-6 border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Smart Services & Public Management Portal</h2>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Multan District Administration</p>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Create Community Account</h3>
                
                <SignupForm />

                <div className="text-center mt-6 text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-emerald-500 font-semibold hover:underline">Sign In here</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;