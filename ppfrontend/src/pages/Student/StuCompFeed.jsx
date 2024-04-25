import React, { useContext } from 'react';
import AuthCon from '../../context/AuthPro'
import Sidebar from './components/Sidebar';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import { Formik, Form, FieldArray, Field } from 'formik';
import * as Yup from 'yup';
import { Button, Col, Row } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const schema = Yup.object().shape({
  type: Yup.string().required('Type is required'),
  ques: Yup.array().of(Yup.string()).required('Questions are required'),
});

export default function StuCompFeed({ SCF, completed, setSCF, fetchStuCompFeed }) {
  const { user, auth } = useContext(AuthCon)
  async function subSCF(values, { resetForm }, name) {
    const response = await fetch(`http://localhost:3000/api/student/postStuCompFeed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
      body: JSON.stringify({ values, rollno: user.rollno, name }),
    });
    const res = await response.json();
    if (res.success) {
      SCF.map(q => {
        if (q.name === name) {
          q.completed = true
        }
      })
      setSCF(SCF)
    }
    resetForm();
  }

  return (
    <div className=' container-fluid d-flex'>
      <div>
        <Sidebar />
      </div>
      <div className='ms-3 flex-fill container-fluid mb-5'>
        <Accordion defaultActiveKey="0" alwaysOpen>
          {SCF && SCF.map((q, i) => {
            return (
              <Accordion.Item key={i} eventKey={i}>
                <Accordion.Header>{q.name}</Accordion.Header>
                <Accordion.Body>
                  <ListGroup horizontal>
                    <ListGroup.Item>Job Role: {q.jobRole}</ListGroup.Item>
                    <ListGroup.Item>Job batch: {q.batch}</ListGroup.Item>
                    <ListGroup.Item>Job dateOfVisit: {q.dateOfVisit}</ListGroup.Item>
                    {q.completed && <ListGroup.Item><div className='m-0 p-2 alert alert-success'>Done Feedback submit!</div></ListGroup.Item>}
                  </ListGroup>
                  {!q.completed ? <div className='mt-3'>
                    <Formik
                      initialValues={{ type: '', ques: [''], }}
                      validationSchema={schema}
                      onSubmit={(values, formikBag) => { subSCF(values, formikBag, q.name) }}
                    >
                      {({ values, errors, handleSubmit }) => (
                        <Form onSubmit={handleSubmit} className='d-flex flex-column gap-3'>
                          <Field name="type">
                            {({ field }) => (
                              <div>
                                <FloatingLabel
                                  controlId="floatingInput"
                                  label="Type"
                                  className="mb-3"
                                >
                                  <input className='form-control' {...field} type="text" />
                                </FloatingLabel>
                                {errors.type && <div className='text-danger fw-bold'>{errors.type}</div>}
                              </div>
                            )}
                          </Field>

                          <FieldArray name="ques">
                            {({ push, remove, swap }) => (
                              <div>
                                <label>Questions</label>
                                <div>
                                  {values.ques.map((ques, index) => (
                                    <div key={index} className='d-flex mb-3'>
                                      <Field className=" gap-3" name={`ques.${index}`}>
                                        {({ field }) => (
                                          <div className='flex-fill me-3'>
                                            <FloatingLabel
                                              controlId="floatingInput"
                                              label="Type"
                                              className="mb-3"
                                            >
                                              <input className='form-control' {...field} type="text" />
                                            </FloatingLabel>
                                            {errors.ques && errors.ques[index] && <div className='ms-3 text-danger fw-bold'>{errors.ques[index]}</div>}
                                          </div>
                                        )}
                                      </Field>
                                      <div>
                                        <Button className='me-3' variant="primary" onClick={() => push('')} > + </Button>
                                        <Button className='me-3' variant="secondary" onClick={() => index > 0 && swap(index, index - 1)} > Up </Button>
                                        <Button className='me-3' variant="secondary" onClick={() => index < values.ques.length - 1 && swap(index, index + 1)} > Down </Button>
                                        <Button className='me-3' variant="danger" onClick={() => remove(index)}> - </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </FieldArray>

                          <div>
                            <Button type="submit">Submit</Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div> : <div className=' mt-3 ms-3'>
                    <ListGroup className='w-100'>
                      <ListGroup.Item className='w-100' ><p className='m-0'>type:{q.stuFeed[user.rollno].type}</p></ListGroup.Item>
                      {q.stuFeed[user.rollno].ques.map((qq, ii) => {
                        return <ListGroup.Item className='w-100' key={ii}>Question {ii + 1}: {qq}</ListGroup.Item>
                      })}
                    </ListGroup>
                  </div>}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
