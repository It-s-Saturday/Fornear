import React, { useState } from 'react';
import { Input, notification } from 'antd';
import PropTypes from 'prop-types';

import Button from '../wrappers/Button';

/**
 * Staff view for all unfulfilled requests. Contains modal as well (TODO)
 * @param {onInsert} Function: Callback to trigger refresh of other components. See Inventory
 * @returns {JSX.Element} RequestList
 */
export default function Insert({ onInsert }) {
  const [formData, setFormData] = useState({
    itemName: '',
    itemCount: '',
    category: 'Foodstuff',
  });
  const [api, contextHolder] = notification.useNotification();

  const clearFields = () => {
    setFormData({
      itemName: '',
      itemCount: 0,
      category: formData.category,
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnClick = async (e) => {
    e.preventDefault();
    if (
      formData.itemName === '' ||
      formData.itemCount === '' ||
      formData.category === ''
    ) {
      // alert('Please fill all fields!');
    } else if (!Number.isNaN(Number(formData.itemCount))) {
      try {
        await fetch('/api/insert_item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        onInsert();
        clearFields();
      } catch (err) {
        api.error({
          message: err.message,
          description: 'Cannot able to insert item',
        });
      }
    } else {
      // alert('Please enter a number for item count.');
    }
  };

  return (
    <div className="flex flex-col w-[30rem] h-[fit-content] items-center p-5 border border-black rounded-md bg-gray-100">
      {contextHolder}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Insert an Item</h1>
        <Input
          label="Item Name"
          name="itemName"
          placeholder="Item Name"
          className="input"
          value={formData.itemName}
          onChange={handleInputChange}
          allowClear
        />
        <Input
          type="number"
          label="Item Count"
          name="itemCount"
          placeholder="Item Count"
          className="input"
          value={formData.itemCount}
          onChange={handleInputChange}
        />
        <select
          name="category"
          className="input"
          value={formData.category}
          onChange={handleInputChange}
        >
          <option value="Foodstuff">Foodstuff</option>
          <option value="PersonalCareProduct">Personal Care Product</option>
        </select>
      </div>

      <Button onClick={handleOnClick} linkTo="#">
        Insert Item
      </Button>
    </div>
  );
}

Insert.propTypes = {
  onInsert: PropTypes.func,
};

Insert.defaultProps = {
  onInsert: undefined,
};
