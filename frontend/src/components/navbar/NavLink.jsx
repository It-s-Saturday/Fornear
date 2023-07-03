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
    <div key={`${name}-div`} onMouseLeave={() => setDropdownOpen(false)}>
      <a
        href={link}
        onMouseEnter={() => setDropdownOpen(true)}
        className={className}
      >
        {!isDropdown ? name.toUpperCase() : name}
        {dropdown !== undefined && (dropdownOpen ? ' ▲' : ' ▼')}
      </a>
      {dropdown !== undefined && dropdownOpen && (
        <div className="flex flex-col absolute flex-center bg-gray-200 w-[10rem] shadow-md z-[99]">
          {dropdown.map((nestedDropdown) => (
            <span key={nestedDropdown.name} className="p-2 font-bold z-[99]">
              <NavLink
                link={nestedDropdown.link}
                name={nestedDropdown.name}
                isDropdown={true}
                className="text-link w-full"
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

NavLink.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types, react/require-default-props
  dropdown: PropTypes.array,
  isDropdown: PropTypes.bool,
  className: PropTypes.string,
};

NavLink.defaultProps = {
  isDropdown: false,
  className: 'text-link font-bold tracking-[.0625em]',
};
