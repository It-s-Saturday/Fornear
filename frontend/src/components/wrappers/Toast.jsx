import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function Toast({ text, type, timeout }) {
  const [show, setShow] = useState(true);
  const color = type === 'error' ? 'bg-accent-red' : 'bg-accent-blue';

  useEffect(() => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, timeout);
  }, []);

  return (
    show && <div className={`absolute top-0 right-0 p-5 ${color}`}>{text}</div>
  );
}

Toast.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  timeout: PropTypes.number.isRequired,
};
