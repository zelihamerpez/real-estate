import React, { useState } from 'react';

const ShipwreckSearch = () => {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [n, setN] = useState(5);
  const [results, setResults] = useState([]);
  

  const search = async () => {
    if (!lat || !lon || !n) return;

    try {
        console.log('lat, lon', lat, lon, 'n', n)
        const res = await fetch(`http://localhost:3000/api/shipwrecks/nearest?lat=${lat}&lon=${lon}&n=${n}`);
        console.log('Response status', res.status)
        const data = await res.json();
        console.log("Data:", data);
        setResults(data);
    } catch (err) {
        console.error('Search failed', err);
        setResults([]);
    }
  };

  return (
    <section style={{ fontFamily: 'Arial', padding: '20px' }}>
      <h2>Find Closest Shipwrecks</h2>

      <div>
        <label>
          Latitude:
          <input
            type="number"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            step="any"
          />
        </label>
      </div>

      <div>
        <label>
          Longitude:
          <input
            type="number"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            step="any"
          />
        </label>
      </div>

      <div>
        <label>
          Number of results:
          <input
            type="number"
            value={n}
            onChange={(e) => setN(e.target.value)}
            min="1"
          />
        </label>
      </div>

      <button onClick={search} style={{ marginTop: '10px' }}>
        Search
      </button>

      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
        <thead>
          {results.length > 0 && (
            <tr>
              {Object.keys(results[0]).map((key) => (
                <th
                  key={key}
                  style={{ border: '1px solid #ccc', padding: '8px', background: '#f0f0f0' }}
                >
                  {key}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {results.map((row, idx) => (
            <tr key={idx}>
              {Object.keys(row).map((key) => (
                <td key={key} style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {typeof row[key] === 'object' ? JSON.stringify(row[key]) : row[key]}
                </td>
              ))}
            </tr>
          ))}
          {results.length === 0 && (
            <tr>
              <td colSpan="100%">No results</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default ShipwreckSearch;
