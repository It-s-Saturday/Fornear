import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Package from './Package';

export default function PackageGenerator(props) {
  const { showRequest } = props;
  const [packageData, setPackageData] = useState(null);

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
  }, []);

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold">Published packages</h1>
      <div className="flex flex-row flex-wrap justify-center space-x-10 gap-y-10 align-middle items-center">
        {packageData !== null &&
          packageData.map((data) => (
            <Package data={data} showRequest={showRequest} />
          ))}
      </div>
    </div>
  );
}

PackageGenerator.propTypes = {
  showRequest: PropTypes.bool.isRequired,
};
