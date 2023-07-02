import { notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Package from './Package';
import Button from './wrappers/Button';
import Input from './wrappers/Input';

/**
 * Form object for requesting a package
 * @returns {JSX.Element} Request
 */
export default function Request() {
  // Used to redirect to home page
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const redirect = () => {
    navigate('/');
  };

  // Get package ID from URL
  const { _id } = useParams();

  const [packageData, setPackageData] = useState(null);
  const [personalCareProducts, setPersonalCareProducts] = useState([]);

  // Fetch package data by id and personal care products
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
    personalCareProducts: [],
    restrictions: '',
  });

  const handleInputChange = (e) => {
    // Only allow 3 personal care products to be selected
    if (e.target.name === 'personalCareProduct') {
      const checkboxes = document.getElementsByName('personalCareProduct');
      let checkedCount = 0;
      for (let i = 0; i < checkboxes.length; i += 1) {
        if (checkboxes[i].checked) {
          checkedCount += 1;
        }
      }
      // Disable unchecked checkboxes if 3 are checked
      if (checkedCount >= 3) {
        for (let i = 0; i < checkboxes.length; i += 1) {
          if (!checkboxes[i].checked) {
            checkboxes[i].disabled = true;
          }
        }
      } else {
        // Enable all disabled checkboxes
        for (let i = 0; i < checkboxes.length; i += 1) {
          checkboxes[i].disabled = false;
        }
      }
      // Update whether a personal care product is selected in the form data
      if (e.target.checked) {
        setFormData({
          ...formData,
          personalCareProducts: [
            ...formData.personalCareProducts,
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
    // Require all fields
    if (
      formData.name === '' ||
      formData.email === '' ||
      formData.phoneNumber === '' ||
      formData.pickupDate === ''
    ) {
      api.open({
        message: 'Error',
        description:
          'Please fill in all the fields before submitting the form.',
      });
      return;
    }

    // Consolidate data with package data
    const postData = {
      packageId: _id,
      // TODO: Remove packageName and construct aggregate in backend when name is needed
      packageName: packageData.packageName,
      ...formData,
    };
    try {
      await fetch('/api/request_package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      // If post is successful, redirect to home page
      redirect();
    } catch (error) {
      // console.error(error);
    }
  };

  return (
    <div className="flex flex-row flex-wrap justify-center items-center">
      {contextHolder}
      {/* Render the package card on the screen next to the form */}
      {packageData !== null && (
        <Package data={packageData} showRequest={false} />
      )}
      {personalCareProducts.length > 0 && (
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
      )}
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

        <Input label="Restrictions (dietary, allergies, etc.)">
          <input
            type="text"
            name="restrictions"
            placeholder="peanuts, vegan, gluten, etc."
            value={formData.restrictions}
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
