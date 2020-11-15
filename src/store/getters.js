const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  language: state => state.app.language,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userinfo: state => state.user.userinfo,
  nikename: state => state.user.nikename,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  siderRoutes: state => state.permission.siderRoutes,
  errorLogs: state => state.errorLog.logs
}
export default getters
