const fetchData = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString()
  const response = await fetch(`http://localhost:5000/api/data?${queryParams}`)
  if (!response.ok) {
      throw new Error('Failed to fetch data')
  }
  return await response.json()
}
