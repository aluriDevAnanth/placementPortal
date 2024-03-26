import React, { useContext } from 'react'
import AuthCon from '../../../context/AuthPro';

export default function EditFeedback({ edit, setEdit, MR, setMR }) {
  const { user, auth } = useContext(AuthCon);
  //console.log(edit)

  const upIndiFB = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    let q = {};

    for (let [key, value] of formData.entries()) {
      q[key] = value;
    }

    try {
      const response = await fetch('http://localhost:3000/api/mentor/updateMFB/', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
        body: JSON.stringify({ id: edit._id, user, data: q }),
      });

      if (!response.ok) {
        throw new Error('Failed to update feedback');
      }

      // Assuming you need to do something with the response
      const res = await response.json();
      //console.log(res);

      // Close the modal
      const modal = document.getElementById('exampleModal');
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      //console.log(MR)
      const qq = MR.map(item => {
        if (item._id === edit._id) {
          return { ...item, menreview: q.menreview };
        }
        return item;
      });

      setMR(qq)
      setEdit(null)
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="modal fade " id="exampleModal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modal title</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          {<form onSubmit={upIndiFB}>
            <div className="modal-body">
              <div>
                {/*  */}
                <input type="text" name="reviewtype" value='individual' hidden readOnly />
                <input type="text" name="rollno" value={edit.rollno} hidden readOnly />
                <input type="text" name="rollno" value={edit.rollno} hidden readOnly />
                <input type="text" name="uploadeddate" value={edit.uploadeddate} hidden readOnly />
                <div className="form-floating mb-3">
                  <select disabled name="rollno" id="roll" className="form-control " required="" >
                    <option value={edit.rollno}>{edit.rollno}</option>
                  </select>
                  <label htmlFor="roll">Select Mentee's Name</label>
                </div>
                {/*  */}
                <div className="form-check form-check-inline mb-3 ">
                  <input type="radio" className="form-check-input" onChange={() => { }} checked={edit.contactperson === 'student'} id="person" name="contactperson" defaultValue="student" />
                  <label className="form-check-label" htmlFor="Student">Student</label>
                </div>
                <div className="form-check form-check-inline mb-3 ">
                  <input type="radio" className="form-check-input" onChange={() => { }} checked={edit.contactperson === 'parent'} id="parent" name="contactperson" defaultValue="parent" />
                  <label className="form-check-label" htmlFor="parent">
                    Parent
                  </label>
                </div>
                <div className="form-check form-check-inline mb-3 ">
                  <input type="radio" className="form-check-input" onChange={() => { }} checked={edit.contactperson === 'guardian'} id="guardian" name="contactperson" defaultValue="guardian" />
                  <label className="form-check-label" htmlFor="guardian">Guardian</label>
                </div>
                {/*  */}
                <div className="form-floating mb-3 ">
                  <select name='modeofcom' defaultValue={edit.modeofcom} className="form-select" disabled id="floatingSelect" aria-label="Floating label select example">
                    <option value={edit.modeofcom} disabled >{edit.modeofcom}</option>
                  </select>
                  <label htmlFor="floatingSelect">Works with selects</label>
                </div>
                {/*  */}
                <div className="form-floating mb-3">
                  <textarea className="form-control" id="menreview" name="menreview" placeholder="Give a brief description" required="required" defaultValue={edit.menreview} style={{ height: '100px' }} />
                  <label htmlFor="menreview">Description</label>
                </div>
                {/*  */}
                <div className="d-flex form-group mb-3">
                  <label htmlFor="meeting-time" className="w-100 form-check-label me-3" style={{ fontSize: 20, padding: 0, margin: 0, fontWeight: 500, }} >Choose the date of interaction</label>
                  <input type="date" defaultValue={edit.uploadeddate} disabled className="form-control form-control-inline" id="meeting-time" name="uploadeddate" required="" />
                </div>
                {/*  */}

              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type='submit' className="btn btn-success" value="individual" id="typeofsubmit" name="typeofsubmit" > Submit </button>
            </div>
          </form>}
        </div>
      </div>
    </div>
  )
}
