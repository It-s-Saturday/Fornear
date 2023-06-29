import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Package from './Package';

/**
 * Displays all packages
 * @param {showRequest} Boolean: Request button and quantity shown
 * @returns {JSX.Element} PackageGenerator
 */
export default function PackageGenerator(props) {
  const { showRequest } = props;
  const [packageData, setPackageData] = useState(null);
  const [requestData, setRequestData] = useState(null);

  // https://stackoverflow.com/a/55642683/14879329
  const leftJoin = (objArr1, objArr2, key1, key2) =>
    objArr1.map((anObj1) => ({
      ...objArr2.find((anObj2) => anObj1[key1] === anObj2[key2]),
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
      });

    fetch('/api/get_requests')
      .then((res) => res.json())
      .then((data) => {
        const dataWithKey = data.map((item, index) => ({
          ...item,
          key: index,
        }));
        setRequestData(dataWithKey);
      });
  }, []);

  let mergedData = null;

  if (packageData !== null && requestData !== null) {
    mergedData = leftJoin(packageData, requestData, '_id', '_id');
  }

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold">Published packages</h1>
      <div className="flex flex-row flex-wrap justify-center space-x-10 gap-y-10 align-middle items-center">
        {mergedData !== null &&
          mergedData.map((data) => (
            <Package data={data} showRequest={showRequest} />
          ))}
      </div>
    </div>
  );
}

PackageGenerator.propTypes = {
  showRequest: PropTypes.bool.isRequired,
};
