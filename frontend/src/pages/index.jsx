//import PropTypes from 'prop-types';
import LineChart from '../components/metricB/chart';
import { useCountryData } from '../hooks/swr'
import { useState } from 'react'

const Home = () => {
  const [useLocal, setUseLocal] = useState(true)
  const { data: prevalence, error: pError, isLoading: pLoading } = useCountryData('metricB', ['COL', 'BFA'], '2022-06-01', '2023-07-01', useLocal)

  if (!prevalence || pLoading) return (
    <div className="text-center p-5">Loading from API... If it takes too long, you can switch to <UseLocalButton setUseLocal={setUseLocal}>Local data</UseLocalButton></div>
  )

  //handle error cases
  if (pError) return (
    <div className="text-center p-5">Error loading data. Make sure the backend is running or switch to <UseLocalButton setUseLocal={setUseLocal}>Local data</UseLocalButton></div>
  )
  return (
    <div>
      <div className="container mx-auto px-2 mt-5">
        <h1 className="text-4xl text-center">WFP Assignment</h1>
        <div className="min-h-screen w-[100%] mx-auto">
          <LineChart data={prevalence} useLocal={useLocal} setUseLocal={setUseLocal} />
        </div>
      </div>

    </div>
  )
}

const UseLocalButton = ({ setUseLocal, children }) => {
  return (
    <a className="font-bold underline" href="#local" onClick={e => { e.preventDefault(); setUseLocal(true) }}>{children}</a>
  )
}

export default Home