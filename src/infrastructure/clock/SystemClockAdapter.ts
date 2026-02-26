import type { IClockPort } from "@/domain/health/IClockPort";

export class SystemClockAdapter implements IClockPort {
  now(): string {
    return new Date().toISOString();
  }
}
