import LineChart from '../charts/line';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs'

const dateTypes = ['Daily', 'Monthly']
const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'gray']

const MetricBChart = ({ data }) => {
  const [dateType, setDateType] = useState(dateTypes[0])
  const [chartData, setChartData] = useState(null)

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Metric B - FCS Prevalence',
      },
    },
  };

  useEffect(() => {
    if (data) {
      const labels = data.reduce((acc, obj) => {
        const date = new Date(obj.date)
        let key;
        switch (dateType) {
          case 'Monthly':
            key = dayjs(date).format('MMMM YYYY')
            break;
          default:
            key = date.toDateString()
        }
        if (acc.indexOf(key) === -1) {
          acc.push(key)
        }
        return acc
      }, [])
      const countries = data.reduce((acc, obj) => {
        if (!acc.find(k => k.iso3 === obj.country.iso3)) {
          acc.push(obj.country)
        }
        return acc
      }, [])
      setChartData({
        labels: labels,
        datasets: countries.map((country, i) => {
          return {
            label: country.name.concat(' Avg FCS Prevalence'),
            data: data.filter(k => k.country.id === country.id).map(d => d.prevalence),
            borderColor: colors[i],
            backgroundColor: colors[i],
          }
        })
      })
    }

    return () => {
      setChartData(null)
    }
  }, [data, dateType])

  if (!chartData) {
    return null
  }

  return (
    <div>
      <div className="form text-end">
        <select
          name="dateType"
          id="dateType"
          onChange={(e) => setDateType(e.target.value)}
          value={dateType}
          className="form-select"
        >
          {dateTypes.map((k, i) => <option key={i} value={k}>Freq. {k}</option>)}
        </select>
      </div>
      <LineChart data={chartData} options={options} />
    </div>
  )
}

export default MetricBChart

MetricBChart.propTypes = {
  data: PropTypes.array.isRequired
}