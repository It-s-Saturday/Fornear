import React, { useState, useEffect } from 'react';
import Button from '../wrappers/Button';

export default function RequestList() {
  const [requestData, setRequestData] = useState([]);

  useEffect(() => {
    fetch('/api/get_requests')
      .then((res) => res.json())
      .then((data) => setRequestData(data));
  }, []);

  const requestList = requestData.map((request) => {
    const { requests } = request;
    return (
      <div className="rounded overflow-hidden px-6 py-4">
        <h2 className="text-2xl font-bold">{request.packageName}</h2>
        <div className="flex gap-x-10">
          {requests.map((req) => (
            <Button className="flex flex-col inline-block bg-gray-200 hover:bg-gray-300 rounded-[5rem] px-10 py-10 text-md font-semibold text-gray-700 mr-2 w-[fit-content]">
              <p>Name: {req.name}</p>
              <p>Email: {req.email}</p>
              <p>Phone Number: {req.phoneNumber}</p>
              <p>Pickup Date: {req.pickupDate}</p>
            </Button>
          ))}
        </div>
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
