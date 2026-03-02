import type { IClockPort } from "@/domain/ports/IClockPort";
import type { HealthStatus } from "@/domain/entities/HealthStatus";

export class HealthService {
  constructor(private readonly clock: IClockPort) {}

  getStatus(): HealthStatus {
    return { status: "ok", timestamp: this.clock.now() };
  }
}
