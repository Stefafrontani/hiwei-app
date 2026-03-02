export interface HealthStatus {
  readonly status: "ok" | "degraded" | "down";
  readonly timestamp: string; // ISO-8601
}
