import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

export default function FulfilledRequests() {
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
  }, []);

  return (
    <div className="flex flex-col gap-y-5">
      <h1 className="text-3xl font-bold">Fulfilled Packages</h1>
      <Table dataSource={fulfilledRequestData} columns={columns} />
    </div>
  );
}
