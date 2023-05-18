// src/components/DataTable.jsx
const DataTable = ({ data, loading }) => (
    <div className="p-4 bg-white shadow rounded mt-4">
        {loading ? (
            <p>Loading data...</p>
        ) : data.length > 0 ? (
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Title</th>
                        <th className="p-2 border">Sector</th>
                        <th className="p-2 border">Country</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className="p-2 border">{item.title}</td>
                            <td className="p-2 border">{item.sector}</td>
                            <td className="p-2 border">{item.country}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p>No data available for selected filters.</p>
        )}
    </div>
)
export default DataTable
