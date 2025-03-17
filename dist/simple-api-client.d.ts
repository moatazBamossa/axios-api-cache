import { AxiosRequestConfig } from 'axios';
type APIConfig = {
    baseURL?: string;
    headers?: Record<string, string>;
    cacheTTL?: number;
};
declare class SimpleAPIClient {
    private instance;
    private cache;
    private defaultCacheTTL;
    constructor(config?: APIConfig);
    private generateCacheKey;
    get<T>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T>;
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    clearCache(url?: string): void;
}
export default SimpleAPIClient;
