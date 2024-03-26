import React, { useState, useEffect } from 'react';

export default function Search({ mystyle, students }) {
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredStudents, setFilteredStudents] = useState([]);

	useEffect(() => {
		if (students) {
			const filtered = students.filter(q => q.name.toLowerCase().includes(searchTerm.toLowerCase()));
			setFilteredStudents(filtered);
		}
	}, [students, searchTerm]);

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
	};

	return (
		<div className='flex-fill ms-3'>
			<form className='mt-3'>
				<div className="form-floating mb-3" style={{ width: '20rem' }}>
					<input onChange={handleSearch} type="text" className="form-control" id="floatingInput" placeholder="Search by name" />
					<label htmlFor="floatingInput">Search</label>
				</div>
			</form>
			<div>
				<table className="shadow table table-striped table-hover rounded-4  table-hover">
					<tbody>
						<tr bgcolor="green" className="text-center text-light" style={mystyle}>
							<th>Name</th>
							<th>Roll No</th>
							<th>Phone no</th>
							<th>Parent Phone no</th>
							<th>Email</th>
						</tr>
						{filteredStudents.map((q, i) => (
							<tr className="text-center" key={i}>
								<td>{q.name}</td>
								<td>{q.rollno}</td>
								<td>{q.phone}</td>
								<td>{q.parentphone}</td>
								<td>{q.email}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
