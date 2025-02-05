import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, X } from 'lucide-react';
import { watchlistService } from '@/services/watchlistService';
import { Watchlist } from '@/types/watchlist';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface WatchlistDetailProps {
    watchlist: Watchlist | null;
    isOpen: boolean;
    onClose: () => void;
    onItemRemoved: () => void;
}

const WatchlistDetail = ({ watchlist, isOpen, onClose, onItemRemoved }: WatchlistDetailProps) => {
    const defaultPoster = "https://incakoala.github.io/top9movie/film-poster-placeholder.png";

    const handleRemoveItem = async (itemId: string) => {
        if (!watchlist) return;
        try {
            await watchlistService.removeItemFromWatchlist(watchlist.id, itemId);
            onItemRemoved();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle>{watchlist?.name}</DialogTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>
                
                <ScrollArea className="flex-grow pr-4">
                    <div className="space-y-4">
                        {watchlist?.items.map((item) => (
                            <Card key={item.id} className="flex">
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
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default WatchlistDetail; 