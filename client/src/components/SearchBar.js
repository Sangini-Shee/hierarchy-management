import { useState } from "react";
import API from "../services/api";

function SearchBar() {
  const [name, setName] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const res = await API.get(`/people/search/${name}`);
    setResults(res.data);
  };

  return (
    <div>
      <input
        placeholder="Search person..."
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {results.map(r => (
        <div key={r._id}>
          {r.name} ({r.role})
        </div>
      ))}
    </div>
  );
}

export default SearchBar;