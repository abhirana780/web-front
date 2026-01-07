
import React, { useState, useEffect } from 'react';

const TestLoading = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(true);

  console.log('TestLoading rendered, isLoading:', isLoading, 'show:', show);

  useEffect(() => {
    console.log('TestLoading component mounted');
    return () => {
      console.log('TestLoading component unmounting');
    };
  }, []);

  const handleButtonClick = () => {
    console.log('Button clicked in test component');
    setIsLoading(false);
    setShow(false); // Force unmount by changing show state
    console.log('States updated, isLoading:', false, 'show:', false);
    
    // Force reload after 1 second to test if changes persist
    setTimeout(() => {
      console.log('Forcing page reload to test persistence');
      window.location.reload();
    }, 1000);
  };

  if (!show) {
    console.log('Returning null because show is false');
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'red',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={() => console.log('Container clicked')}
    >
      <h1 style={{ color: 'white', fontSize: '48px' }}>TEST LOADING SCREEN</h1>
      <p style={{ color: 'white', fontSize: '24px' }}>isLoading: {isLoading.toString()}</p>
      <p style={{ color: 'white', fontSize: '24px' }}>show: {show.toString()}</p>
      <button 
        onClick={handleButtonClick}
        style={{
          padding: '20px 40px',
          fontSize: '24px',
          backgroundColor: 'white',
          color: 'red',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer'
        }}
      >
        TEST BUTTON - Click Me (Forces reload in 1 sec)
      </button>
    </div>
  );
};

export default TestLoading;
