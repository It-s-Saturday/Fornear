import { Table } from 'antd';
import React, { useEffect, useState } from 'react';

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/admin/get_logs')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
      });
    console.log(logs);
  }, []);

  const columns = [
    // {
    //     title: "User",
    //     dataIndex: "user",
    //     key: "user",
    // },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Payload',
      dataIndex: 'payload',
      key: 'payload',
    },
  ];

  return (
    <div>
      <h1>Logs</h1>
      <Table dataSource={logs} columns={columns} />
    </div>
  );
}
