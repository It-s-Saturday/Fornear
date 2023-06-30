import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import Input from '../wrappers/Input';

/**
 * Antd table of complete inventory
 * @param {refresh} Boolean: Trigger refresh of data
 * @param {onRefresh} Function: Callback to trigger refresh of other components. See Inventory
 * @returns {JSX.Element} FullTable
 */
export default function FullTable({ refresh, onRefresh }) {
  const [inventoryData, setInventoryData] = useState([]);
  const [viewData, setViewData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get_inventory')
      .then((res) => res.json())
      .then((data) => {
        const dataWithKey = data.map((item, index) => ({
          ...item,
          key: index,
        }));
        setInventoryData(dataWithKey);
        setViewData(dataWithKey);
        setLoading(false);
      });
    // eslint-disable-next-line no-sparse-arrays
  }, [, refresh, onRefresh]);

  const handleSearchChange = (e) => {
    const { value } = e.target;
    // Filter inventoryData to show items whose name includes the searchbox contents
    const filteredData = inventoryData.filter((item) =>
      item.itemName.toLowerCase().includes(value.toLowerCase()),
    );
    setViewData(filteredData);
  };

  const columns = [
    {
      title: 'Item',
      dataIndex: 'itemName',
      key: 'itemName',
      sorter: (a, b) => a.itemName.localeCompare(b.itemName),
      filterSearch: true,
      onfilter: (value, record) => record.itemName.includes(value),
    },
    {
      title: 'Quantity',
      dataIndex: 'itemCount',
      key: 'itemCount',
      sorter: (a, b) => a.itemCount - b.itemCount,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        {
          text: 'Foodstuff',
          value: 'Foodstuff',
        },
        {
          text: 'Personal Care Product',
          value: 'PersonalCareProduct',
        },
      ],
      onFilter: (value, record) => record.category.includes(value),
    },
  ];

  return (
    <>
      {loading && <h1>Please wait...</h1>}
      <h1 className="text-3xl font-bold text-center">Inventory</h1>
      <Input placeholder="Search for an item">
        <input
          type="text"
          className="w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Search for an item"
          name="search"
          onChange={handleSearchChange}
        />
      </Input>

      <Table
        dataSource={viewData}
        columns={columns}
        loading={loading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30'],
        }}
      />
    </>
  );
}

FullTable.propTypes = {
  refresh: PropTypes.bool,
  onRefresh: PropTypes.func,
};

FullTable.defaultProps = {
  refresh: false,
  onRefresh: () => {},
};
