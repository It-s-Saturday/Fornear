import React from 'react';

import PackageGenerator from './PackageGenerator';

/**
 * Current landing page and student home page. Displays PackageGenerator.
 * @returns {JSX.Element} Home
 */
export default function Home() {
  return <PackageGenerator showRequest={true} />;
}
