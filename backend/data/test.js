
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./COL.json', 'utf8'))

console.log('len', data.length)

const monthly_data = data.reduce((acc, obj) => {
  const key = new Date(obj.date).getFullYear() + '-' + (new Date(obj.date).getMonth() + 1)
  if (!acc[key]) {
    acc[key] = {
      fcs_people: 0,
      fcs_prevalence: 0,
      count: 0
    }
  }
  acc[key].fcs_people += obj['metrics']['fcs']['people']
  acc[key].fcs_prevalence += obj['metrics']['fcs']['prevalence']
  acc[key].count += 1
  return acc
}, {})

const monthly_avg = Object.keys(monthly_data).reduce((acc, key) => {
  acc.push({ date: new Date(key.concat('-1')).toDateString(), fcs_people: monthly_data[key].fcs_people / monthly_data[key].count, fcs_prevalence: monthly_data[key].fcs_prevalence / monthly_data[key].count })
  return acc
}, [])

const keys = ['fcs', 'healthAccess', 'marketAccess', 'rcsi']

const avg_fcs_people = data.reduce((acc, obj) => {
  if (obj.metrics?.fcs?.people && new Date(obj.date).getFullYear() === 2022 && new Date(obj.date).getMonth() === 5) {
    acc.push(obj.metrics.fcs.people)
  }
  return acc
}, [])

console.log({ avg_fcs_people: avg_fcs_people.reduce((a, b) => a + b, 0) / avg_fcs_people.length })