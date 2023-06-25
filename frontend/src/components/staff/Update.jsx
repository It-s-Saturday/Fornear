import React, { useState, useEffect } from 'react';

import { Select } from 'antd';

export default function Update() {
  // TODO: Finish this component
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    fetch('/api/get_inventory')
      .then((res) => res.json())
      .then((data) => {
        const dataWithKey = data.map((item, index) => ({
          ...item,
          key: index,
        }));
        setInventoryData(dataWithKey);
      });
  }, []);

  const { Option } = Select;

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <div className="flex flex-col w-[30rem] h-[fit-content] items-center p-5 border border-black">
      <Select
        defaultValue="Select Item"
        style={{ width: 120 }}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={handleChange}
      >
        {inventoryData.map((item) => (
          <Option value={item._id}>{item.itemName}</Option>
        ))}
      </Select>
      {}
    </div>
  );
}
