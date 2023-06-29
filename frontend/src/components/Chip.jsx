import React from 'react';
import PropTypes from 'prop-types';

export default function Chip(props) {
  const { label } = props;

  return (
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
      {label}
    </span>
  );
}

Chip.propTypes = {
  label: PropTypes.string.isRequired,
};
