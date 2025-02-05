import { useState, useEffect } from 'react';
import { searchMoviesAndTvShows } from '@/config/tmdb';
import { NavBar } from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {SearchResult} from "@/config/details.ts";
import { Plus } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { watchlistService } from '@/services/watchlistService';
import { Watchlist } from '@/types/watchlist';
import { auth } from '@/config/firebase';

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const defaultPoster = "https://incakoala.github.io/top9movie/film-poster-placeholder.png";
    const [watchlists, setWatchlists] = useState<Watchlist[]>([]);

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

    useEffect(() => {
        loadWatchlists();
    }, []);

    const loadWatchlists = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;
        const lists = await watchlistService.getUserWatchlists(userId);
        setWatchlists(lists);
    };

    const handleAddToWatchlist = async (watchlistId: string, result: SearchResult) => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const item = {
            title: result.title ?? result.name ?? '',
            type: result.media_type,
            posterPath: result.poster_path,
            addedBy: userId,
            addedAt: new Date(),
            tmdbId: result.id,
            overview: result.overview ?? ''
        };

        try {
            await watchlistService.addItemToWatchlist(watchlistId, item);
            // İsteğe bağlı: Başarılı ekleme mesajı göster
        } catch (error) {
            console.error('Error adding item to watchlist:', error);
        }
    };

    return (
        <div className="flex flex-col h-screen w-screen ">
            <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
                <div className="container mx-auto py-4 px-4">
                    <Input
                        className="max-w-md mx-auto "
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search for a Movie/TV Series"
                    />
                </div>
            </div>

            <ScrollArea className="flex-grow mt-20 mb-1 px-4 max-w-full ">
                <div className="container mx-auto max-w-screen-md ">
                    {searchResults
                        .filter(result => result.media_type !== 'person') // Filtreleme işlemi
                        .map(result => (
                        <Card key={result.id} className="mb-4">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w92/${result.poster_path}`}
                                        alt={result.title ?? result.name}
                                        className="w-16 h-24 object-cover rounded"
                                        onError={(e) => {
                                            e.currentTarget.src = defaultPoster; // Resim yüklenemezse varsayılan resmi atar
                                        }}
                                    />
                                    <div>
                                        <CardTitle>{result.title ?? result.name} {result.release_date || result.first_air_date ? `(${result.release_date?.slice(0, 4) ?? result.first_air_date?.slice(0, 4)})` : ''}</CardTitle>

                                        {(result.original_title !== result.title || result.original_name !== result.name) && (
                                            <CardTitle className='text-muted-foreground mt-2'>
                                                {result.original_title ?? result.original_name}
                                            </CardTitle>
                                        )}
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {result.media_type === 'movie' ? 'Movie' : 'TV Series'}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {watchlists.map((list) => (
                                            <DropdownMenuItem 
                                                key={list.id}
                                                onClick={() => handleAddToWatchlist(list.id, result)}
                                            >
                                                {list.name}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent>

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