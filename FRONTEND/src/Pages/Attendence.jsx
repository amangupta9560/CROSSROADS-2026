import React from 'react';
import SeoHead from '../Components/common/SeoHead.jsx';

const Attendance = () => {
  return (
    <main
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        position: 'fixed',
        inset: 0,
      }}
    >
      <SeoHead
        title="Attendance Verification Portal | CROSSROADS 2027"
        description="Official squad attendance and QR check-in portal for CROSSROADS 2027 at HIET Ghaziabad."
        path="/attendance"
        robots="noindex, nofollow"
      />
      <h1 className="sr-only">CROSSROADS 2027 Attendance Verification Portal</h1>
      <iframe
        src="https://attendence-crossroads.lovable.app"
        title="CROSSROADS 2027 Attendance Scanner"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
        allow="camera; microphone; fullscreen; geolocation"
      />
    </main>
  );
};

export default Attendance;
