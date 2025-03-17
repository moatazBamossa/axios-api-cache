"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// simple-api-client.ts
const axios_1 = __importDefault(require("axios"));
class SimpleAPIClient {
    constructor(config = {}) {
        this.instance = axios_1.default.create({
            baseURL: config.baseURL,
            headers: config.headers,
        });
        this.cache = new Map();
        this.defaultCacheTTL = config.cacheTTL || 300000; // 5 minutes
    }
    generateCacheKey(url, params) {
        const sortedParams = params ? Object.entries(params).sort().toString() : '';
        return `${url}|${sortedParams}`;
    }
    get(url, params, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = this.generateCacheKey(url, params);
            const cachedEntry = this.cache.get(cacheKey);
            if (cachedEntry && Date.now() - cachedEntry.timestamp < this.defaultCacheTTL) {
                return cachedEntry.data;
            }
            const response = yield this.instance.get(url, Object.assign(Object.assign({}, config), { params }));
            this.cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
            return response.data;
        });
    }
    post(url, data, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.instance.post(url, data, config);
            return response.data;
        });
    }
    put(url, data, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.instance.put(url, data, config);
            return response.data;
        });
    }
    delete(url, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.instance.delete(url, config);
            return response.data;
        });
    }
    clearCache(url) {
        if (url) {
            const keysToDelete = Array.from(this.cache.keys()).filter(key => key.startsWith(url));
            keysToDelete.forEach(key => this.cache.delete(key));
        }
        else {
            this.cache.clear();
        }
    }
}
exports.default = SimpleAPIClient;
