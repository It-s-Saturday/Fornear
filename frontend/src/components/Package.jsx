/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';

import Button from './wrappers/Button';
/**
 *
 * @param {data} Object: Package data used to render component
 * @param {showRequest} Boolean: Request button and quantity shown
 * @returns {JSX.Element} Package
 */
export default function Package({ data, showRequest }) {
  const dataValues = {
    packageName: data.packageName ?? 'Title not found.',
    description: {
      text: data.description ? data.description : 'No Description Provided',
      grayValue: data.description ? '700' : '400',
    },
    quantityAvailable: data.quantityAvailable ?? 0,
    requestCount: data.requests?.length ?? 0,
  };

  return (
    <div className="flex flex-col w-[21rem] h-[28rem] bg-white rounded-2xl shadow-lg p-8">
      <h2 className="font-bold text-xl">{dataValues.packageName}</h2>
      {/* text-gray-700 */}
      {/* text-gray-400 */}
      <h3
        className={`text-gray-${dataValues.description.grayValue} h-[4rem] overflow-ellipsis`}
      >
        {dataValues.description.text}
      </h3>
      <div className="flex flex-col bg-accent-grey p-3 rounded-xl h-[15rem] mb-5">
        {data.selectedItems.map((item) => (
          <span className="font-bold" key={item.itemName}>
            {item.itemCount}
            {'x \t'}
            {item.itemName}
          </span>
        ))}
      </div>
      <Button linkTo={`request/${data._id}`} full>
        REQUEST
      </Button>
    </div>
  );
}

Package.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    packageName: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    selectedItems: PropTypes.arrayOf(
      PropTypes.shape({
        itemName: PropTypes.string.isRequired,
        itemCount: PropTypes.number.isRequired,
      }),
    ).isRequired,
    quantityAvailable: PropTypes.number.isRequired,
    requests: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phoneNumber: PropTypes.string.isRequired,
        pickupDate: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,

  showRequest: PropTypes.bool,
};

Package.defaultProps = {
  showRequest: false,
};
