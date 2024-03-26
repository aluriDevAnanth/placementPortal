import React, { useContext, useEffect, useState } from 'react'
import HODCon from '../../context/HODPro'
import Sidebar from './components/Sidebar'

export default function HODHome() {
  const { feed } = useContext(HODCon)
  const [count, setCount] = useState()

  useEffect(() => {
    try {
      if (feed && feed.length > 0) {
        const cseMentorReviews = feed.filter(review => review.mentordept === 'CSE');
        //console.log("Filtered mentors:", cseMentorReviews);

        const mentorReviewsCount = cseMentorReviews.reduce((acc, review) => {
          acc[review.mentorname] = (acc[review.mentorname] || 0) + 1;
          return acc;
        }, {});
        //console.log("Mentor Reviews Count:", mentorReviewsCount);

        setCount(mentorReviewsCount);
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [feed]);




  return (
    <div className='d-flex'>
      <div className='me-5'>
        <Sidebar />
      </div>
      <div className='flex-fill me-5'>
        <p className='fs-3 fw-bolder'>Mentor and No Of Reviews Per Mentor</p>
        {count && <table className='table table-striped table-hover table-bordered'>
          <thead>
            <tr>
              <th className='text-center'>Mentor name	</th>
              <th className='text-center'>Total no of contacts</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(count).map(([name, score], index) => (
              <tr key={index}>
                <td className='text-center'>{name}</td>
                <td className='text-center'>{score}</td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    </div>
  )
}
