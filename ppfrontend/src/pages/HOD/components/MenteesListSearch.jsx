import React from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function MenteesListSearch({ stu }) {
  return (
    <div>
      <DataTable value={stu} className="p-datatable-striped" rowClassName={(rowData, index) => index % 2 === 0 ? 'custom-row-even' : 'custom-row-odd'} filterDisplay="row" showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[25, 50]} sortField="name" sortOrder={1} removableSort  >
        <Column field="name" header="Name" sortable filter filterMatchMode="contains" showFilterMenu={false} />
        <Column field="rollno" header="Roll No" sortable filter filterMatchMode="contains" showFilterMenu={false} />
        <Column field="phone" header="Phone no" sortable filter filterMatchMode="contains" showFilterMenu={false} />
        <Column field="parentphone" header="Parent Phone no" sortable filter filterMatchMode="contains" showFilterMenu={false} />
        <Column field="email" header="Email" sortable filter filterMatchMode="contains" showFilterMenu={false} />
      </DataTable>
    </div>
  )
}
