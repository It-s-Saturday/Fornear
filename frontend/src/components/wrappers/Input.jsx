import PropTypes from 'prop-types';
import React from 'react';

/**
 * Input wrapper to label and style form fields.
 * @param {children} Node: Field to wrap
 * @param {label} String: Label for field
 * @returns
 */
export default function Input({ children, label }) {
  return (
    <div className="flex flex-col inline-block text-md font-semibold text-gray-700 my-5">
      {label}
      {children}
    </div>
  );
}

Input.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
};

Input.defaultProps = {
  children: undefined,
  label: undefined,
};
