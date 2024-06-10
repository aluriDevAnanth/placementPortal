import React, { useContext, useState } from 'react';
import AuthCon from '../../context/AuthPro';

export default function SetEvent({ setShowSetEvent, fetchEvents }) {
  const [eventInfo, setEventInfo] = useState(null);
  const { auth } = useContext(AuthCon);
  const baseURL = process.env.BASE_URL

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const name = formData.get('name');
    const des = formData.get('description');
    const startTime = formData.get('startTime');
    const endTime = formData.get('endTime');
    const rec = formData.get('recurrence');

    let eventData, students;

    const file = formData.get('file');

    if (file) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const text = event.target.result;
        const rows = text.split('\n');

        students = rows.map((row) => {
          const a = row.split(',');
          return a[0] !== 'rollno' ? a[0] : null;
        }).filter((student) => student !== null);

        students = students.filter(q => { return q !== '' })
        console.log(students);
        eventData = { name, des, startTime, endTime, rec, students };
        setEventInfo(eventData);

        const response = await fetch(`${baseURL}/admin/postEvent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth}`,
          },
          body: JSON.stringify({ data: eventData }),
        });

        const res = await response.json();

        //console.log(eventInfo, res)
        fetchEvents();
      };

      reader.readAsText(file);
    } else {
      // If no file is provided, proceed with sending the request with the existing data
      eventData = { name, des, startTime, endTime, rec };
      setEventInfo(eventData);

      const response = await fetch(`${baseURL}/admin/postEvent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
        body: JSON.stringify({ data: eventData }),
      });

      const res = await response.json();

      //console.log(eventInfo, res)
      fetchEvents();
    }
  };


  const closeSetEvent = () => {
    setShowSetEvent(false)
  }

  return (
    <>

      <div className='ms-3 me-3 container w-100'>
        <form className='' onSubmit={handleSubmit}>
          <div className='d-flex gap-3'>
            <div className="form-floating col mb-3">
              <input required className="form-control" type="text" name="name" id="name" />
              <label htmlFor="name">Name</label>
            </div>
            <div className="form-floating col mb-3">
              <textarea required className="form-control" type="textarea" name="description" />
              <label htmlFor="description">Description</label>
            </div>
          </div>
          <div className='d-flex gap-3'>
            <div className="form-floating col mb-3">
              <input required className="form-control" type="datetime-local" name="startTime" id="startTime" />
              <label htmlFor="startTime">Start Time</label>
            </div>
            <div className="form-floating col mb-3">
              <input required className="form-control" type="datetime-local" name="endTime" />
              <label htmlFor="endTime">End Time</label>
            </div>
          </div>
          <div className='d-flex gap-5' >
            <div>
              <select required className='form-select col' style={{ width: '25rem' }} name="recurrence" >
                <option value="" disabled  >Select interval</option>
                <option value="weekly">Once a Week</option>
                <option value="daily">Once a day</option>
                <option value="once">One Time</option>
              </select>
            </div>
            <div className='col'>
              <input required className='form-control' type="file" name="file" />
            </div>
            <div className='col'>
              <button className='btn btn-primary'>Submit</button>
              <button onClick={closeSetEvent} className='btn btn-secondary ms-3'>Close</button>
            </div>
          </div>
        </form>
        <div className='mt-3'>
          {eventInfo && eventInfo.students && <p>{eventInfo.students.length} add to {eventInfo.name} event</p>}
        </div>
      </div>

    </>
  );
}
