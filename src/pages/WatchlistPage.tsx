import { useState, useEffect, useCallback } from 'react';
import { NavBar } from "@/components/NavBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users2, Trash2, UserCircle2 } from 'lucide-react';
import { auth } from "@/config/firebase";
import { watchlistService } from '@/services/watchlistService';
import { Watchlist } from '@/types/watchlist';
import { DialogManager } from '@/components/DialogManager';
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WatchlistPage = () => {
    const [watchlists, setWatchlists] = useState<{owned: Watchlist[], shared: Watchlist[]}>({
        owned: [],
        shared: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const loadWatchlists = useCallback(async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        console.log('Loading watchlists for user:', userId);
        setIsLoading(true);
        try {
            const lists = await watchlistService.getUserWatchlists(userId);
            console.log('Received watchlists:', lists);
            
            const ownedLists = lists.filter(list => list.ownerId === userId);
            const sharedLists = lists.filter(list => list.ownerId !== userId);
            
            console.log('Filtered lists:', {
                owned: ownedLists,
                shared: sharedLists
            });

            setWatchlists({
                owned: ownedLists,
                shared: sharedLists
            });
        } catch (error) {
            console.error('Error loading watchlists:', error);
            toast({
                title: "Error",
                description: "Failed to load watchlists",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        console.log('WatchlistPage mounted');
        loadWatchlists();
    }, [loadWatchlists]);

    const handleCreateWatchlist = async (name: string) => {
        const userId = auth.currentUser?.uid;
        if (!userId || !name.trim()) return;

        console.log('Creating watchlist:', name);
        try {
            await watchlistService.createWatchlist(userId, name);
            toast({
                title: "Success",
                description: "Watchlist created successfully"
            });
            loadWatchlists();
        } catch (error) {
            console.error('Error creating watchlist:', error);
            toast({
                title: "Error",
                description: "Failed to create watchlist",
                variant: "destructive"
            });
        }
    };

    const handleDeleteWatchlist = async (watchlistId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            await watchlistService.deleteWatchlist(watchlistId);
            toast({
                title: "Success",
                description: "Watchlist deleted successfully"
            });
            loadWatchlists();
        } catch (error) {
            console.error('Error deleting watchlist:', error);
            toast({
                title: "Error",
                description: "Failed to delete watchlist",
                variant: "destructive"
            });
        }
    };

    const handleShareWatchlist = async (watchlistId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        console.log('Opening share dialog for watchlist:', watchlistId);
        DialogManager.show(
            "Share Watchlist",
            "Enter the email address of the user you want to share with",
            <div className="space-y-4">
                <Input
                    placeholder="Email Address"
                    type="email"
                    onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                            const email = (e.target as HTMLInputElement).value;
                            console.log('Sharing watchlist with:', email);
                            try {
                                await watchlistService.shareWatchlist(watchlistId, email);
                                DialogManager.hide();
                                toast({
                                    title: "Success",
                                    description: "Watchlist shared successfully"
                                });
                                loadWatchlists();
                            } catch (error) {
                                console.error('Error sharing watchlist:', error);
                                toast({
                                    title: "Error",
                                    description: error instanceof Error ? error.message : "Failed to share watchlist",
                                    variant: "destructive"
                                });
                            }
                        }
                    }}
                />
            </div>
        );
    };

    const showCreateDialog = () => {
        DialogManager.show(
            "Create New Watchlist",
            "Enter a name for your new watchlist",
            <div className="space-y-4">
                <Input
                    placeholder="Watchlist Name"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleCreateWatchlist((e.target as HTMLInputElement).value);
                            DialogManager.hide();
                        }
                    }}
                />
            </div>
        );
    };

    const WatchlistCard = ({ watchlist, isShared = false }: { watchlist: Watchlist, isShared?: boolean }) => (
        <Card 
            key={watchlist.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            onClick={() => navigate(`/watchlist/${watchlist.id}`)}
        >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4">
                <div className="space-y-1">
                    <CardTitle className="text-xl line-clamp-1">{watchlist.name}</CardTitle>
                    {isShared && (
                        <CardDescription className="flex items-center gap-1">
                            <UserCircle2 className="h-4 w-4" />
                            <span className="line-clamp-1">Shared by {watchlist.ownerEmail}</span>
                        </CardDescription>
                    )}
                </div>
                <div className="flex gap-1">
                    {!isShared && (
                        <>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => handleShareWatchlist(watchlist.id, e)}
                            >
                                <Users2 className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => handleDeleteWatchlist(watchlist.id, e)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">
                        {watchlist.items.length} items
                    </p>
                    {watchlist.sharedWith?.length > 0 && !isShared && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Users2 className="h-3 w-3" />
                            Shared with {watchlist.sharedWith.length} {watchlist.sharedWith.length === 1 ? 'person' : 'people'}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="flex flex-col h-screen w-screen">
            <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
                <div className="container mx-auto py-4 px-4">
                    <div className="max-w-screen-lg mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold">My Watchlists</h1>
                        <Button onClick={showCreateDialog} size="sm" variant="default">
                            <Plus className="mr-2 h-4 w-4" />
                            New Watchlist
                        </Button>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-grow mt-20 mb-1">
                <div className="container mx-auto max-w-screen-lg px-4">
                    <Tabs defaultValue="owned" className="w-full">
                        <TabsList className="mb-4 w-full justify-start bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <TabsTrigger value="owned" className="flex-1 sm:flex-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                My Watchlists ({watchlists.owned.length})
                            </TabsTrigger>
                            <TabsTrigger value="shared" className="flex-1 sm:flex-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                Shared with Me ({watchlists.shared.length})
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="owned" className={cn(
                            "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
                            isLoading && "opacity-50 pointer-events-none"
                        )}>
                            {watchlists.owned.map((watchlist) => (
                                <WatchlistCard key={watchlist.id} watchlist={watchlist} />
                            ))}
                            {watchlists.owned.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12">
                                    <p className="text-center text-muted-foreground">
                                        You haven't created any watchlists yet
                                    </p>
                                    <Button onClick={showCreateDialog} variant="outline" size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Your First Watchlist
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="shared" className={cn(
                            "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
                            isLoading && "opacity-50 pointer-events-none"
                        )}>
                            {watchlists.shared.map((watchlist) => (
                                <WatchlistCard key={watchlist.id} watchlist={watchlist} isShared={true} />
                            ))}
                            {watchlists.shared.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center gap-2 py-12">
                                    <p className="text-center text-muted-foreground">
                                        No watchlists have been shared with you yet
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="mt-24"></div>
            </ScrollArea>

            <div className="fixed bottom-0 left-0 right-0">
                <NavBar />
            </div>
        </div>
    );
};

export default WatchlistPage; 