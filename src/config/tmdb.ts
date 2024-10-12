import axios from 'axios';
import { SearchResult} from './details.ts'
//const baseURL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


  const searchMoviesAndTvShows = async (query: string): Promise<SearchResult[]> => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`);
      return response.data.results.map((result: any) => ({
        ...result,
        // title veya name özelliğini media_type'a göre ayarlayın
        title: result.media_type === 'movie' ? result.title : undefined,
        name: result.media_type === 'tv' ? result.name : undefined,
       }));
  
    } catch (error) {
      console.error("TMDb API isteği hatası:", error);
      return [];
    }
  };

export { searchMoviesAndTvShows };