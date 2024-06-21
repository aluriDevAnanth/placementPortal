import React, { useContext } from 'react';
import AuthCon from '../../context/AuthPro'
import Sidebar from './components/Sidebar';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import { Formik, Form, FieldArray, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const schema = Yup.object().shape({
  noOfRounds: Yup.number()
    .required('Number of Rounds is required')
    .positive('Number of Rounds must be a positive integer')
    .integer('Number of Rounds must be a positive integer'),
  QR1: Yup.array().of(Yup.string()),
  QRT: Yup.array().of(Yup.string()),
  QRHR: Yup.array().of(Yup.string()),
});

export default function StuCompFeed({ SCF, completed, setSCF, fetchStuCompFeed }) {
  const { user, auth } = useContext(AuthCon)
  const baseURL = process.env.BASE_URL

  async function subSCF(values, { resetForm }, name) {
    const response = await fetch(`${baseURL}/student/postStuCompFeed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
      body: JSON.stringify({ values, rollno: user.rollno, name }),
    });
    const res = await response.json();
    console.log(res);
    if (res.success) {
      SCF.map(q => {
        if (q.name === name) {
          q.completed = true
        }
      })
      setSCF(SCF)
      fetchStuCompFeed();
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
          {console.log(SCF)}
          {SCF.length > 0 ? SCF.map((q, i) => {
            return (
              <div key={i}>
                {!completed && <p className='text-danger'>first fill the company feedbacks to access other features. if you dont you will be redirected to this page always</p>}
                <Accordion.Item eventKey={i}>
                  <Accordion.Header>{q.name}</Accordion.Header>
                  <Accordion.Body>
                    {q.completed && <div className='m-0 p-2 alert alert-success w-25 text-center'>Done Feedback submit!</div>}
                    {!q.completed ? <div className='mt-3'>
                      <Formik
                        initialValues={{ noOfRounds: "", didGD: "", GDTopic: "", QR1: [""], QRT1: [""], QRT2: [""], QRT3: [""], QRHR: [""], }}
                        validationSchema={schema}
                        onSubmit={(values, formikBag) => {
                          subSCF(values, formikBag, q.name);
                          console.log(values);
                        }}
                      >
                        {({ values, errors, handleSubmit }) => (
                          <Form onSubmit={handleSubmit} className='d-flex flex-column  '>
                            <FloatingLabel controlId="floatingInput" label="How many rounds did the company had" className="mb-3" >
                              <Field name="noOfRounds" className='form-control' type="number" />
                              <ErrorMessage className='text-danger' component="p" name="noOfRounds" />
                            </FloatingLabel>

                            <div className="d-flex gap-2 mb-3">
                              <label className="form-check-label" htmlFor="didGD"> Was there a GD Round for this company: </label>
                              <label> <Field type="radio" name="didGD" value="Yes" />Yes </label>
                              <label> <Field type="radio" name="didGD" value="No" /> No </label>
                            </div>

                            {values.didGD === "Yes" && (
                              <div className="mb-3">
                                <FloatingLabel controlId="GDTopic" label="GD Round Topic" className="mb-3" >
                                  <Field type="text" id="GDTopic" name="GDTopic" className="form-control" />
                                </FloatingLabel>
                              </div>
                            )}

                            <FieldArray name="QR1">
                              {({ push, remove, swap }) => (
                                <div>
                                  <h4>Questions for round 1</h4>
                                  < >
                                    {values.QR1.map((ques, index) => (
                                      <div key={index} className='d-flex '>
                                        <Field className=" " name={`QR1.${index}`}>
                                          {({ field }) => (
                                            <div className='flex-fill me-3'>
                                              <FloatingLabel controlId="floatingInput" label={`Round 1 Question ${index + 1}`} className="mb-3" >
                                                <input className='form-control' {...field} type="text" />
                                              </FloatingLabel>
                                              {errors.QR1 && errors.QR1[index] && <p className='ms-3 text-danger fw-bold'>{errors.QR1[index]}</p>}
                                            </div>
                                          )}
                                        </Field>
                                        <div>
                                          <Button className='me-3' variant="primary" onClick={() => push('')} > + </Button>
                                          <Button className='me-3' variant="secondary" onClick={() => index > 0 && swap(index, index - 1)} > ↑ </Button>
                                          <Button className='me-3' variant="secondary" onClick={() => index < values.QR1.length - 1 && swap(index, index + 1)} > ↓ </Button>
                                          <Button className='me-3' variant="danger" onClick={() => remove(index)}> - </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </>
                                </div>
                              )}
                            </FieldArray>

                            <FieldArray name="QRT1">
                              {({ push, remove, swap }) => (
                                < >
                                  <h4>Questions for technical round 1</h4>
                                  <div>
                                    {values.QRT1.map((ques, index) => (
                                      <div key={index} className='d-flex  '>
                                        <Field className="  " name={`QRT1.${index}`}>
                                          {({ field }) => (
                                            <div className='flex-fill me-3'>
                                              <FloatingLabel controlId="floatingInput" label={`Techinal Round 1 Question ${index + 1}`} className="mb-3" >
                                                <input className='form-control' {...field} type="text" />
                                              </FloatingLabel>
                                              {errors.QRT1 && errors.QRT1[index] && <p className='ms-3 text-danger fw-bold'>{errors.QRT1[index]}</p>}
                                            </div>
                                          )}
                                        </Field>
                                        <div>
                                          <Button className='me-3' variant="primary" onClick={() => push('')} > + </Button>
                                          <Button className='me-3' variant="secondary" onClick={() => index > 0 && swap(index, index - 1)} > ↑ </Button>
                                          <Button className='me-3' variant="secondary" onClick={() => index < values.QRT.length - 1 && swap(index, index + 1)} > ↓ </Button>
                                          <Button className='me-3' variant="danger" onClick={() => remove(index)}> - </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </FieldArray>

                            <FieldArray name="QRT2">
                              {({ push, remove, swap }) => (
                                < >
                                  <h4>Questions for technical round 2</h4>
                                  <div>
                                    {values.QRT2.map((ques, index) => (
                                      <div key={index} className='d-flex  '>
                                        <Field className="  " name={`QRT2.${index}`}>
                                          {({ field }) => (
                                            <div className='flex-fill me-3'>
                                              <FloatingLabel controlId="floatingInput" label={`Techinal Round 2 Question ${index + 1}`} className="mb-3" >
                                                <input className='form-control' {...field} type="text" />
                                              </FloatingLabel>
                                              {errors.QRT2 && errors.QRT2[index] && <p className='ms-3 text-danger fw-bold'>{errors.QRT2[index]}</p>}
                                            </div>
                                          )}
                                        </Field>
                                        <div>
                                          <Button className='me-3' variant="primary" onClick={() => push('')} > + </Button>
                                          <Button className='me-3' variant="secondary" onClick={() => index > 0 && swap(index, index - 1)} > ↑ </Button>
                                          <Button className='me-3' variant="secondary" onClick={() => index < values.QRT.length - 1 && swap(index, index + 1)} > ↓ </Button>
                                          <Button className='me-3' variant="danger" onClick={() => remove(index)}> - </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </FieldArray>

                            <FieldArray name="QRT3">
                              {({ push, remove, swap }) => (
                                < >
                                  <h4>Questions for technical round 3</h4>
                                  <div>
                                    {values.QRT3.map((ques, index) => (
                                      <div key={index} className='d-flex  '>
                                        <Field className="  " name={`QRT3.${index}`}>
                                          {({ field }) => (
                                            <div className='flex-fill me-3'>
                                              <FloatingLabel controlId="floatingInput" label={`Techinal Round Question ${index + 1}`} className="mb-3" >
                                                <input className='form-control' {...field} type="text" />
                                              </FloatingLabel>
                                              {errors.QRT3 && errors.QRT3[index] && <p className='ms-3 text-danger fw-bold'>{errors.QRT3[index]}</p>}
                                            </div>
                                          )}
                                        </Field>
                                        <div>
                                          <Button className='me-3' variant="primary" onClick={() => push('')} > + </Button>
                                          <Button className='me-3' variant="secondary" onClick={() => index > 0 && swap(index, index - 1)} > ↑ </Button>
                                          <Button className='me-3' variant="secondary" onClick={() => index < values.QRT.length - 1 && swap(index, index + 1)} > ↓ </Button>
                                          <Button className='me-3' variant="danger" onClick={() => remove(index)}> - </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </FieldArray>

                            <FieldArray name="QRHR">
                              {({ push, remove, swap }) => (
                                < >
                                  <h4>Questions for HR round</h4>
                                  <div>
                                    {values.QRHR.map((ques, index) => (
                                      <div key={index} className='d-flex  '>
                                        <Field className="  " name={`QRHR.${index}`}>
                                          {({ field }) => (
                                            <div className='flex-fill me-3'>
                                              <FloatingLabel controlId="floatingInput" label={`HR Round Question ${index + 1}`} className="mb-3"  >
                                                <input className='form-control' {...field} type="text" />
                                              </FloatingLabel>
                                              {errors.QRHR && errors.QRHR[index] && <p className='ms-3 text-danger fw-bold'>{errors.QRHR[index]}</p>}
                                            </div>
                                          )}
                                        </Field>
                                        <div>
                                          <Button className='me-3' variant="primary" onClick={() => push('')} > + </Button>
                                          <Button className='me-3' variant="secondary" onClick={() => index > 0 && swap(index, index - 1)} > ↑ </Button>
                                          <Button className='me-3' variant="secondary" onClick={() => index < values.QRHR.length - 1 && swap(index, index + 1)} > ↓ </Button>
                                          <Button className='me-3' variant="danger" onClick={() => remove(index)}> - </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </FieldArray>

                            <div>
                              <Button type="submit">Submit</Button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div> : <div className=' mt-3 ms-3'>
                      <div>
                        <ListGroup>
                          {Object.keys(q.stuFeed[user.rollno]).map((key, index) => (
                            <ListGroup.Item key={index}>
                              {key}: {Array.isArray(q.stuFeed[user.rollno][key]) ? q.stuFeed[user.rollno][key].join(", ") : q.stuFeed[user.rollno][key]}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    </div>}
                  </Accordion.Body>
                </Accordion.Item>
              </div>
            );
          }) : <p className='text-danger' >You are not eligible for any companies</p>}
        </Accordion>
      </div>
    </div>
  );
}
