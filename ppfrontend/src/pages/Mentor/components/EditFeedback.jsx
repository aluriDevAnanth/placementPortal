import React, { useContext } from 'react';
import AuthCon from '../../../context/AuthPro';
import { Button, Form, Modal, FloatingLabel } from 'react-bootstrap';

export default function EditFeedback({ edit, setEdit, MR, setMR }) {
  const { auth, user } = useContext(AuthCon);

  const upIndiFB = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    let q = {};

    for (let [key, value] of formData.entries()) {
      q[key] = value;
    }
    console.log(q);
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

      const res = await response.json();

      const modal = document.getElementById('editModal');
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.hide();

      const qq = MR.map(item => {
        if (item._id === edit._id) {
          return { ...item, menreview: q.menreview };
        }
        return item;
      });

      setMR(qq);
      setEdit(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal id="editModal" show={edit !== null} onHide={() => setEdit(null)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Feedback</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={upIndiFB} className='d-flex flex-column gap-2'>
          <input type="text" name="reviewtype" value='individual' hidden readOnly />
          <input type="text" name="rollno" value={edit.rollno} hidden readOnly />
          <input type="text" name="rollno" value={edit.rollno} hidden readOnly />
          <input type="text" name="uploadeddate" value={edit.uploadeddate} hidden readOnly />

          <FloatingLabel controlId="formRollno" label="Select Mentee's Name">
            <Form.Select name='rollno' disabled>
              <option value={edit.rollno}>{edit.rollno}</option>
            </Form.Select>
          </FloatingLabel>
          <div>
            <Form.Check inline label="Student" name="contactperson" type="radio" id="student" value="student" checked={edit.contactperson === 'student'} disabled />
            <Form.Check inline label="Parent" name="contactperson" type="radio" id="parent" value="parent" checked={edit.contactperson === 'parent'} disabled />
            <Form.Check inline label="Guardian" name="contactperson" type="radio" id="guardian" value="guardian" checked={edit.contactperson === 'guardian'} disabled />
          </div>

          <FloatingLabel controlId="formModeofcom" label="Works with selects">
            <Form.Select name='modeofcom' defaultValue={edit.modeofcom} disabled>
              <option value={edit.modeofcom} disabled>{edit.modeofcom}</option>
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel controlId="formMenreview" label="Description">
            <Form.Control as="textarea" rows={3} name="menreview" placeholder="Give a brief description" required defaultValue={edit.menreview} />
          </FloatingLabel>

          <FloatingLabel controlId="formMeetingTime" label="Choose the date of interaction">
            <Form.Control type="date" name="uploadeddate" defaultValue={edit.uploadeddate} disabled />
          </FloatingLabel>
          <div >
            <Button className='me-3' variant="secondary" onClick={() => setEdit(null)}>Close</Button>
            <Button variant="primary" type="submit">Submit</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
