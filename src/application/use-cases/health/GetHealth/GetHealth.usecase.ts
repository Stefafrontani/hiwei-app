import { HealthService } from "@/domain/services/HealthService";
import type { GetHealthResult } from "./GetHealth.dto";

export class GetHealthUseCase {
  constructor(private readonly healthService: HealthService) {}

  execute(): GetHealthResult {
    return {
      healthStatus: this.healthService.getStatus(),
      message: "Server is running",
    };
  }
}
