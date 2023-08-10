import { Discover, MyApplications } from 'ducks/apps/Containers'
import IntentRedirect from 'ducks/components/intents/IntentRedirect'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="redirect" element={<IntentRedirect />} />
      <Route path="discover/*" element={<Discover />} />
      <Route path="myapps/*" element={<MyApplications />} />
      <Route path="*" element={<Navigate replace to="discover" />} />
    </Routes>
  )
}
