// src/apis/data.js
export const fetchData = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString()
  const response = await fetch(`http://localhost:5000/api/data?${query}`)
  if (!response.ok) {
      throw new Error('Failed to fetch data')
  }
  return await response.json()
}
