// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import { fetchData } from '../apis/data'
import Header from '../contents/Header'

const Dashboard = () => {
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [keyword, setKeyword] = useState('')

    // Filters & Options
    const initialFilters = {
        sector: '',
        country: '',
        city: '',
        region: '',
        topic: '',
        source: '',
        pestle: '',
        swot: '',
        end_year: ''
    }

    const [filters, setFilters] = useState(initialFilters)
    const [options, setOptions] = useState({
        sectors: [], countries: [], cities: [], regions: [],
        topics: [], sources: [], pestles: [], swots: [], years: []
    })

    // Pagination & Sorting
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const [sortConfig, setSortConfig] = useState({ column: 'title', order: 'asc' })

    const tableColumns = ['title', 'sector', 'country', 'end_year']

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchData()
                setData(result)
                setFilteredData(result)

                // Extract unique filter options
                const getUnique = (key) => [...new Set(result.map(item => item[key]).filter(Boolean))]

                setOptions({
                    sectors: getUnique('sector'),
                    countries: getUnique('country'),
                    cities: getUnique('city'),
                    regions: getUnique('region'),
                    topics: getUnique('topic'),
                    sources: getUnique('source'),
                    pestles: getUnique('pestle'),
                    swots: getUnique('swot'),
                    years: getUnique('end_year')
                })
            } catch (error) {
                console.error('Failed to fetch data:', error)
            }
        }
        loadData()
    }, [])

    useEffect(() => {
        let result = [...data]

        for (const [key, value] of Object.entries(filters)) {
            if (value) result = result.filter(item => item[key] === value)
        }

        if (keyword) {
            const lowerKeyword = keyword.toLowerCase()
            result = result.filter(item =>
                Object.values(item).some(value =>
                    value !== null && value !== undefined &&
                    String(value).toLowerCase().includes(lowerKeyword)
                )
            )
        }

        setFilteredData(result)
        setCurrentPage(1)
    }, [filters, keyword, data])

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const resetFilters = () => {
        setFilters(initialFilters)
        setKeyword('')
    }

    const handleSort = (column) => {
        setSortConfig(prev => ({
            column,
            order: prev.column === column && prev.order === 'asc' ? 'desc' : 'asc'
        }))
    }

    const sortedData = [...filteredData].sort((a, b) => {
        const valueA = a[sortConfig.column] ?? ''
        const valueB = b[sortConfig.column] ?? ''

        return sortConfig.order === 'asc'
            ? String(valueA).localeCompare(String(valueB))
            : String(valueB).localeCompare(String(valueA))
    })

    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    const renderFilter = (label, key, options) => (
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold">{label}</label>
            <select
                value={filters[key]}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                <option value="">All {label}</option>
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    )

    return (
        <div className="p-4 space-y-4">
            <Header />
            <h1 className="text-xl font-bold">Dashboard Data</h1>

            {/* Search & Reset */}
            <div className="flex space-x-2">
                <input
                    type="text"
                    placeholder="Search..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                />
                <button
                    onClick={resetFilters}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Reset All Filters
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {renderFilter('Sector', 'sector', options.sectors)}
                {renderFilter('Country', 'country', options.countries)}
                {renderFilter('City', 'city', options.cities)}
                {renderFilter('Region', 'region', options.regions)}
                {renderFilter('Topic', 'topic', options.topics)}
                {renderFilter('Source', 'source', options.sources)}
                {renderFilter('PEST', 'pestle', options.pestles)}
                {renderFilter('SWOT', 'swot', options.swots)}
                {renderFilter('End Year', 'end_year', options.years)}
            </div>

            {/* Data Table */}
            <div className="border rounded p-4 bg-gray-50 mt-4">
                {filteredData.length > 0 ? (
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                {tableColumns.map(col => (
                                    <th
                                        key={col}
                                        className="p-2 cursor-pointer"
                                        onClick={() => handleSort(col)}
                                    >
                                        {col.toUpperCase()} {sortConfig.column === col ? (sortConfig.order === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item, index) => (
                                <tr key={index} className="border-b last:border-none">
                                    <td className="p-2">{item.title}</td>
                                    <td className="p-2">{item.sector}</td>
                                    <td className="p-2">{item.country}</td>
                                    <td className="p-2">{item.end_year}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div>No data available for selected filters.</div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Dashboard
