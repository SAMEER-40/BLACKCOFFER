import React, { useEffect, useState } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/components/ui/select'
import { fetchData } from '../apis/data'

const Dashboard = () => {
    const [data, setData] = useState([])
    const [sectors, setSectors] = useState([])
    const [countries, setCountries] = useState([])
    const [selectedSector, setSelectedSector] = useState('')
    const [selectedCountry, setSelectedCountry] = useState('')
    const [loading, setLoading] = useState(false)

    // Fetch data based on filters
    const loadData = async () => {
        setLoading(true)
        try {
            const filters = {}
            if (selectedSector) filters.sector = selectedSector
            if (selectedCountry) filters.country = selectedCountry

            const fetchedData = await fetchData(filters)
            setData(fetchedData)

            // Extract filter options from data (just in case you want dynamic filtering)
            const allSectors = [...new Set(fetchedData.map(item => item.sector).filter(Boolean))]
            const allCountries = [...new Set(fetchedData.map(item => item.country).filter(Boolean))]

            setSectors(allSectors)
            setCountries(allCountries)
        } catch (err) {
            console.error('Failed to fetch data:', err)
        } finally {
            setLoading(false)
        }
    }

    // Initial data + filters load
    useEffect(() => {
        loadData()
    }, [selectedSector, selectedCountry])

    // Reset Filters
    const resetFilters = () => {
        setSelectedSector('')
        setSelectedCountry('')
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold mb-4">Blackcoffer Dashboard</h1>

            {/* Filters */}
            <div className="flex gap-4 mb-6 items-center">
                {/* Sector Filter */}
                <Select onValueChange={setSelectedSector} value={selectedSector}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Sector" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Sectors</SelectItem>
                        {sectors.map(sector => (
                            <SelectItem key={sector} value={sector}>
                                {sector}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Country Filter */}
                <Select onValueChange={setSelectedCountry} value={selectedCountry}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Countries</SelectItem>
                        {countries.map(country => (
                            <SelectItem key={country} value={country}>
                                {country}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Reset Button */}
                <button
                    className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded"
                    onClick={resetFilters}
                >
                    Reset Filters
                </button>
            </div>

            {/* Data Table */}
            <div className="border rounded p-4 bg-gray-50">
                {loading ? (
                    <div>Loading data...</div>
                ) : data.length > 0 ? (
                    data.map((item, index) => (
                        <div key={index} className="p-2 border-b last:border-none">
                            <strong>{item.title}</strong> - {item.sector} - {item.country}
                        </div>
                    ))
                ) : (
                    <div>No data found for selected filters.</div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
