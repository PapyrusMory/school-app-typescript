import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Store } from '../redux/Store'

const AdminRoute = () => {
  const {
    state: { userInfo },
  } = useContext(Store)
  if (userInfo && userInfo.isAdmin) {
    return <Outlet />
  } else {
    return <Navigate to='/login' />
  }
}

export default AdminRoute
