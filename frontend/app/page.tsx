'use client'

import Header from '@/components/Header';
import Home from '@/components/Home';

export default function App() {
  return (
    <>
      <Header backButton={false} gameButton={true} />
      {/* <ReclaimSection /> */}
      <Home />
    </>
  )
}
