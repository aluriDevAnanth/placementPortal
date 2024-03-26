import React from 'react'

export default function MenteesListSearch({ stu }) {
  return (
    <div>
      <table className="table table-hover table-striped table-bordered border-light table-condensed">
        <thead style={{ backgroundColor: '#999663' }}>
          <tr className="text-center text-white">
            <th>Name</th>
            <th>Roll No</th>
            <th>Phone no</th>
            <th>Parent Phone no</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {stu && stu.map((q, i) => {
            return (
              <tr className="text-center" key={q._id} style={{ backgroundColor: i % 2 === 0 ? '#EEEBDD' : '#FFFFFF' }}>
                <td>{q.name}</td>
                <td>{q.rollno}</td>
                <td>{q.phone}</td>
                <td>{q.parentphone}</td>
                <td>{q.email}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

    </div>
  )
}
