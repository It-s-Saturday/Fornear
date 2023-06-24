import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from '../Input';

export default function Insert({ onInsert }) {
  const [formData, setFormData] = useState({
    itemName: '',
    itemCount: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnClick = async (e) => {
    e.preventDefault();
    const postData = {
      itemName: formData.itemName,
      itemCount: formData.itemCount,
    };

    try {
      await fetch('/api/insert_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      onInsert();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex flex-col w-[30rem] items-center p-5 border border-black">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Insert an Item</h1>
        <Input label="Item Name">
          <input
            type="text"
            name="itemName"
            placeholder="Item Name"
            className="border-2 border-black rounded-md p-2 m-2"
            onChange={handleInputChange}
          />
        </Input>
        <Input label="Item Count">
          <input
            type="number"
            name="itemCount"
            placeholder="Item Count"
            className="border-2 border-black rounded-md p-2 m-2"
            onChange={handleInputChange}
          />
        </Input>
      </div>
      <button
        type="button"
        className="bg-primary hover:bg-accent-blue text-black font-bold py-2 px-4 rounded"
        onClick={handleOnClick}
      >
        Insert Item
      </button>
    </div>
  );
}

Insert.propTypes = {
  onInsert: PropTypes.func.isRequired,
};
