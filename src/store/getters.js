const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.username,
  roles: state => state.user.roles, // 权限判定
  permission_routes: state => state.permission.routes// 权限判定

}
export default getters
