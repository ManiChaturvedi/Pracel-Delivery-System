import { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parcels, setParcels] = useState([]);
  const [search, setSearch] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an XML file.');
      return;
    }
    setLoading(true);
    setError('');
    setParcels([]);
    try {
      const formData = new FormData();
      formData.append('xmlFile', file);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${apiUrl}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const transformedParcels = response.data.results.map(parcel => ({
        id: parcel.id,
        name: parcel.recipient,
        weight: parcel.weight,
        value: parcel.value,
        department: Array.isArray(parcel.departments) ? parcel.departments.join(', ') : parcel.departments,
        delivery: parcel.delivery
      }));
      setParcels(transformedParcels);
    } catch (err) {
      setError('Failed to upload or parse file.');
    } finally {
      setLoading(false);
    }
  };

  const filteredParcels = parcels.filter(parcel => {
    const query = search.toLowerCase();
    return (
      parcel.name.toLowerCase().includes(query) ||
      parcel.department.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Parcel Delivery System</h1>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
        onSubmit={handleUpload}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Upload XML File</h1>
        <input
          type="file"
          accept=".xml"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded mb-4 p-2"
        />
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload & Route'}
        </button>
      </form>

      {parcels.length > 0 && (
        <>
          <div className="flex items-center mb-4 gap-4">
            <input
              type="text"
              placeholder="Search by name or department..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded p-2 w-64"
            />
          </div>
          <div className="w-full max-w-3xl bg-white shadow rounded p-4">
            <h2 className="text-xl font-semibold mb-4 text-center">Routed Parcels</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"> Expected Delivery</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredParcels.map((parcel) => (
                    <tr key={parcel.id}>
                      <td className="px-4 py-2 whitespace-nowrap">{parcel.id}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{parcel.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{parcel.weight}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{parcel.value}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                          {parcel.department}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span >
                          {parcel.delivery}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
