import { useState, useEffect } from 'react';
import { searchMoviesAndTvShows } from '@/config/tmdb';
import { NavBar } from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {SearchResult} from "@/config/details.ts";


const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const defaultPoster = "https://incakoala.github.io/top9movie/film-poster-placeholder.png";

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                searchMoviesAndTvShows(searchTerm).then(results => {
                    setSearchResults(results);
                    console.log(results);
                });
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    return (
        <div className="flex flex-col h-screen w-screen ">
            <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
                <div className="container mx-auto py-4 px-4">
                    <Input
                        className="max-w-md mx-auto "
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Film/Dizi ara..."
                    />
                </div>
            </div>

            <ScrollArea className="flex-grow mt-20 mb-1 px-4 max-w-full ">
                <div className="container mx-auto max-w-screen-md ">
                    {searchResults
                        .filter(result => result.media_type !== 'person') // Filtreleme işlemi
                        .map(result => (
                        <Card key={result.id} className="mb-4">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <img
                                    src={`https://image.tmdb.org/t/p/w92/${result.poster_path}`}
                                    alt={result.title ?? result.name}
                                    className="w-16 h-24 object-cover rounded"
                                    onError={(e) => {
                                        e.currentTarget.src = defaultPoster; // Resim yüklenemezse varsayılan resmi atar
                                    }}
                                />
                                <div>
                                    <CardTitle>{result.title ?? result.name} {result.release_date || result.first_air_date ? `(${result.release_date?.slice(0, 4) || result.first_air_date?.slice(0, 4)})` : ''}</CardTitle>

                                    {(result.original_title !== result.title || result.original_name !== result.name) && (
                                        <CardTitle className='text-muted-foreground mt-2'>
                                            {result.original_title ?? result.original_name}
                                        </CardTitle>
                                    )}
                                </div>


                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                    {result.media_type === 'movie' ? 'Movie' : 'TV Series'}
                                </p>
                                <p className="text-sm line-clamp-2">{result.overview}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="mt-24"></div>
            </ScrollArea>

            <div className="fixed bottom-0 left-0 right-0">
                <NavBar />
            </div>
        </div>
    );
};

export default SearchPage;