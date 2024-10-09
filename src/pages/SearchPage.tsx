import { useState, useEffect }from 'react';
import { searchMoviesAndTvShows } from '@/config/tmdb';
import { NavBar } from "@/components/NavBar";
import { Input } from "@/components/ui/input";

interface SearchResult {
    id: number;
    title?: string;
    name?: string;
    media_type: 'movie' | 'tv';
    poster_path: string | null;
    // Diğer gerekli özellikler...
  }

const SearchPage = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          if (searchTerm) {
            searchMoviesAndTvShows(searchTerm).then(results => {
              setSearchResults(results)
            });
          } else {
            setSearchResults([]);
          }
        }, 300); // 300ms gecikme

        return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="fixed inset-x-0 top-12 z-30 mx-auto mb-4  origin-bottom h-full max-h-12">
      <Input
      className='z-50 pointer-events-auto relative mx-4 max-w-56 flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]'
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Film/Dizi ara..."
      />

<ul>
        {searchResults.map(result => (
          <li key={result.id}>
          <img
                src={`https://image.tmdb.org/t/p/w500/${result.poster_path}`}
                alt={result.title ?? result.name}
                style={{ width: '50px', height: 'auto' }}
              />
            {result.media_type === 'movie' ? result.title : result.name} ({result.media_type})

          </li>
        ))}
      </ul>
      <NavBar />
    </div>
  );
};

export default SearchPage;