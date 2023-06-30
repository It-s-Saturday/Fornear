import { Table } from 'antd';
import React, { useEffect, useState } from 'react';

/**
 * Displays all insert, update, drop actions
 * @returns {JSX.Element} Logs
 */
export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/admin/get_logs')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
      });
    // console.log(logs);
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
    <div className="flex flex-col items-center w-full">
      <h1 className="text-3xl font-bold">Logs</h1>

      <div className="flex flex-col w-[50%] p-5 border border-black rounded-md">
        <Table dataSource={logs} columns={columns} />
      </div>
    </div>
  );
}
