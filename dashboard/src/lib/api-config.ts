export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const getAuthToken = () => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )bh-auth-token=([^;]+)'));
    return match ? match[2] : null;
};

export const getAdminUrl = (path: string) => {
    // This allows linking back to the Filament admin panel
    const adminBase = process.env.NEXT_PUBLIC_ADMIN_URL || "http://127.0.0.1:8000";
    return `${adminBase}${path}`;
};
