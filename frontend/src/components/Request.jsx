// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Package from './Package';
import Input from './Input';

export default function Request() {
  const navigate = useNavigate();
  const redirect = () => {
    navigate('/');
  };
  const { id } = useParams();

  const [packageData, setPackageData] = useState([]);

  useEffect(() => {
    fetch('/api/get_package_by_id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => setPackageData(data));
  }, [id]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    pickupDate: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnClick = async (e) => {
    e.preventDefault();
    console.log(formData.pickupDate);
    if (
      formData.name === ''
      || formData.email === ''
      || formData.phoneNumber === ''
      || formData.pickupDate === ''
    ) {
      alert('Please fill out all fields');
      return;
    }
    const postData = {
      packageId: id,
      packageName: packageData.title,
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      pickupDate: formData.pickupDate,
    };

    try {
      await fetch('/api/request_package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      redirect();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-row flex-wrap justify-center items-center">
      {/* eslint-disable-next-line react/jsx-boolean-value */}
      <Package data={packageData} forForm={true} />
      <form className="flex flex-col px-6 py-4">
        <Input label="Name">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Input>
        <Input label="Email">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Input>
        <Input label="Phone Number">
          <input
            type="text"
            name="phoneNumber"
            placeholder="###-###-####"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </Input>
        <Input label="Requested Pickup Date">
          <input
            type="date"
            name="pickupDate"
            placeholder="Date"
            value={formData.pickupDate}
            onChange={handleInputChange}
            required
          />
        </Input>

        <button
          type="submit"
          className="bg-accent-blue hover:bg-secondary text-white hover:text-black font-bold py-2 px-4 rounded mt-5"
          onClick={(e) => handleOnClick(e)}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
