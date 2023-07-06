import React from 'react';
import PropTypes from 'prop-types';

export default function SectionTitle({ text }) {
  return (
    <div className="flex text-5xl items-end font-bold h-[10rem] bg-light-grey pb-10 pl-[8vw] mb-20">
      {text}
    </div>
  );
}

SectionTitle.propTypes = {
  text: PropTypes.string.isRequired,
};
