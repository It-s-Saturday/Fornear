import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { notification } from 'antd';
import Package from './Package';
import SectionTitle from './SectionTitle';

/**
 * Displays all packages
 * @param {showRequest} Boolean: Request button and quantity shown
 * @returns {JSX.Element} PackageGenerator
 */
export default function PackageGenerator({ showRequest }) {
  const [packageData, setPackageData] = useState(null);
  const [requestData, setRequestData] = useState(null);
  const [api, contextHolder] = notification.useNotification();

  /**
   * https://stackoverflow.com/a/55642683/14879329
   * Produces all records from packages and requests where the _id matches
   * @param {packages} Array: alias for packageData
   * @param {requests} Array: alias for requestData
   */
  const leftJoin = (packages, requests) =>
    packages.map((anObj1) => ({
      ...requests.find((anObj2) => anObj1._id === anObj2._id),
      ...anObj1,
    }));

  useEffect(() => {
    fetch('/api/get_packages')
      .then((res) => res.json())
      .then((data) => {
        const dataWithKey = data.map((item, index) => ({
          ...item,
          key: index,
        }));
        setPackageData(dataWithKey);
      })
      .catch((err) => {
        api.error({
          message: err.message,
          description: 'Unable to get package data',
        });
      });

    fetch('/api/get_requests')
      .then((res) => res.json())
      .then((data) => {
        const dataWithKey = data.map((item, index) => ({
          ...item,
          key: index,
        }));
        setRequestData(dataWithKey);
      })
      .catch((err) => {
        api.error({
          message: err.message,
          description: 'Unable to get request data',
        });
      });
  }, []);

  let mergedData = null;

  if (packageData !== null && requestData !== null) {
    mergedData = leftJoin(packageData, requestData);
  }

  return (
    <>
      {contextHolder}
      <SectionTitle text="Available Packages" />
      <div className="flex justify-center">
        <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-20">
          {mergedData !== null &&
            mergedData.map((data) => (
              <Package key={data._id} data={data} showRequest={showRequest} />
            ))}
        </div>
      </div>
    </>
  );
}

PackageGenerator.propTypes = {
  showRequest: PropTypes.bool.isRequired,
};
