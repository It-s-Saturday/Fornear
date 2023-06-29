// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Package from './Package';
import Input from './wrappers/Input';
import Button from './wrappers/Button';

/**
 * Form object for requesting a package
 * @returns {JSX.Element} Request
 */
export default function Request() {
  const navigate = useNavigate();
  const redirect = () => {
    navigate('/');
  };

  const { _id } = useParams();

  const [packageData, setPackageData] = useState(null);
  const [personalCareProducts, setPersonalCareProducts] = useState([]);

  useEffect(() => {
    fetch('/api/get_package_by_id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id }),
    })
      .then((res) => res.json())
      .then((data) => setPackageData(data));

    fetch('/api/get_personal_care_products')
      .then((res) => res.json())
      .then((data) => setPersonalCareProducts(data));
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    pickupDate: '',
    selectedPersonalCareProducts: [],
  });

  const handleInputChange = (e) => {
    if (e.target.name === 'personalCareProduct') {
      const checkboxes = document.getElementsByName('personalCareProduct');
      let checkedCount = 0;
      for (let i = 0; i < checkboxes.length; i += 1) {
        if (checkboxes[i].checked) {
          checkedCount += 1;
        }
      }
      if (checkedCount >= 3) {
        for (let i = 0; i < checkboxes.length; i += 1) {
          if (!checkboxes[i].checked) {
            checkboxes[i].disabled = true;
          }
        }
      } else {
        for (let i = 0; i < checkboxes.length; i += 1) {
          checkboxes[i].disabled = false;
        }
      }
      if (e.target.checked) {
        setFormData({
          ...formData,
          selectedPersonalCareProducts: [
            ...formData.selectedPersonalCareProducts,
            e.target.value,
          ],
        });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleOnClick = async (e) => {
    e.preventDefault();
    if (
      formData.name === '' ||
      formData.email === '' ||
      formData.phoneNumber === '' ||
      formData.pickupDate === ''
    ) {
      // alert('Please fill out all fields');
      return;
    }
    const postData = {
      packageId: _id,
      packageName: packageData.packageName,
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      pickupDate: formData.pickupDate,
      personalCareProducts: formData.selectedPersonalCareProducts,
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
      // console.error(error);
    }
  };

  return (
    <div className="flex flex-row flex-wrap justify-center items-center">
      <Package data={packageData} showRequest={true} />
      <Input label="Choose 3 Personal Care Products">
        <div className="flex flex-col flex-wrap justify-center">
          {personalCareProducts.map((product) => (
            <div key={product._id} className="flex flex-row">
              <input
                type="checkbox"
                name="personalCareProduct"
                value={product._id}
                onChange={handleInputChange}
              />
              <p className="ml-2">x1 {product.itemName}</p>
              {/* TODO: Add quantity selector */}
            </div>
          ))}
        </div>
      </Input>
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

        <Button linkTo="/" onClick={(e) => handleOnClick(e)}>
          Submit
        </Button>
      </form>
    </div>
  );
}
