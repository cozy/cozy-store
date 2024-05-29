import * as Sentry from '@sentry/react'
import { Discover, MyApplications } from 'ducks/apps/Containers'
import IntentRedirect from 'ducks/components/intents/IntentRedirect'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

export const AppRouter = () => {
  return (
    <SentryRoutes>
      <Route path="redirect" element={<IntentRedirect />} />
      <Route path="discover/*" element={<Discover />} />
      <Route path="myapps/*" element={<MyApplications />} />
      <Route path="*" element={<Navigate replace to="discover" />} />
    </SentryRoutes>
  )
}
