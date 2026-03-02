import type { HealthStatus } from "@/domain/entities/HealthStatus";

export interface GetHealthResult {
  healthStatus: HealthStatus;
  message: string;
}
