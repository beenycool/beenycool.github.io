"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import APIInitializer as it needs to run client-side
const APIInitializer = dynamic(
  () => import('@/components/api-initializer').then(mod => mod.APIInitializer),
  { ssr: false }
);

const ClientLayoutItems: React.FC = () => {
  return <APIInitializer />;
};

export default ClientLayoutItems; 