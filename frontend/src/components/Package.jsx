import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

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
      text: data.description ?? 'No Description Provided',
      grayValue: data.description ? '700' : '300',
    },
    quantityAvailable: data.quantityAvailable ?? 0,
    requestCount: data.requests ?? 0,
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg h-[fit-content] bg-white">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{dataValues.packageName}</div>
        <p
          className={`text-gray-${dataValues.description.grayValue} text-base`}
        >
          {dataValues.description.text}
        </p>
      </div>
      <div className="flex flex-col px-6 py-4">
        <div className="flex flex-row flex-wrap justify-center items-center">
          <span className="flex flex-col inline-block bg-gray-200 rounded-[5rem] px-10 py-10 text-md font-semibold text-gray-700 mr-2 min-w-[50%] w-[fit-content]">
            {data.selectedItems.map((item) => (
              <span key={item.itemCount + item.itemName}>
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
            {`${dataValues.quantityAvailable} available`}
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
            {`${dataValues.requestCount} requests`}
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
