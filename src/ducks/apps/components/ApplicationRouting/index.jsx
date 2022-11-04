// import React, { Component } from 'react'
// import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'

// import { translate } from 'cozy-ui/transpiled/react/I18n'

// import ChannelRoute from 'ducks/apps/components/ApplicationRouting/ChannelRoute'
// import PermissionsRoute from 'ducks/apps/components/ApplicationRouting/PermissionsRoute'
// import ConfigureRoute from 'ducks/apps/components/ApplicationRouting/ConfigureRoute'
// import InstallRoute from 'ducks/apps/components/ApplicationRouting/InstallRoute'
// import UninstallRoute from 'ducks/apps/components/ApplicationRouting/UninstallRoute'
// import ApplicationPage from 'ducks/apps/components/ApplicationPage'

// export class ApplicationRouting extends Component {
//   mainPage = React.createRef()

//   getAppFromMatchOrSlug = (params, slug) => {
//     console.log({params, slug})
//     const appsArray = this.props.apps || this.props.installedApps || []
//     console.log({appsArray})
//     const appSlug = slug || (params && params.appSlug)
//     console.log({appSlug})
//     if (!appsArray.length || !appSlug) return null
//     const app = appsArray.find(app => app.slug === appSlug)
//     console.log({app})
//     return app
//   }

//   redirectTo = target => {
//     const { navigate, location } = this.props
//     navigate(target + location.search, { replace: true })
//     return null
//   }

//   render() {
//     const { isFetching, parent } = this.props
//     return (
//       <div className="sto-modal-page" ref={this.mainPage}>
//         <Routes>
//           <Route
//             path={`/${parent}/:appSlug`}
//             element={
//               <ApplicationPage
//                 parent={parent}
//                 isFetching={isFetching}
//                 getApp={this.getAppFromMatchOrSlug}
//                 redirectTo={this.redirectTo}
//                 mainPageRef={this.mainPage}
//               />
//             }
//           />
//         </Routes>
//       </div>
//     )
//     // return (
//     //   <div className="sto-modal-page" ref={this.mainPage}>
//     //     <Route
//     //       path={`/${parent}/:appSlug`}
//     //       render={({ match }) => {
//     //         return (
//     //           <ApplicationPage
//     //             matchRoute={match}
//     //             parent={parent}
//     //             pauseFocusTrap={!match.isExact}
//     //             isFetching={isFetching}
//     //             getApp={this.getAppFromMatchOrSlug}
//     //             redirectTo={this.redirectTo}
//     //             mainPageRef={this.mainPage}
//     //           />
//     //         )
//     //       }}
//     //     />
//     //     <ChannelRoute
//     //       getApp={this.getAppFromMatchOrSlug}
//     //       isFetching={isFetching}
//     //       parent={parent}
//     //       redirectTo={this.redirectTo}
//     //     />
//     //     <InstallRoute
//     //       getApp={this.getAppFromMatchOrSlug}
//     //       isFetching={isFetching}
//     //       parent={parent}
//     //       redirectTo={this.redirectTo}
//     //     />
//     //     <UninstallRoute
//     //       getApp={this.getAppFromMatchOrSlug}
//     //       isFetching={isFetching}
//     //       parent={parent}
//     //       redirectTo={this.redirectTo}
//     //     />
//     //     <PermissionsRoute
//     //       getApp={this.getAppFromMatchOrSlug}
//     //       isFetching={isFetching}
//     //       parent={parent}
//     //       redirectTo={this.redirectTo}
//     //     />
//     //     <ConfigureRoute
//     //       getApp={this.getAppFromMatchOrSlug}
//     //       isFetching={isFetching}
//     //       parent={parent}
//     //       redirectTo={this.redirectTo}
//     //     />
//     //   </div>
//     // )
//   }
// }

// const ApplicationRoutingWrapper = props => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   return (
//     <ApplicationRouting {...props} navigate={navigate} location={location} />
//   )
// }

// export default translate()(ApplicationRoutingWrapper)
