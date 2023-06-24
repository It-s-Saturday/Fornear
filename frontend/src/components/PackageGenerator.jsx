import React from 'react';
import Package from './Package';
import mockData from '../mockData/packages.json';

export default function PackageGenerator() {
  return (
    <div className="flex flex-row flex-wrap justify-center space-x-10 gap-y-10 align-middle items-center">
      {mockData.map((data) => (
        <Package data={data} forForm={false} />
      ))}
    </div>
  );
}
