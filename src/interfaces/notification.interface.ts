export interface NotificationItem {
    collectionId: string,
    collectionName: string,
    created: string,
    id: string,
    title: string,
    message: string,
    read_by: string,
    link: string,
    type: 'warning' | 'success' | 'error' | 'info'
}