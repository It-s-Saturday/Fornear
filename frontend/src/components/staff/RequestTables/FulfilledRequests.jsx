import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';

export default function FulfilledRequests({ refresh, onRefresh }) {
  const [fulfilledRequestData, setFulfilledRequestData] = useState([]);

  const columns = [
    {
      title: 'Recipient',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Package Name',
      dataIndex: 'packageName',
      key: 'packageName',
    },
    {
      title: 'Pickup Date',
      dataIndex: 'pickupDate',
      key: 'pickupDate',
    },
  ];

  useEffect(() => {
    fetch('/api/get_fulfilled_requests')
      .then((res) => res.json())
      .then((data) => setFulfilledRequestData(data));
    // eslint-disable-next-line no-sparse-arrays
  }, [, refresh, onRefresh]);

  return (
    <div className="flex flex-col gap-y-5 border border-black rounded-md p-5">
      <h1 className="text-3xl font-bold">Fulfilled Packages</h1>
      <Table dataSource={fulfilledRequestData} columns={columns} />
    </div>
  );
}

FulfilledRequests.propTypes = {
  refresh: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
};
