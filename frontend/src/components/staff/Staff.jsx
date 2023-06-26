import React, { useState } from 'react';

import Insert from './Insert';
import Inventory from './Inventory';
import CreatePackage from './CreatePackage';
import PackageGenerator from '../PackageGenerator';
import RequestList from './RequestList';
import RequestTable from './RequestTable';
import Update from './Update';

export default function Staff() {
  const [refreshInventory, setRefreshInventory] = useState(false);
  const [refreshCreatePackage, setRefreshCreatePackage] = useState(false);
  const [refreshUpdatePackage, setRefreshUpdatePackage] = useState(false);
  const [refreshRequestList, setRefreshRequestList] = useState(false);
  const [refreshRequests, setRefreshRequests] = useState(false);

  const handleRefresh = () => {
    setRefreshInventory(false);
    setRefreshCreatePackage(false);
    setRefreshUpdatePackage(false);
    setRefreshRequests(false);
  };

  const handleInsert = () => {
    setRefreshInventory(true);
    setRefreshCreatePackage(true);
    setRefreshUpdatePackage(true);
  };

  const handleUpdate = () => {
    setRefreshInventory(true);
    setRefreshUpdatePackage(true);
    setRefreshCreatePackage(true);
    setRefreshRequests(true);
    setRefreshRequestList(true);
    // to all my mentors... look away x_x
    setTimeout(() => {
      setRefreshUpdatePackage(false);
      setRefreshRequests(false);
      setRefreshRequestList(false);
    }, 100);
  };

  return (
    <>
      <div className="flex flex-row w-full h-max-[10rem] p-5 space-x-10 overflow-y-scroll justify-center">
        <Update refresh={refreshUpdatePackage} onRefresh={handleUpdate} />
      </div>
      <div className="flex flex-row w-full h-max-[10rem] p-5 space-x-10 overflow-y-scroll justify-center">
        {['unfulfilled', 'fulfilled', 'declined'].map((tableType) => (
          <RequestTable
            refresh={refreshRequests}
            onRefresh={handleRefresh}
            type={tableType}
          />
        ))}
      </div>
      {/* TODO: Implement better way of handling onRefresh for each component */}
      <RequestList refresh={refreshRequestList} onRefresh={handleUpdate} />{' '}
      <div className="flex flex-row w-full min-h-[30rem] h-[fit-content] p-5 space-x-10 overflow-y-scroll">
        <Insert onInsert={handleInsert} />
        <CreatePackage
          refresh={refreshCreatePackage}
          onRefresh={handleRefresh}
        />
        <Inventory refresh={refreshInventory} onRefresh={handleRefresh} />
      </div>
      <div className="flex flex-row w-full h-max-[10rem] p-5 space-x-10 overflow-y-scroll justify-center">
        <PackageGenerator showRequest={false} />
      </div>
    </>
  );
}
