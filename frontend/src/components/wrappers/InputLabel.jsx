import React from 'react';
import PropTypes from 'prop-types';

export default function InputLabel({ children, label }) {
  return (
    <div>
      <h3>{label}</h3>
      {children}
    </div>
  );
}

InputLabel.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};
