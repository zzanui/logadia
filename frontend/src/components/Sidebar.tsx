import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <aside className="md:col-span-1 bg-gray-800 text-white p-4 h-full">
            <nav>
                <ul className="space-y-2">
                <li><a href="#" className="block p-2 hover:bg-gray-700 rounded">Dashboard</a></li>
                <li><a href="#" className="block p-2 hover:bg-gray-700 rounded">Profile</a></li>
                <li><a href="#" className="block p-2 hover:bg-gray-700 rounded">Settings</a></li>
                </ul>
            </nav>
        </aside>
    );
};


export default Sidebar