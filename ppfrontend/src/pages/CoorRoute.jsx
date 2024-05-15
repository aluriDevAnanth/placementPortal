import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'

/* HOD */
import AuthCon from '../context/AuthPro'
import Header from './Coor/components/Header'
import CoorHome from './Coor/CoorHome'
import CoorEvents from './Coor/CoorEvents'
import CoorCurrEvent from './Coor/CoorCurrEvent'
import CoorSettings from './Coor/CoorSettings'
/* HOD */

export default function HODRoute() {
  const { auth, user } = useContext(AuthCon)

  return (
    <>
      {(auth === undefined && user !== undefined) ? <></> : <Header />}
      {
        (user != null) && <>
          <Routes>
            <Route path='/' element={<CoorHome />} />
            <Route path='/events' element={<CoorEvents />} />
            <Route path='/currevent/:eid' element={<CoorCurrEvent />} />
            <Route path='/settings' element={<CoorSettings />} />
          </Routes>
        </>
      }

    </>
  )
}
