import React, { useState } from 'react';

import Insert from './Insert';
import Inventory from './Inventory';
import CreatePackage from './CreatePackage';
import PackageGenerator from '../PackageGenerator';
import RequestList from './RequestList';
import FulfilledRequests from './RequestTables/FulfilledRequests';
import UnfulfilledRequests from './RequestTables/UnfulfilledRequests';
import DeclinedRequests from './RequestTables/DeclinedRequests';
import Update from './Update';

export default function Staff() {
  const [refreshInventory, setRefreshInventory] = useState(false);
  const [refreshCreatePackage, setRefreshCreatePackage] = useState(false);

  const handleInsert = () => {
    setRefreshInventory(true);
    setRefreshCreatePackage(true);
  };

  const handleRefresh = () => {
    setRefreshInventory(false);
    setRefreshCreatePackage(false);
  };

  return (
    <>
      <Update />
      <div className="flex flex-row w-full min-h-[30rem] h-[fit-content] p-5 space-x-10 overflow-y-scroll justify-center">
        <UnfulfilledRequests />
        <FulfilledRequests />
        <DeclinedRequests />
      </div>
      <RequestList />
      <div className="flex flex-row w-full min-h-[30rem] h-[fit-content] p-5 space-x-10 overflow-y-scroll">
        <Insert onInsert={handleInsert} />
        <CreatePackage
          refresh={refreshCreatePackage}
          onRefresh={handleRefresh}
        />
        <Inventory refresh={refreshInventory} onRefresh={handleRefresh} />
      </div>
      <PackageGenerator showRequest={false} />
    </>
  );
}
