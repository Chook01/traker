export default class CustomDate {

    static calculateTimeAgo(oldDate: string): { key: string, value: number } {
        const date = new Date(oldDate);
        const now = new Date();
        const millisecondsDiff = now.getTime() - date.getTime();
    
        const minutes = Math.floor(millisecondsDiff / (1000 * 60));
        const hours = Math.floor(millisecondsDiff / (1000 * 60 * 60));
        const days = Math.floor(millisecondsDiff / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);
    
        if (minutes <= 0) {
            return { key: "Upravo sada", value: 0 };
        } else if (minutes < 60) {
            return { key: "min.", value: minutes };
        } else if (hours < 24) {
            return { key: "sati", value: hours };
        } else if (days === 1) {
            return { key: "Jučer", value: 0 };
        } else if (days < 30) {
            return { key: "dana", value: days };
        } else if (days < 365) {
            return { key: "mjeseci", value: months };
        } else {
            return { key: "godina", value: years };
        }
    }
    
}