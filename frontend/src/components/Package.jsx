import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function Package(props) {
  const { data, showRequest } = props;
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
      {showRequest ? (
        <div className="flex items-center px-6 py-4 justify-end">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            {data.quantityAvailable ?? '0'}
            {' available'}
          </span>
          <Link to={`request/${data._id}`}>
            <button
              type="button"
              className="bg-primary hover:bg-accent-blue text-black font-bold py-2 px-4 rounded"
            >
              {/* TODO: Disable button if quantityAvailable < 1 */}
              Request
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex items-center px-6 py-4 justify-end">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            {data.requests ? data.requests.length : '0'}
            {' requested'}
          </span>
        </div>
      )}
    </div>
  );
}

Package.propTypes = [
  {
    data: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          itemName: PropTypes.string.isRequired,
          itemCount: PropTypes.number.isRequired,
        }),
      ).isRequired,
      quantity: PropTypes.number.isRequired,
      requests: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          email: PropTypes.string.isRequired,
          phoneNumber: PropTypes.string.isRequired,
          pickupDate: PropTypes.string.isRequired,
        }),
      ),
    }).isRequired,
  },
  {
    forForm: PropTypes.bool.isRequired,
  },
];
