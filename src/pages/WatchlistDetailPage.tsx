import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar } from "@/components/NavBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft } from 'lucide-react';
import { auth } from "@/config/firebase";
import { watchlistService } from '@/services/watchlistService';
import { Watchlist } from '@/types/watchlist';
import { motion } from "framer-motion";

const WatchlistDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [watchlist, setWatchlist] = useState<Watchlist | null>(null);
    const defaultPoster = "https://incakoala.github.io/top9movie/film-poster-placeholder.png";

    useEffect(() => {
        if (id) {
            loadWatchlist();
        }
    }, [id]);

    const loadWatchlist = async () => {
        if (!id) return;
        try {
            const watchlistData = await watchlistService.getWatchlistById(id);
            setWatchlist(watchlistData);
        } catch (error) {
            console.error('Error loading watchlist:', error);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        if (!id) return;
        try {
            await watchlistService.removeItemFromWatchlist(id, itemId);
            loadWatchlist();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-background"
        >
            <ScrollArea className="h-screen">
                <div className="container mx-auto p-4">
                    <div className="flex items-center gap-4 mb-6">
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => navigate('/watchlist')}
                            className="hover:bg-accent"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-2xl font-bold">{watchlist?.name}</h1>
                    </div>
                    
                    <div className="space-y-4">
                        {watchlist?.items.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card className="flex">
                                    <div className="flex-1">
                                        <CardHeader className="flex flex-row items-center gap-4">
                                            <img
                                                src={item.posterPath ? `https://image.tmdb.org/t/p/w92/${item.posterPath}` : defaultPoster}
                                                alt={item.title}
                                                className="w-16 h-24 object-cover rounded"
                                            />
                                            <div>
                                                <CardTitle>{item.title}</CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.type === 'movie' ? 'Movie' : 'TV Series'}
                                                </p>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {item.overview}
                                            </p>
                                        </CardContent>
                                    </div>
                                    <div className="flex items-center pr-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="mt-24"></div>
            </ScrollArea>

            <div className="fixed bottom-0 left-0 right-0">
                <NavBar />
            </div>
        </motion.div>
    );
};

export default WatchlistDetailPage; 