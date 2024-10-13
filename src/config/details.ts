export interface SearchResult {
    id: number;
    title?: string;
    name?: string;
    media_type: 'movie' | 'tv' | 'person' ;
    poster_path: string | null;
    overview?: string | null;
    release_date?: string | null; // Filmler için
    first_air_date?: string | null; // Diziler için
    original_title?: string;
    original_name?: string;
}