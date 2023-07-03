import React, { useState } from 'react';

import Insert from './Insert';
import CreatePackage from './CreatePackage';
import PackageGenerator from '../PackageGenerator';
import RequestList from './RequestList';
import RequestTable from './RequestTable';
import Update from './Update';
import FullTable from './FullTable';

/**
 * Complete layout of all Staff tools.
 * @returns {JSX.Element} Staff
 */
export default function Staff() {
  const [refreshInventory, setRefreshInventory] = useState(false);
  const [refreshCreatePackage, setRefreshCreatePackage] = useState(false);
  const [refreshUpdatePackage, setRefreshUpdatePackage] = useState(false);
  const [refreshRequestList, setRefreshRequestList] = useState(false);
  const [refreshRequests, setRefreshRequests] = useState(false);
  // TODO: Test if single function can be used to trigger all refreshes
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

  // Trigger useEffect update in Inventory, Update, Create, Requests, and RequestList
  const handleUpdate = () => {
    setRefreshInventory(true);
    setRefreshUpdatePackage(true);
    setRefreshCreatePackage(true);
    setRefreshRequests(true);
    setRefreshRequestList(true);

    // Terminate refresh trigger after 100ms
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
            key={tableType}
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
        <div className="flex flex-col w-[50%] p-5 border border-black rounded-md bg-gray-100">
          <FullTable refresh={refreshInventory} onRefresh={handleRefresh} />
        </div>
      </div>
      <div className="flex flex-row w-full h-max-[10rem] p-5 space-x-10 overflow-y-scroll justify-center">
        <PackageGenerator showRequest={false} />
      </div>
    </>
  );
}
