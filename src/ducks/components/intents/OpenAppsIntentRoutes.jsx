import { Discover } from '@/ducks/apps/Containers'
import PropTypes from 'prop-types'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const OpenAppsIntentRoutes = ({ intentData, onTerminate }) => {
  return (
    <Routes>
      <Route
        path="discover/*"
        element={<Discover intentData={intentData} onTerminate={onTerminate} />}
      />
      <Route path="*" element={<Navigate replace to="discover" />} />
    </Routes>
  )
}

OpenAppsIntentRoutes.propTypes = {
  intentData: PropTypes.shape({
    appData: PropTypes.object,
    data: PropTypes.object
  }).isRequired,
  onTerminate: PropTypes.func.isRequired
}

export default OpenAppsIntentRoutes
