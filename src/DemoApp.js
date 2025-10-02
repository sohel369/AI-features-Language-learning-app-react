// Simple Firebase Authentication Demo App
import React from 'react';
import AuthForm from './AuthForm';

function DemoApp() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <AuthForm />
    </div>
  );
}

export default DemoApp;
