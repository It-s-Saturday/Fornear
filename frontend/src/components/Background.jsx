import React from 'react';
import Logo from './Logo';

export default function Background() {
  const size = 60;
  const className = `fixed bottom-[-15rem] left-[-15rem] z-[-20]`;
  return (
    <div className={className}>
      <Logo
        style={{
          height: `${size}rem`,
          width: `${size}rem`,
          opacity: 0.05,
        }}
        color="#71b2c9"
      />
    </div>
  );
}
