import 'antd/dist/reset.css'
import { DefaultLayout } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className='App'>
      <DefaultLayout>
        <Outlet />
      </DefaultLayout>
    </div>
  )
}

export default App
