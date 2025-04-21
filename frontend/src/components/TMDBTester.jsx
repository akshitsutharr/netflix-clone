import { useState, useEffect } from 'react';

const TMDBTester = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testTMDBAPI = async () => {
      try {
        setLoading(true);
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNGE2N2IxOGFmZjVmZGY1YmRhZWQzMTBiZGI0ZTlhMCIsIm5iZiI6MTc0NTIxMDg3Mi4zNywic3ViIjoiNjgwNWNkZjgwNTlmYmNlY2Y2YWFiMjRkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.PPWZ1-qXavetCU8p3Qs9IaCltxmQb5BM7YoVsnCJH2U';
        
        // Test configuration endpoint
        const configResponse = await fetch('https://api.themoviedb.org/3/configuration', {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!configResponse.ok) {
          throw new Error(`Configuration API failed: ${configResponse.status} ${configResponse.statusText}`);
        }
        
        const configData = await configResponse.json();
        
        // Test popular movies endpoint
        const moviesResponse = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!moviesResponse.ok) {
          throw new Error(`Movies API failed: ${moviesResponse.status} ${moviesResponse.statusText}`);
        }
        
        const moviesData = await moviesResponse.json();
        
        setResults({
          config: configData,
          movies: moviesData,
        });
      } catch (err) {
        console.error('TMDB Test Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    testTMDBAPI();
  }, []);
  
  if (loading) {
    return <div className="p-4 bg-black text-white">Testing TMDB API...</div>;
  }
  
  if (error) {
    return <div className="p-4 bg-black text-red-500">Error: {error}</div>;
  }
  
  return (
    <div className="p-4 bg-black text-white">
      <h2 className="text-xl font-bold mb-4">TMDB API Test Results</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Configuration:</h3>
        <pre className="bg-gray-800 p-2 rounded overflow-auto max-h-40">
          {JSON.stringify(results.config, null, 2)}
        </pre>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Popular Movies:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {results.movies?.results?.slice(0, 8).map(movie => (
            <div key={movie.id} className="bg-gray-800 rounded overflow-hidden">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                className="w-full h-auto"
              />
              <div className="p-2">
                <p className="font-medium truncate">{movie.title}</p>
                <p className="text-sm text-gray-400">{movie.release_date?.split('-')[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TMDBTester; 