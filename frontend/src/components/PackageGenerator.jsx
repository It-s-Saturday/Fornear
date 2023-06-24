import React, { useEffect, useState } from 'react';
import Package from './Package';

export default function PackageGenerator() {
  const [packageData, setPackageData] = useState([]);

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
      {packageData.length > 0
        && packageData.map((data) => <Package data={data} forForm={false} />)}
    </div>
  );
}
