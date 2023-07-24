import useSWR from 'swr'
import PropTypes from 'prop-types';

//normally this would come from env vars
const api_url = `http://localhost:5001`

export const useCountryData = (
  type,
  iso3,
  date_start = '2022-06-01',
  date_end = '2023-07-01',
  useLocal = true
) => {

  const ISO3 = Array.isArray(iso3) ? iso3.map(k => k.trim()).join(',') : iso3

  let url = `${api_url}/api/country/${ISO3}/${date_start}/${date_end}/`
  switch (type) {
    case 'metricA':
      url = url.concat(`metricA`)
      break;
    case 'metricB':
      url = url.concat(`metricB`)
      break;
    default:
      url = null
  }

  const { data, error, isLoading } = useSWR(url ? `${url}?useLocal=${useLocal}` : null)

  return {
    data,
    error,
    isLoading
  }
}

useCountryData.PropTypes = {
  type: PropTypes.string.isRequired,
  iso3: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  date_start: PropTypes.string,
  date_end: PropTypes.string,
  useLocal: PropTypes.bool
}