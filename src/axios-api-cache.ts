// axios-simple-api-cache.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type CacheEntry = {
  data: any;
  timestamp: number;
};

type APIConfig = {
  baseURL?: string;
  headers?: Record<string, string>;
  cacheTTL?: number; // Cache time-to-live in milliseconds (default: 5 minutes)
};

class AxiosAPICashing {
  private instance: AxiosInstance;
  private cache: Map<string, CacheEntry>;
  private defaultCacheTTL: number;

  constructor(config: APIConfig = {}) {
    this.instance = axios.create({
      baseURL: config.baseURL,
      headers: config.headers,
    });
    
    this.cache = new Map();
    this.defaultCacheTTL = config.cacheTTL || 300000; // 5 minutes
  }

  private generateCacheKey(url: string, params?: Record<string, any>): string {
    const sortedParams = params ? Object.entries(params).sort().toString() : '';
    return `${url}|${sortedParams}`;
  }

  async get<T>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
    const cacheKey = this.generateCacheKey(url, params);
    const cachedEntry = this.cache.get(cacheKey);

    if (cachedEntry && Date.now() - cachedEntry.timestamp < this.defaultCacheTTL) {
      return cachedEntry.data;
    }

    const response = await this.instance.get<T>(url, { ...config, params });
    this.cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  clearCache(url?: string): void {
    if (url) {
      const keysToDelete = Array.from(this.cache.keys()).filter(key => key.startsWith(url));
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }
}

export default AxiosAPICashing;