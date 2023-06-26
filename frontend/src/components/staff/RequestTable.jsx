import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';

export default function RequestTable({ type, refresh, onRefresh }) {
  const [requestTableData, setRequestTableData] = useState([]);

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
      title: 'Requested Pickup Date',
      dataIndex: 'pickupDate',
      key: 'pickupDate',
    },
  ];

  const headerText = type.charAt(0).toUpperCase() + type.slice(1);

  if (type !== 'unfulfilled') {
    columns.push({
      title: `${headerText} Date`,
      dataIndex: `date_${type}`,
      key: `date_${type}`,
    });
  }

  useEffect(() => {
    fetch(`/api/get_${type}_requests`)
      .then((res) => res.json())
      .then((data) => setRequestTableData(data));
    // eslint-disable-next-line no-sparse-arrays
  }, [, refresh, onRefresh]);

  return (
    <div className="flex flex-col gap-y-5 border border-black rounded-md p-5 bg-gray-100">
      <h1 className="text-3xl font-bold">{headerText} Packages</h1>
      <Table dataSource={requestTableData} columns={columns} />
    </div>
  );
}

RequestTable.propTypes = {
  type: PropTypes.string.isRequired,
  refresh: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
};
