import React, { useContext, useEffect, useState } from 'react';
import AuthCon from '../../context/AuthPro';
import Sidebar from './components/ParentSidebar';

export default function ParentCompaniesCorner() {
  const { user, auth } = useContext(AuthCon);
  const [com, setCom] = useState()
  const baseURL = process.env.BASE_URL

  async function fetchCom() {
    const response = await fetch(`${baseURL}/mentor/getCom/${user.batch}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    //console.log(121, response);
    const res = await response.json();
    let q = []
    let w = []
    res.data.map(qq => {
      if (qq.arrival === 'expected') {
        q.push(qq)
      } else {
        w.push(qq)
      }
    })
    //console.log(res);
    setCom([[...q], [...w]])

  }

  useEffect(() => {
    fetchCom();
  }, [])


  return (
    user !== null && (
      <div className="bodyBG">
        <div className="container-fluid">
          <div className="d-flex">
            <div>
              <Sidebar />
            </div>
            <div className="ms-4 flex-fill col-md-8 col-sm-1 col-xs-2 mt-3 ml-4">

              {com && <ul className="nav nav-tabs shadow" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <a className="nav-link active" id="ExpectedCompanies-tab" data-bs-toggle="tab" href="#ExpectedCompanies" role="tab" aria-controls="ExpectedCompanies" aria-selected="true">Expected Companies <span class="badge text-bg-secondary">{com[0].length}</span></a>
                </li>
                <li className="nav-item" role="presentation">
                  <a className="nav-link" id="VisitedCompanies-tab" data-bs-toggle="tab" href="#VisitedCompanies" role="tab" aria-controls="VisitedCompanies" aria-selected="false">Visited Companies <span class="badge text-bg-secondary">{com[1].length}</span></a>
                </li>
              </ul>}

              {com && <div className="tab-content shadow" id="myTabContent">
                {/* {console.log(com)} */}
                <div className="tab-pane fade bg-white show active p-3" id="ExpectedCompanies" role="tabpanel" aria-labelledby="ExpectedCompanies-tab">
                  <h5>
                    <strong>Note: All the Below dates are Tentatively only</strong>
                  </h5>
                  <table className="shadow table table-striped table-bordered">
                    <thead className="text-center text-light" style={{ backgroundColor: "#696747" }}>
                      <tr style={{ backgroundColor: "#696747" }}>
                        <th>Company Name</th>
                        <th>CTC</th>
                        <th>Category</th>
                        <th>Date of visit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        com[0].map(q => {
                          return <tr key={q._id}>
                            <th>{q.name}</th>
                            <th>{q.CTC}</th>
                            <th> {q.category} </th>
                            <th> {q.dateofvisit}  </th>
                          </tr>
                        })
                      }

                    </tbody>
                  </table>

                </div>
                <div className="tab-pane fade bg-white p-3" id="VisitedCompanies" role="tabpanel" aria-labelledby="VisitedCompanies-tab" >
                  <table className="shadow table table-striped table-bordered">
                    <thead className="text-center text-light" style={{ backgroundColor: "#696747" }}>
                      <tr>
                        <th>Company Name</th>
                        <th>CTC</th>
                        <th>Category</th>
                        <th>Date of visit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        com[1].map(q => {
                          return <tr key={q._id}>
                            <th>{q.name}</th>
                            <th>{q.CTC}</th>
                            <th> {q.category} </th>
                            <th> {q.dateofvisit}  </th>
                          </tr>
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
