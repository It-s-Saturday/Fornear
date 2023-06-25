import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

export default function DeclinedRequests() {
  const [declinedRequestData, setDeclinedRequestData] = useState([]);

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
    fetch('/api/get_declined_requests')
      .then((res) => res.json())
      .then((data) => setDeclinedRequestData(data));
  }, []);

  return (
    <div className="flex flex-col gap-y-5">
      <h1 className="text-3xl font-bold">Declined Packages</h1>
      <Table dataSource={declinedRequestData} columns={columns} />
    </div>
  );
}
