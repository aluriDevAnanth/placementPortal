import React, { useContext, useState } from 'react';
import Sidebar from './components/Sidebar';
import AuthCon from '../../context/AuthPro';
import MentorCon from "../../context/MentorPro";

export default function MenteesMail() {
  const { user } = useContext(AuthCon);
  const { students } = useContext(MentorCon);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedStudents = students.slice(startIndex, endIndex);

  const checkAll = (e) => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
    });

  }

  function sendEmail(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    let q = {};

    for (let [key, value] of formData.entries()) {
      q[key] = value;
    }

    q.emails = q.emails.split(",")

    //console.log(q)
  }

  return (
    user !== null && (
      <div className='bodyBG'>
        <div className='container-fluid'>
          <div className='d-flex'>
            <div className='me-5'>
              <Sidebar />
            </div>
            <div className='flex-fill'>
              <form onSubmit={sendEmail} className="p-3 mb-4 gap-3" style={{ backgroundColor: "Ghostwhite" }}>
                <h4>Compose Email</h4>
                <p id="multi-responce"></p>
                <div className="form-group mb-3">
                  <textarea className="form-control" id="emails" name="emails" placeholder="Email list" style={{ height: "120px" }}></textarea>
                </div>
                <div className="form-group mb-3">
                  <input type="text" className="form-control" id="subject" name="subject" placeholder="Subject" required="" />
                </div>
                <div className="form-group mb-3">
                  <textarea style={{ height: "220px" }} id="message" name="message" className="form-control" placeholder="Your Message" rows="5" required=""></textarea>
                </div>
                <div>
                  <button type="btn btn-primary " /* onClick="multi_email();" */ className="btn btn-primary btn-lg col-lg-12" id="send">
                    Send Now
                  </button>
                </div>

              </form>

              <table className="shadow table table-striped table-bordered table-hover">
                <thead>
                  <tr className="text-center text-light" style={{ backgroundColor: "#696747" }}>
                    <th><input type="checkbox" id="mcheck" onChange={checkAll} /> Check All</th>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Email</th>
                  </tr>
                </thead>

                <tbody id="alluser">
                  {displayedStudents.map((q) => (
                    <tr key={q.email}>
                      <td className='text-center'>
                        <input type="checkbox" value={q.email} /* onClick="updateTextArea();" */ />
                      </td>
                      <td>{q.rollno}</td>
                      <td>{q.name}</td>
                      <td>{q.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <nav aria-label="Page navigation example">
                  <ul className="pagination justify-content-center ">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(1)}>
                        First
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                        Prev
                      </button>
                    </li>
                    {[...Array(Math.ceil(students.length / itemsPerPage)).keys()].map((page) => (
                      <li key={page} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page + 1)}
                        >
                          {page + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === Math.ceil(students.length / itemsPerPage) ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                        Next
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === Math.ceil(students.length / itemsPerPage) ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(Math.ceil(students.length / itemsPerPage))}>
                        Last
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
              {/* ... (rest of your code) */}
            </div>
          </div>

        </div>
      </div>
    )
  );
}
