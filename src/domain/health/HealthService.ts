import type { IClockPort } from "./IClockPort";
import type { HealthStatus } from "./HealthStatus";

export class HealthService {
  constructor(private readonly clock: IClockPort) {}

  getStatus(): HealthStatus {
    return { status: "ok", timestamp: this.clock.now() };
  }
}
