import React, { useEffect, useState } from 'react';
import { Table, notification } from 'antd';
import PropTypes from 'prop-types';
import { moment } from 'moment';

/**
 * Shared component for generating a table of unfulfilled, fulfilled, or declined requests.
 * @param {type} String: Query unfulfilled, fulfilled, or declined requests
 * @param {refresh} Boolean: Trigger refresh of data
 * @param {onRefresh} Function: Callback to trigger refresh of other components. See Inventory
 * @returns {JSX.Element} RequestTable
 */
export default function RequestTable({ type, refresh, onRefresh }) {
  const [requestTableData, setRequestTableData] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  // Set first letter to uppercase for usage in column and table titles
  const headerText = type.charAt(0).toUpperCase() + type.slice(1);

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
      sorter: (a, b) =>
        new Date(moment(a.pickupDate, 'YYYY-MM-DD').format('LLL')) -
        new Date(moment(b.pickupDate, 'YYYY-MM-DD').format('LLL')),
    },
    {
      title: 'Date Requested',
      dataIndex: 'requestDate',
      key: 'requestDate',
      sorter: (a, b) =>
        new Date(moment(a.requestDate, 'YYYY-MM-DD').format('LLL')) -
        new Date(moment(b.requestDate, 'YYYY-MM-DD').format('LLL')),
    },
  ];

  if (type !== 'unfulfilled') {
    columns.push({
      title: `${headerText} Date`,
      dataIndex: `date${type[0].toUpperCase() + type.slice(1)}`,
      key: `date${type[0].toUpperCase() + type.slice(1)}`,
      sorter: (a, b) =>
        new Date(moment(a.requestDate, 'YYYY-MM-DD').format('LLL')) -
        new Date(moment(b.requestDate, 'YYYY-MM-DD').format('LLL')),
    });
  }

  useEffect(() => {
    fetch(`/api/get_${type}_requests`)
      .then((res) => res.json())
      .then((data) => {
        const keyAddedData = data.map((item) => ({
          key: item._id,
          ...item,
        }));
        return keyAddedData;
      })
      .then((data) => setRequestTableData(data))
      .catch((err) => {
        api.error({
          message: err.message,
          description: `Unable to get ${type} request data`,
        });
      });
    // eslint-disable-next-line no-sparse-arrays
  }, [, refresh, onRefresh]);

  return (
    <div className="flex flex-col gap-y-5 border border-black rounded-md p-5 bg-gray-100">
      {contextHolder}
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
