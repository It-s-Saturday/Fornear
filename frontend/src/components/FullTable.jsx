import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

export default function FullTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((res) => setData(res));
  });

  const columns = [
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
  ];

  return (
    <>
      <h1>Table</h1>
      <Table dataSource={data} columns={columns} />
    </>
  );
}
