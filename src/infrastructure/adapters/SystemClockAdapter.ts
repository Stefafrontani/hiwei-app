import type { IClockPort } from "@/domain/ports/IClockPort";

export class SystemClockAdapter implements IClockPort {
  now(): string {
    return new Date().toISOString();
  }
}
