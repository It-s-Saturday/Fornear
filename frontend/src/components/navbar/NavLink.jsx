import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Link component to handle redirect and dropdown onMouseEnter
 * @param {name} String: Text
 * @param {link} String: Path to redirect
 * @param {dropdown} Object: Object of paths to create dropdown
 * @param {isDropdown} Boolean?: Apply styles according to where NavLink is rendered (used for letter case)
 * @param {className} string?: apply custom className as needed (for NavLink in dropdown)
 * @returns {JSX.Element} NavLink
 */
export default function NavLink({
  name,
  link,
  dropdown,
  isDropdown,
  className,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <a
      href={link}
      key={name}
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
      className={className}
    >
      {!isDropdown ? name.toUpperCase() : name}
      {dropdown !== undefined && (dropdownOpen ? '▲' : '▼')}
      {dropdown !== undefined && dropdownOpen && (
        <div className="flex flex-col absolute bg-gray-200 w-[10rem] shadow-md">
          {dropdown.map((nestedDropdown) => (
            <NavLink
              name={nestedDropdown.name}
              link={nestedDropdown.link}
              dropdown={nestedDropdown.dropdown}
              isDropdown={true}
              className="text-link w-full p-2"
            />
          ))}
        </div>
      )}
    </a>
  );
}

NavLink.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types, react/require-default-props
  dropdown: PropTypes.object,
  isDropdown: PropTypes.bool,
  className: PropTypes.string,
};

NavLink.defaultProps = {
  isDropdown: false,
  className: 'text-link font-bold tracking-[.0625em]',
};
