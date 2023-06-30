import { Checkbox, Table, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Input from '../wrappers/Input';

/**
 * Create package component, with item and quantity inputs
 * @param {refresh} Boolean: Trigger refresh of data
 * @param {onRefresh} Function: Callback to trigger refresh of other components. See Inventory
 * @returns {JSX.Element} CreatePackage
 */
export default function CreatePackage({ refresh, onRefresh }) {
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(true);
  const [inventoryData, setInventoryData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [formData, setFormData] = useState({
    packageName: '',
    author: '',
    description: '',
  });

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Update selectedItems with the selected item's associated quantity (TODO: util)
  const handleItemCountChange = (itemName, newQuantity) => {
    const newSelectedItems = selectedItems.map((item) => {
      if (item.itemName === itemName) {
        return {
          ...item,
          itemCount: newQuantity,
        };
      }
      return item;
    });
    setSelectedItems(newSelectedItems);
  };

  // Return whether itemName is already in selectedItems (TODO: util)
  const isInSelectedItems = (itemName) =>
    selectedItems.some((item) => item.itemName === itemName);

  const handleCheckboxChange = (itemName, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, { itemName, itemCount: 1 }]);
    } else {
      setSelectedItems(
        selectedItems.filter((item) => item.itemName !== itemName),
      );
    }
  };
  // TODO (util)
  const inventoryListWithCheckbox = inventoryData.map((item) => ({
    ...item,
    checkbox: (
      <Checkbox
        key={item._id}
        checked={isInSelectedItems(item.itemName)}
        onChange={(e) => handleCheckboxChange(item.itemName, e.target.checked)}
      />
    ),
  }));

  useEffect(() => {
    fetch('/api/get_inventory')
      .then((res) => res.json())
      .then((data) => {
        const dataWithKey = data.map((item, index) => ({
          ...item,
          key: index,
        }));
        setInventoryData(dataWithKey);
        setLoading(false);
      });
    // eslint-disable-next-line no-sparse-arrays
  }, [, refresh, onRefresh]);

  const columns = [
    {
      title: 'Item',
      dataIndex: 'itemName',
      key: 'itemName',
      sorter: (a, b) => a.itemName.localeCompare(b.itemName),
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
    {
      title: 'Select',
      dataIndex: 'checkbox',
      key: 'checkbox',
    },
  ];

  // Calculate the number of packages that can be created with current count of each selected item
  const getMaxPackages = () =>
    Math.min(
      /*  return the minimum integer from an array of integers,
      where each integer is based on each item "i" in selectedItems, such that:
        i's itemCount in its inventory document,
        divided by
        i's itemCount in selectedItems
      */
      ...selectedItems.map((item) => {
        const inventoryItem = inventoryData.find(
          (invItem) => invItem.itemName === item.itemName,
        );
        return Math.floor(inventoryItem.itemCount / item.itemCount);
      }),
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.packageName === '' || formData.author === '') {
      api.open({
        message: 'Error',
        description:
          'Please fill in all the fields before submitting the form.',
      });
      return;
    }
    const postData = {
      ...formData,
      selectedItems,
      quantityAvailable: getMaxPackages(),
    };
    try {
      await fetch('/api/create_package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      api.open({
        message: 'Success',
        description: 'Package successfully created.',
      });
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <div className="flex flex-col w-[fit-content] px-10 border border-black rounded-md gap-x-10 items-center justify-center bg-gray-100">
      {contextHolder}
      <h1 className="text-3xl font-bold">Package Creator</h1>
      <div>
        <Input label="Package Name">
          <input
            type="text"
            name="packageName"
            value={formData.packageName}
            onChange={handleFormInputChange}
          />
        </Input>
        <Input label="Author">
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleFormInputChange}
          />
        </Input>
        <Input label="Description">
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleFormInputChange}
          />
        </Input>
        <Table
          className="table table-striped"
          dataSource={inventoryListWithCheckbox}
          columns={columns}
          loading={loading}
          onRow={(record) => ({
            onClick: () => {
              handleCheckboxChange(
                record.itemName,
                !isInSelectedItems(record.itemName),
              );
            },
          })}
          // eslint-disable-next-line react/jsx-boolean-value
          pagination={{
            defaultPageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '25', '50', '100'],
          }}
        />
      </div>
      <div>
        <div>
          {selectedItems.map((item) => (
            <Input key={item.itemName} label={item.itemName}>
              <input
                type="number"
                name="quantity"
                value={item.itemCount}
                onChange={(e) => {
                  if (e.target.value < 1) {
                    return;
                  }
                  handleItemCountChange(item.itemName, e.target.value);
                }}
              />
            </Input>
          ))}
        </div>
        {selectedItems.length > 0 && (
          <p className="text-xl">
            You can make up to: <b>{getMaxPackages()}</b> packages.
          </p>
        )}
        {selectedItems.length > 0 && getMaxPackages() > 0 && (
          <button
            type="button"
            className="bg-primary hover:bg-accent-blue text-black font-bold py-2 px-4 rounded align-center"
            onClick={handleSubmit}
          >
            Create Package
          </button>
        )}
      </div>
    </div>
  );
}

CreatePackage.propTypes = {
  refresh: PropTypes.bool,
  onRefresh: PropTypes.func,
};

CreatePackage.defaultProps = {
  refresh: false,
  onRefresh: () => {},
};
