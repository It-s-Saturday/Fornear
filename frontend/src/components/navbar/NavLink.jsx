import React, { useState } from 'react';
import PropTypes from 'prop-types';

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
          {Object.entries(dropdown).map(([dropdownName, dropdownLink]) => (
            <a
              key={dropdownName}
              href={dropdownLink}
              className="text-link hover:bg-gray-300 p-2 w-full font-light"
            >
              {dropdownName}
            </a>
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
