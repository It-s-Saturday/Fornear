import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Button wrapper to style buttons and redirect on click.
 * @param {linkTo} String: Path to redirect on click
 * @param {onClick} Function: Function to run on click
 * @param {className} String: Class override to apply to button
 * @returns {JSX.Element} Button
 */
export default function Button({
  linkTo,
  onClick,
  className,
  children,
  color,
}) {
  const classes =
    className ??
    `${color} hover:bg-accent-blue text-black font-bold py-2 px-4 rounded`;

  return (
    <Link to={linkTo}>
      <button type="button" className={classes} onClick={onClick}>
        {children}
      </button>
    </Link>
  );
}

Button.propTypes = {
  linkTo: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  color: PropTypes.string,
};

Button.defaultProps = {
  linkTo: undefined,
  color: 'bg-primary',
  className: undefined,
  children: undefined,
};
