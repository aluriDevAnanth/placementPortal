import React from 'react'
import Sidebar from './components/Sidebar'

export default function Home() {
  return (
    <div>
      <div className='d-flex'>
        <div className='me-3'>
          <Sidebar />
        </div>
        <div className='flex-fill container me-3'>
          <div>
            <form>
              <div className="row">
                <div className="col">
                  <div className="form-floating mb-3">
                    <input type="date" className="form-control" id="fromdate" name="fromdate" placeholder="YYYY-MM-DD" autoComplete='off' />
                    <label htmlFor="fromdate">Choose From Date</label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input type="date" className="form-control" id="todate" name="todate" placeholder="YYYY-MM-DD" />
                    <label htmlFor="todate">Choose To Date</label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <select className="form-control" id="branch" name="branch">
                      <option value="" disabled> Select Branch </option>
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="CIVIL">CIVIL</option>
                      <option value="EEE">EEE</option>
                      <option value="MECH">MECH</option>
                    </select>
                    <label htmlFor="branch">Select Branch</label>
                  </div>
                </div>
                <div className="col">
                  <button type="submit" className="btn btn-primary mt-2">
                    Submit
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>

        <div className="me-5" style={{ width: '30rem' }}>
          <p className="fs-3 fw-bolder"> Interaction Report</p>
          <table className="table">
            <tbody>
              <tr>
                <td>
                  <div className="scoreitem" />
                </td>
                <td>
                  <div className="scoreitem">1</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="scoreitem">CIVIL</div>
                </td>
                <td>
                  <div className="scoreitem">92</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="scoreitem">Computer Science and Engineering</div>
                </td>
                <td>
                  <div className="scoreitem">3</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="scoreitem">CSE</div>
                </td>
                <td>
                  <div className="scoreitem">1555</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="scoreitem">ECE</div>
                </td>
                <td>
                  <div className="scoreitem">276</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="scoreitem">EEE</div>
                </td>
                <td>
                  <div className="scoreitem">109</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="scoreitem">MECH</div>
                </td>
                <td>
                  <div className="scoreitem">85</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
