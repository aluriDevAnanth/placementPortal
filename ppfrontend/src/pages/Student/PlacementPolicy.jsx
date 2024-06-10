import React, { useContext } from 'react';
import Sidebar from './components/Sidebar';
import AuthCon from '../../context/AuthPro';

export default function StudentHome() {
  const { auth, user } = useContext(AuthCon);
  const baseURL = process.env.BASE_URL

  const handleDownload = async () => {
    try {
      const response = await fetch(`${baseURL}/student/downloadPlacementPolicy`);
      if (!response.ok) {
        throw new Error('Failed to download placement policy');
      }
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'Placement_policy_final_version.pdf';
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="(.+)"/);
        if (matches && matches.length > 1) {
          filename = matches[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.setAttribute('download', filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error downloading placement policy:', error);
    }
  };

  return (
    <div className='container-fluid d-flex'>
      <div>
        <Sidebar />
      </div>
      <div className='flex-fill container-fluid'>
        <div className='bg-white p-3 rounded-3 mb-3'>
          <p className='fs-5 fw-bold text-center'>Placement policy</p>
          <p><span className='fw-bold'>NOTE:</span> Students you may refer to the detailed attendance for further clarifications on above consolidated attendance, we have not considered Barclays attendance for computing weekly attendance. Also students are marked as "present" only if they have spent minimum of 80% time in the session. Students who have not met 80% in weekly attendance will not be allowed into placement process.</p>
        </div>
        <div>
          {/* Add onClick event handler to the download button */}
          <button className='btn btn-primary' onClick={handleDownload}>Download Placement policy</button>
        </div>
      </div>
    </div>
  );
}
