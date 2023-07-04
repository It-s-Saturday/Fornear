import React from 'react';
import Logo from '../Logo';
import NavLink from './NavLink';

/**
 * Navigation bar
 * @returns {JSX.Element} Navbar
 */
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-[#ffdd00] p-6">
      <div className="block lg:hidden">
        <button
          type="button"
          className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="flex items-center flex-shrink-0 text-black mr-6">
          <a href="/" className="flex flex-row items-center">
            <Logo />
            <span className="text-2xl tracking-tight">Fornear @ OU</span>
          </a>
        </div>
        <div className="text-xl lg:flex-grow flex">
          {[
            { name: 'Home', link: '/' },
            {
              name: 'Staff',
              link: '/staff',
              dropdown: [
                { name: 'Requests', link: '/staff/requests' },
                { name: 'Inventory', link: '/staff/inventory' },
                { name: 'Create', link: '/staff/create-package' },
                { name: 'Insert', link: '/staff/insert' },
                { name: 'Update', link: '/staff/update' },
              ],
            },
            { name: 'Admin', link: '/admin' },
          ].map((item) => (
            <NavLink
              key={item.name}
              name={item.name}
              link={item.link}
              dropdown={item.dropdown}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
