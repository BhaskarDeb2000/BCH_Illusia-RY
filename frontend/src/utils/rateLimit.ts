interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

export class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor({ maxRequests, windowMs }: RateLimitOptions) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  public canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  public getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    return Math.max(0, this.maxRequests - this.requests.length);
  }

  public getTimeUntilReset(): number {
    if (this.requests.length === 0) return 0;

    const oldestRequest = Math.min(...this.requests);
    const resetTime = oldestRequest + this.windowMs;
    return Math.max(0, resetTime - Date.now());
  }
}

// Create a singleton instance for the entire application
export const globalRateLimiter = new RateLimiter({
  maxRequests: 100, // Maximum number of requests
  windowMs: 60000, // Time window in milliseconds (1 minute)
});

// Create a more restrictive rate limiter for specific operations
export const strictRateLimiter = new RateLimiter({
  maxRequests: 10, // Maximum number of requests
  windowMs: 60000, // Time window in milliseconds (1 minute)
}); 