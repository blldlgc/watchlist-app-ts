import { db } from '@/config/firebase';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDoc, 
    getDocs, 
    query, 
    where,
    arrayUnion,
    arrayRemove,
    Timestamp 
} from 'firebase/firestore';
import { Watchlist, WatchlistItem } from '@/types/watchlist';
import { auth } from '@/config/firebase';

const transformWatchlistDoc = (doc: any): Watchlist => {
    const data = doc.data();
    console.log('Transforming watchlist doc:', { id: doc.id, data });
    return {
        id: doc.id,
        name: data.name,
        ownerId: data.ownerId,
        ownerEmail: data.ownerEmail || '',
        sharedWith: data.sharedWith || [],
        items: data.items || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
    };
};

export const watchlistService = {
    async createWatchlist(userId: string, name: string): Promise<string> {
        const userEmail = auth.currentUser?.email;
        if (!userEmail) throw new Error('User email not found');

        console.log('Creating watchlist:', { userId, name, userEmail });

        const watchlistData = {
            name,
            ownerId: userId,
            ownerEmail: userEmail,
            sharedWith: [],
            items: [],
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        const docRef = await addDoc(collection(db, 'watchlists'), watchlistData);
        console.log('Watchlist created with ID:', docRef.id);
        return docRef.id;
    },

    async addItemToWatchlist(watchlistId: string, item: Omit<WatchlistItem, 'id'>): Promise<void> {
        const watchlistRef = doc(db, 'watchlists', watchlistId);
        const newItem = { ...item, id: crypto.randomUUID() };
        
        await updateDoc(watchlistRef, {
            items: arrayUnion(newItem),
            updatedAt: Timestamp.now()
        });
    },

    async removeItemFromWatchlist(watchlistId: string, itemId: string): Promise<void> {
        const watchlistRef = doc(db, 'watchlists', watchlistId);
        const watchlistDoc = await getDoc(watchlistRef);
        
        if (!watchlistDoc.exists()) return;
        
        const watchlist = watchlistDoc.data() as Watchlist;
        const updatedItems = watchlist.items.filter(item => item.id !== itemId);
        
        await updateDoc(watchlistRef, {
            items: updatedItems,
            updatedAt: Timestamp.now()
        });
    },

    async getUserWatchlists(userId: string): Promise<Watchlist[]> {
        const userEmail = auth.currentUser?.email;
        if (!userEmail) throw new Error('User email not found');

        console.log('Fetching watchlists for:', { userId, userEmail });

        try {
            // Get watchlists owned by the user
            const ownedQuery = query(
                collection(db, 'watchlists'),
                where('ownerId', '==', userId)
            );
            
            // Get watchlists shared with the user
            const sharedQuery = query(
                collection(db, 'watchlists'),
                where('sharedWith', 'array-contains', userEmail)
            );

            // Execute queries
            const [ownedSnapshot, sharedSnapshot] = await Promise.all([
                getDocs(ownedQuery),
                getDocs(sharedQuery)
            ]);

            console.log('Query results:', {
                ownedCount: ownedSnapshot.size,
                sharedCount: sharedSnapshot.size,
                ownedDocs: ownedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                sharedDocs: sharedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            });

            // Transform results
            const owned = ownedSnapshot.docs.map(transformWatchlistDoc);
            const shared = sharedSnapshot.docs.map(transformWatchlistDoc);

            // Combine and return results
            const allWatchlists = [...owned, ...shared];
            console.log('Final watchlists:', allWatchlists);

            return allWatchlists;
        } catch (error) {
            console.error('Error fetching watchlists:', error);
            throw error;
        }
    },

    async getWatchlistById(watchlistId: string): Promise<Watchlist> {
        const watchlistRef = doc(db, 'watchlists', watchlistId);
        const watchlistDoc = await getDoc(watchlistRef);
        
        if (!watchlistDoc.exists()) {
            throw new Error('Watchlist not found');
        }
        
        return transformWatchlistDoc(watchlistDoc);
    },

    async deleteWatchlist(watchlistId: string): Promise<void> {
        const watchlistRef = doc(db, 'watchlists', watchlistId);
        await deleteDoc(watchlistRef);
    },

    async shareWatchlist(watchlistId: string, userEmail: string): Promise<void> {
        if (!userEmail) throw new Error('Invalid email address');
        
        console.log('Sharing watchlist:', { watchlistId, userEmail });

        const watchlistRef = doc(db, 'watchlists', watchlistId);
        const watchlistDoc = await getDoc(watchlistRef);
        
        if (!watchlistDoc.exists()) {
            throw new Error('Watchlist not found');
        }

        const watchlist = watchlistDoc.data();
        console.log('Current watchlist data:', watchlist);

        if (watchlist.sharedWith?.includes(userEmail)) {
            throw new Error('Watchlist already shared with this user');
        }

        await updateDoc(watchlistRef, {
            sharedWith: arrayUnion(userEmail),
            updatedAt: Timestamp.now()
        });
        console.log('Watchlist shared successfully');
    },

    async unshareWatchlist(watchlistId: string, userEmail: string): Promise<void> {
        if (!userEmail) throw new Error('Invalid email address');

        const watchlistRef = doc(db, 'watchlists', watchlistId);
        await updateDoc(watchlistRef, {
            sharedWith: arrayRemove(userEmail),
            updatedAt: Timestamp.now()
        });
    }
}; 