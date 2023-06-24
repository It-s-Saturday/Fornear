import React, { useState, useEffect } from 'react';

export default function RequestList() {
  const [requestData, setRequestData] = useState([]);

  useEffect(() => {
    fetch('/api/get_requests')
      .then((res) => res.json())
      .then((data) => setRequestData(data));
  }, []);

  const groupedRequests = requestData.reduce((acc, request) => {
    if (!acc[request.packageId]) {
      acc[request.packageId] = [];
    }
    acc[request.packageId].push(request);
    return acc;
  }, {});

  const requestList = Object.keys(groupedRequests).map((packageId) => {
    const request = groupedRequests[packageId];
    return (
      <div key={packageId} className="border-2 border-gray-500 p-2 m-2">
        <span className="font-bold">{request[0].packageName}</span>
        <ul>
          {request.map((r) => (
            <li key={r.id}>
              {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
              {r.name} - {r.email} - {r.phoneNumber} - {r.pickupDate}
            </li>
          ))}
        </ul>
      </div>
    );
  });

  return (
    <div>
      <h1>Request List</h1>
      {requestList}
    </div>
  );
}
