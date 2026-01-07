import React from 'react';
import Lottie from 'lottie-react';
import sandyLoading from '../assets/SandyLoading.json';

/* eslint-disable react-hooks/exhaustive-deps */

const UniversalLoading = ({ 
  isLoading = true, 
  overlay = true, 
  text = "Loading...",
  height = 200,
  width = 200,
  className = ""
}) => {
  if (!isLoading) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(8px)',
        ...(className && { className })
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px'
      }}>
        {/* Sandy Loading Animation */}
        <div 
          style={{ 
            height: `${height}px`, 
            width: `${width}px`,
            filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))'
          }}
        >
          <Lottie
            animationData={sandyLoading}
            loop={true}
            style={{ 
              height: '100%', 
              width: '100%',
              filter: 'brightness(1.2) contrast(1.1)'
            }}
          />
        </div>
        
        {/* Loading Text */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            {text}
          </p>
          <div style={{
            display: 'flex',
            gap: '4px',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#ff8c00',
              borderRadius: '50%',
              animation: 'bounce 1.4s infinite ease-in-out'
            }}></div>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#ff8c00',
              borderRadius: '50%',
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: '0.1s'
            }}></div>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#ff8c00',
              borderRadius: '50%',
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: '0.2s'
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalLoading;
