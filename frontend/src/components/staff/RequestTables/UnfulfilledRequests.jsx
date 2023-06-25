import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';

export default function UnfulfilledRequests({ refresh, onRefresh }) {
  const [unfulfilledRequestData, setUnfulfilledRequestData] = useState([]);

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
    fetch('/api/get_unfulfilled_requests')
      .then((res) => res.json())
      .then((data) => setUnfulfilledRequestData(data));
    // eslint-disable-next-line no-sparse-arrays
  }, [, refresh, onRefresh]);

  return (
    <div className="flex flex-col gap-y-5">
      <h1 className="text-3xl font-bold">Unfulilled Packages</h1>
      <Table dataSource={unfulfilledRequestData} columns={columns} />
    </div>
  );
}

UnfulfilledRequests.propTypes = {
  refresh: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
};
