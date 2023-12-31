import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const LineChart = ({ data, options }) => {
  
  if (!data) {
    return null
  }

  return (
    <Line data={data} options={options} />
  )
}

export default LineChart

LineChart.propTypes = {
  data: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired
}