import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function Package(props) {
  const { data, forForm } = props;
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg h-[fit-content]">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          {data.packageName ?? 'Title not found.'}
        </div>
        {data.description ? (
          <p className="text-gray-700 text-base">{data.description}</p>
        ) : (
          <p className="text-gray-300 text-base">No Description Provided</p>
        )}
      </div>
      <div className="flex flex-col px-6 py-4">
        <div className="flex flex-row flex-wrap justify-center items-center">
          <span className="flex flex-col inline-block bg-gray-200 rounded-[5rem] px-10 py-10 text-md font-semibold text-gray-700 mr-2 min-w-[50%] w-[fit-content]">
            {data.selectedItems.map((item) => (
              <span>
                {item.itemCount}
                {'x \t'}
                {item.itemName}
              </span>
            ))}
          </span>
        </div>
      </div>
      {!forForm && (
        <div className="flex items-center px-6 py-4 justify-end">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            {data.quantityAvailable ?? 'Quantity not found.'}
            {' available'}
          </span>
          <Link to={`request/${data.id}`}>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Request
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

Package.propTypes = [
  {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          itemName: PropTypes.string.isRequired,
          itemCount: PropTypes.number.isRequired,
        }),
      ).isRequired,
      quantity: PropTypes.number.isRequired,
    }).isRequired,
  },
  {
    forForm: PropTypes.bool.isRequired,
  },
];
