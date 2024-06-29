import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { useParams } from "react-router-dom";
import AuthCon from "../../context/AuthPro";
import AdminCon from "../../context/AdminPro";
import QRCode from "react-qr-code";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const StuTable = ({ event, stu }) => {
  let reqArr = event.students.map(rollno => { return { name: stu?.[rollno]?.name, rollno, email: stu?.[rollno]?.email } })
  return (
    <div>
      {event && (
        <DataTable className="text-center" value={reqArr} reorderableColumns resizableColumns size='small' showGridlines stripedRows paginator rows={20} rowsPerPageOptions={[30, 50, 100, 200]} tableStyle={{ minWidth: '50rem' }} filterDisplay="row" emptyMessage="No Students found." removableSort sortField="name" sortOrder={1}  >
          <Column className="text-center" sortable filter filterMatchMode="contains" showFilterMenu={false} field="name" header="Name" />
          <Column className="text-center" sortable filter filterMatchMode="contains" showFilterMenu={false} field="rollno" header="Rollno" />
          <Column className="text-center" sortable filter filterMatchMode="contains" showFilterMenu={false} field="email" header="Email" />
        </DataTable>
      )}
    </div>
  );
};

export default function CurrEvent() {
  const { eid } = useParams();
  const { auth } = useContext(AuthCon);
  const { stu } = useContext(AdminCon);
  const [event, setEvent] = useState();
  const [qrValue, setQRValue] = useState("");
  const [tokens, setTokens] = useState([]);
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
  const [sess, setSess] = useState(false);
  const [qrSize, setQrSize] = useState(300);
  const baseURL = process.env.BASE_URL;

  useEffect(() => {
    fetchEvent();
  }, [eid]);

  useEffect(() => {
    let intervalId;
    if (sess) {
      fetchTokens(eid);
      intervalId = setInterval(() => {
        fetchTokens(eid);
      }, 60000);
    }

    return () => clearInterval(intervalId);
  }, [eid, sess]);

  useEffect(() => {
    if (tokens.length > 0) {
      const timeoutId = setTimeout(() => {
        setCurrentTokenIndex((prevIndex) => (prevIndex + 1) % tokens.length);
      }, 5000);

      setQRValue(tokens[currentTokenIndex]);

      return () => clearTimeout(timeoutId);
    }
  }, [tokens, currentTokenIndex]);

  async function fetchTokens(sessionId) {
    try {
      const response = await fetch(`${baseURL}/admin/startQrSession`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });
      const res = await response.json();
      console.log(res.data.tokens);
      setTokens(res.data.tokens);
    } catch (error) {
      console.error("Fetching tokens failed:", error);
      setTokens([]);
    }
  }

  async function fetchEvent() {
    try {
      const response = await fetch(`${baseURL}/admin/getEvent/${eid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`,
        },
      });
      const res = await response.json();
      setEvent(res.data[0]);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  }

  return (
    <>
      <div className="container-fluid d-flex">
        <div>
          <Sidebar />
        </div>
        <div className="d-flex ms-4 w-100">
          <div className="d-flex flex-column">
            <h2>Name: {event?.name}</h2>
            <p>Description: {event?.des}</p>
            <p> Start Time:{" "}  {event ? new Date(event.startTime).toLocaleString() : ""}   </p>
            <p>  End Time: {event ? new Date(event.endTime).toLocaleString() : ""}  </p>
            <p>Recurrence: {event?.rec}</p>
          </div>
          {qrValue && sess ? (
            <div className="ms-5">
              <QRCode size={1000} style={{ height: `${qrSize}px`, maxWidth: "100%", width: "100%", }} value={qrValue} viewBox={`0 0 256 256`} onClick={() => setQrSize(qrSize === 300 ? 650 : 300)} />
              <div className="my-3 mx-auto">
                <button onClick={() => { setSess(false); }} className="btn btn-danger " > End Session </button>
              </div>
            </div>
          ) : (
            <div className="my-auto mx-auto">
              <button onClick={() => { setSess(true); }} className="btn btn-primary "  >  Start Session  </button>
            </div>
          )}
        </div>
      </div>
      <div className="container-fluid mt-3">
        <div>
          <h1>Students:</h1>
          {event && stu && (<StuTable event={event} stu={stu} />)}
        </div>
      </div>
    </>
  );
}
