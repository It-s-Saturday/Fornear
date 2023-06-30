import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Link component to handle redirect and dropdown onMouseEnter
 * @param {name} String: Text
 * @param {link} String: Path to redirect
 * @param {dropdown} Object: Object of paths to create dropdown
 * @returns {JSX.Element} NavLink
 */
export default function NavLink({ name, link, dropdown }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <div
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <a
        key={name}
        href={link}
        className="text-link font-bold tracking-[.0625em]"
      >
        {name.toUpperCase()}
        {dropdown !== undefined && (dropdownOpen ? '▲' : '▼')}
      </a>
      {dropdown !== undefined && dropdownOpen && (
        <div className="flex flex-col absolute bg-gray-200 w-[10rem] shadow-md">
          {dropdown.map((nestedDropdown) => (
            <NavLink
              name={nestedDropdown.name}
              link={nestedDropdown.link}
              dropdown={nestedDropdown.dropdown}
            />
          ))}
        </div>
      )}
    </div>
  );
}

NavLink.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props, react/forbid-prop-types
  dropdown: PropTypes.object,
};
