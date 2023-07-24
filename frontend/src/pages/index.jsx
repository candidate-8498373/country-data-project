//import PropTypes from 'prop-types';
import LineChart from '../components/metricB/chart';
import { useCountryData } from '../hooks/swr'

const Home = () => {
  const { data: prevalence, error: pError, isLoading: pLoading } = useCountryData('metricB', ['COL', 'BFA'], '2022-06-01', '2023-07-01', true)
  if (!prevalence || pLoading) return <div>Loading...</div>

  //handle error cases
  if(pError) return <div>Error fetching data.</div>
  return (
    <div>
      <div className="container mx-auto px-2 mt-5">
        <h1 className="text-4xl text-center">WFP Assignment</h1>
        <div className="min-h-screen w-[100%] mx-auto">
          <LineChart data={prevalence} />
        </div>
      </div>

    </div>
  )
}

export default Home