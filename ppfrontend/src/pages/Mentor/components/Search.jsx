import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';

export default function Search({ mystyle, students }) {
	const [filters, setFilters] = useState({
		name: { value: null, matchMode: FilterMatchMode.CONTAINS },
		email: { value: null, matchMode: FilterMatchMode.CONTAINS },
		rollno: { value: null, matchMode: FilterMatchMode.CONTAINS },
		branch: { value: null, matchMode: FilterMatchMode.CONTAINS },
		phone: { value: null, matchMode: FilterMatchMode.CONTAINS },
	});

	//console.log(students);
	return (
		students && <div className='flex-fill'>
			<div className="table-header">
			</div>
			<div className='bg-white p-3 rounded-3'>
				<h5 className="fs-3 fw-bold">Students</h5>
				<DataTable value={Object.values(students)} showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[10, 25, 50]} removableSort filters={filters} sortField="name" sortOrder={1} filterDisplay="row" emptyMessage="No Students found."  >
					<Column className='text-center' field="name" header="Name" filter filterPlaceholder="Search " sortable ></Column>
					<Column className='text-center' field="email" header="Email" filter filterPlaceholder="Search " sortable ></Column>
					<Column className='text-center' field="rollno" header="Roll No" filter filterPlaceholder="Search " sortable ></Column>
					<Column className='text-center' field="dept" header="Branch" filter filterPlaceholder="Search " sortable ></Column>
					<Column className='text-center' field="phone" header="Phone No" filter filterPlaceholder="Search " sortable ></Column>
				</DataTable>
			</div>
		</div>
	);
}
