export interface Order {
    client: string,
    collectionId: string,
    collectionName: string,
    created: string,
    description: string,
    id: string,
    images: string[],
    location: 'shop' | 'graver_elite' | 'daske_za_rezanje' | 'olx' | 'messenger' | 'unknown' | 'personal',
    status: 'order' | 'done' | 'delivery' | 'payment',
    updated: string,
    thumbnails: string[],
    trackingNumber: string,
}