import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import AuthCon from '../../context/AuthPro';
import MentorCon from "../../context/MentorPro";
import { WithContext as ReactTags } from 'react-tag-input';

export default function MenteesMail() {
  const { user, auth } = useContext(AuthCon);
  const { students } = useContext(MentorCon);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedStudents, setDisplayedStudents] = useState([]);
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState();
  const itemsPerPage = 10;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const checkAll = (e) => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedStudents = [];
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
      if (e.target.checked) {
        const student = displayedStudents.find((s) => s.email === checkbox.value);
        if (student) {
          checkedStudents.push(student.email);
        }
      }
    });
    setTags(checkedStudents.map(q => { return { id: q, text: q } }));
  };

  useEffect(() => {
    if (students) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const DS = students.slice(startIndex, endIndex);
      setDisplayedStudents(DS);
    }
  }, [students, currentPage]);

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    const student = displayedStudents.find((s) => s.email === value);
    if (checked && student) {
      setTags([...tags, { id: student.email, text: student.email }]);
    } else {
      setTags(tags.filter((tag) => tag.id !== value));
    }
  };

  async function sendEmail(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let q = {};
    for (let [key, value] of formData.entries()) q[key] = value;
    q = { ...q, emails: tags.map(qq => { return qq.text }) }
    console.log(q);
    const response = await fetch('http://localhost:3000/api/mentor/sendEmail', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
      body: JSON.stringify({ user, data: q }),
    });
    const res = await response.json();
    console.log(res);
  }


  const handleDelete = (i) => {
    // Remove the tag
    setTags(tags.filter((tag, index) => index !== i));

    // Remove the corresponding checkbox selection
    const deletedTag = tags[i];
    setDisplayedStudents(prevStudents => prevStudents.map(student => {
      if (student.email === deletedTag.id) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
          if (checkbox.value === deletedTag.id) {
            checkbox.checked = false;
          }
        });
        return {
          ...student,
          isChecked: false
        };
      }
      return student;
    }));
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
  };

  useEffect(() => {
    if (students) {
      let sugg = students.map(student => ({ id: student.email, text: student.email }));
      setSuggestions(sugg)
    }
  }, [students]);

  useEffect(() => {
    if (tags.length > 0 && students.length > 0) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]:not(#mcheck)');
      checkboxes.forEach((checkbox) => {
        const tagExists = tags.some(tag => tag.id === checkbox.value);
        checkbox.checked = tagExists;
      });
    }
  }, [tags, students]);


  return (
    user !== null && (
      <div className='bodyBG'>
        <div className='container-fluid'>
          <div className='d-flex'>
            <div className='me-5'>
              <Sidebar />
            </div>
            <div className='flex-fill'>
              <form onSubmit={sendEmail} className="p-3 mb-4 gap-3 compose-email-form">
                <h4>Compose Email</h4>
                <div className="form-group mb-3">
                  {suggestions && (
                    <ReactTags
                      tags={tags} inline suggestions={suggestions} handleDelete={handleDelete} handleDrag={handleDrag}
                      classNames={{
                        tags: ' ',
                        tagInput: 'tagInputClass',
                        tagInputField: 'form-control',
                        selected: 'selectedClass',
                        tag: 'badge bg-primary me-1',
                        remove: 'ms-1 bg-danger',
                        suggestions: 'list-group',
                        activeSuggestion: 'list-group-item active',
                        editTagInput: 'editTagInputClass',
                        editTagInputField: 'editTagInputField',
                        clearAll: 'clearAllClass',
                      }}
                      handleAddition={(tag) => setTags([...tags, tag])} placeholder="Email list"
                    />
                  )}


                </div>
                <div className="form-group mb-3">
                  <input type="text" className="form-control" id="subject" name="subject" placeholder="Subject" required />
                </div>
                <div className="form-group mb-3">
                  <textarea id="message" name="message" className="form-control" placeholder="Your Message" rows="5" required />
                </div>
                <div>
                  <button type="submit" className="btn btn-primary  ">
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
                <tbody>
                  {displayedStudents.map((student) => (
                    <tr key={student.email}>
                      <td className='text-center'>
                        <input type="checkbox" value={student.email} onChange={handleCheckboxChange} />
                      </td>
                      <td>{student.rollno}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {students && (
                <nav aria-label="Page navigation example">
                  <ul className="pagination justify-content-center">
                    {/* Pagination buttons */}
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
