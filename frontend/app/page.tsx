'use client'

import Header from '@/components/Header';
import ReclaimSection from '@/components/ReclaimSection';

export default function Home() {
  return (
    <>
      <Header backButton={false} gameButton={true} />
      <ReclaimSection />
    </>
  )
}
