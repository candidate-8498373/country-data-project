
export const fetcher = (...args) =>
  fetch(...args)
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return { result: false }
    })