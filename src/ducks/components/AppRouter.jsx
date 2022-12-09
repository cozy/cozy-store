import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Discover, MyApplications } from 'ducks/apps/Containers'
import IntentRedirect from 'ducks/components/intents/IntentRedirect'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="redirect" render={() => <IntentRedirect />} />
      <Route path={`discover/*`} element={<Discover />} />
      <Route path={`myapps/*`} element={<MyApplications />} />
      <Route path="*" element={<Navigate replace to="myapps" />} />
    </Routes>
  )
}