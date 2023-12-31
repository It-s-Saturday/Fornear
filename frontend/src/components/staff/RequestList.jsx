import React, { useState, useEffect } from 'react';
import { Modal, notification } from 'antd';
import PropTypes from 'prop-types';

import Button from '../wrappers/Button';

/**
 * Staff view for all unfulfilled requests. Contains modal as well (TODO)
 * @param {refresh} Boolean: Trigger refresh of data
 * @param {onRefresh} Function: Callback to trigger refresh of other components. See Inventory
 * @returns {JSX.Element} RequestList
 */
export default function RequestList({ refresh, onRefresh }) {
  const [requestData, setRequestData] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPersonalCareProducts, setCurrentPersonalCareProducts] =
    useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [packageData, setPackageData] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetch('/api/get_requests')
      .then((res) => res.json())
      .then((data) => setRequestData(data))
      .catch((err) => {
        api.error({
          message: err.message,
          description: 'Unable to get requests',
        });
      });
    // eslint-disable-next-line no-sparse-arrays
  }, [, refresh, onRefresh]);

  // When modal is opened, fetch packageData of associated source Request via packageId
  useEffect(() => {
    if (selectedRequest === null) return;
    fetch('/api/get_package_by_id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: selectedRequest.packageId }),
    })
      .then((res) => res.json())
      .then((data) => setPackageData(data))
      .catch((err) => {
        api.error({
          message: err.message,
          description: `Unable to get package with _id: ${selectedRequest.packageId}`,
        });
      });
    // TODO: Better way of storing this data to reduce DB calls
    fetch('/api/get_personal_care_products_by_request_id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: selectedRequest?._id }),
    })
      .then((res) => res.json())
      .then((data) => setCurrentPersonalCareProducts(data))
      .catch((err) => {
        api.error({
          message: err.message,
          description: `Unable to get this request's personal care products`,
        });
      });
  }, [selectedRequest]);

  // Set data to request and render, then open modal
  const handleRequestClicked = (request) => {
    setSelectedRequest(request);
    setPackageData(requestData.find((item) => item._id === request.packageId));
    setModalOpen(true);
  };

  const handleFulfillClicked = () => {
    fetch('/api/fulfill_request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: selectedRequest?._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'error') {
          api.open({
            message: 'Error',
            description: `${data.message}`,
          });
        } else {
          onRefresh();
          setModalOpen(false);
        }
      })
      .catch((err) => {
        api.error({
          message: err.message,
          description: 'Unable to fulfill the request',
        });
      });
  };

  const handleDeclineClicked = () => {
    fetch('/api/decline_request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: selectedRequest?._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'error') {
          api.open({
            message: 'Error',
            description: `${data.message}`,
          });
        } else {
          onRefresh();
          setModalOpen(false);
        }
      })
      .catch((err) => {
        api.error({
          message: err.message,
          description: 'Unable to decline request',
        });
      });
  };

  const modal = (
    <Modal
      title="Request Details"
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      footer={null}
    >
      <div className="flex gap-y-5 gap-x-5 justify-center">
        <div>
          <div className="flex flex-col mb-5">
            <h2 className="text-2xl font-bold">Recipient</h2>
            <p>Name: {selectedRequest?.name}</p>
            <p>Email: {selectedRequest?.email}</p>
            <p>Phone Number: {selectedRequest?.phoneNumber}</p>
            <p>Pickup Date: {selectedRequest?.pickupDate}</p>
            {selectedRequest?.restrictions && (
              <p className="text-accent-red">
                Restrictions: {selectedRequest.restrictions}
              </p>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Package Contents</h2>
            <h3 className="text-lg">{packageData?.packageName}</h3>
            <p>{packageData?.description}</p>
            <span>
              {packageData?.selectedItems?.map((content) => (
                <p key={content.itemName}>
                  {content.itemCount}x {content.itemName}
                </p>
              ))}
            </span>
          </div>
          {currentPersonalCareProducts && (
            <>
              <h2 className="mt-5 text-2xl font-bold">
                Personal Care Products
              </h2>
              {currentPersonalCareProducts.map((content) => (
                <p>1x {content}</p>
              ))}
            </>
          )}
        </div>
        <span className="flex flex-col justify-end">
          <Button onClick={handleFulfillClicked} linkTo="/staff">
            Fulfill
          </Button>
          <Button
            onClick={handleDeclineClicked}
            linkTo="/staff"
            color="bg-accent-red"
          >
            Decline
          </Button>
        </span>
      </div>
    </Modal>
  );

  const requestList = requestData.map((request) => {
    const { requests } = request;
    return (
      <div key={request._id}>
        {modalOpen && modal}
        {contextHolder}
        <div className="rounded overflow-hidden px-6 py-4 bg-white shadow-lg">
          <h2 className="text-2xl font-bold">{request.packageName}</h2>
          <div className="flex gap-x-10">
            {requests.map((req) => (
              <Button
                key={req._id}
                className="flex flex-col inline-block bg-gray-200 hover:bg-gray-300 rounded-[5rem] px-10 py-10 text-md font-semibold text-gray-700 mr-2 w-[fit-content]"
                onClick={() => handleRequestClicked(req)}
              >
                <div id={req._id}>
                  <p>Name: {req.name}</p>
                  <p>Email: {req.email}</p>
                  <p>Phone Number: {req.phoneNumber}</p>
                  <p>Pickup Date: {req.pickupDate}</p>
                  {req.restrictions && (
                    <p className="text-accent-red">
                      Restrictions: {req.restrictions}
                    </p>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  });
  return (
    <div className="flex flex-col w-min-[30rem] h-[fit-content] items-center p-5 border border-black bg-gray-100">
      <h1 className="text-3xl font-bold">Request List</h1>
      {requestList.length > 0 ? (
        requestList
      ) : (
        <p className="text-2xl">No requests to show</p>
      )}
    </div>
  );
}

RequestList.propTypes = {
  refresh: PropTypes.bool,
  onRefresh: PropTypes.func,
};

RequestList.defaultProps = {
  refresh: false,
  onRefresh: undefined,
};
