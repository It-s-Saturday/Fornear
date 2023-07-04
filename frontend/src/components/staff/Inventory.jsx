import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FullTable from './FullTable';

/**
 * Wrapper for FullTable component
 * @param {refresh} Boolean: Trigger refresh of data
 * @param {onRefresh} Function: Callback to trigger refresh of other components. See Inventory
 * @returns {JSX.Element} Inventory
 */
export default function Inventory({ refresh, onRefresh }) {
  useEffect(() => {
    if (!onRefresh === undefined) {
      onRefresh();
    }
  }, [refresh, onRefresh]);

  return (
    <div className="flex flex-col w-[50%] p-5 border border-black rounded-md bg-gray-100">
      <FullTable refresh={refresh} onRefresh={onRefresh} />
    </div>
  );
}

Inventory.propTypes = {
  refresh: PropTypes.bool,
  onRefresh: PropTypes.func,
};

Inventory.defaultProps = {
  refresh: false,
  onRefresh: undefined,
};
