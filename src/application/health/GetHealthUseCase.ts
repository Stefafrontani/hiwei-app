import { HealthService } from "@/domain/health/HealthService";
import type { HealthStatus } from "@/domain/health/HealthStatus";

export interface GetHealthResult {
  healthStatus: HealthStatus;
  message: string;
}

export class GetHealthUseCase {
  constructor(private readonly healthService: HealthService) {}

  execute(): GetHealthResult {
    return {
      healthStatus: this.healthService.getStatus(),
      message: "Server is running",
    };
  }
}
