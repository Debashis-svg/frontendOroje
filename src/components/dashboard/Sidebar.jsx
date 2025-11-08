// src/components/dashboard/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'My Team', href: '/dashboard/team', icon: UserGroupIcon },
  { name: 'My Submissions', href: '/dashboard/submissions', icon: DocumentTextIcon },
];

function NavItem({ item }) {
  return (
    <NavLink
      to={item.href}
      end={item.href === '/dashboard'}
      className={({ isActive }) =>
        `flex items-center px-3 py-3 rounded-lg font-medium transition-colors ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`
      }
    >
      <item.icon className="h-6 w-6 mr-3" />
      {item.name}
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 p-4 space-y-2">
      <h2 className="text-xl font-semibold text-white px-2 mb-4">Participant Menu</h2>
      <nav className="flex flex-col space-y-2">
        {navigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>
    </aside>
  );
}