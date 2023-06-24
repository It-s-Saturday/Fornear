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
    <div className="flex flex-row flex-wrap justify-center space-x-10 gap-y-10 align-middle items-center">
      {packageData !== null &&
        packageData.map((data) => (
          <Package data={data} showRequest={showRequest} />
        ))}
    </div>
  );
}

PackageGenerator.propTypes = {
  showRequest: PropTypes.bool.isRequired,
};
