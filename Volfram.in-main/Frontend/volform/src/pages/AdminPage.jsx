import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import AdminLayout from '../components/admin/AdminLayout';

import ImageManager from '../components/admin/ImageManager';

import CalculatorsList from '../components/admin/CalculatorsList';
import UsersList from '../components/admin/UsersList';
import EnquiriesList from '../components/admin/EnquiriesList';
import RequirementsList from '../components/admin/RequirementsList';
import ChatbotLeadsList from '../components/admin/ChatbotLeadsList';
import DashboardOverview from '../components/admin/DashboardOverview';

import { getAccessToken } from '../services/api';


/**
 * Admin Dashboard Page
 * Main admin interface after login
 */

function AdminPage() {

    const [activeSection, setActiveSection] =
        useState('dashboard');

    const navigate = useNavigate();


    // Redirect to login if no access token
    // or if user is not an admin

    useEffect(() => {

        const token = getAccessToken();

        if (!token) {

            navigate('/login');

            return;
        }


        // Decode JWT payload to check role

        try {

            const payload = JSON.parse(
                atob(token.split('.')[1])
            );

            if (payload.role !== 'admin') {

                navigate('/');
            }

        } catch {

            navigate('/login');
        }

    }, [navigate]);


    const renderContent = () => {

        switch (activeSection) {

            case 'images':

                return <ImageManager />;


            // NEW CALCULATORS SECTION

            case 'calculators':

                return <CalculatorsList />;

            case 'users':
                return <UsersList />;

            case 'enquiries':
                return <EnquiriesList />;

            case 'requirements':
                return <RequirementsList />;

            case 'chatbot-leads':
                return <ChatbotLeadsList />;


            case 'dashboard':
                return <DashboardOverview />;


            default:
                return <DashboardOverview />;
        }
    };


    return (

        <AdminLayout
            activeSection={activeSection}
            onSectionChange={setActiveSection}
        >

            {renderContent()}

        </AdminLayout>
    );
}
export default AdminPage;