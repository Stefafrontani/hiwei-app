import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import type { HealthStatus } from "@/domain/health/HealthStatus";
import { SystemClockAdapter } from "@/infrastructure/clock/SystemClockAdapter";
import { HealthService } from "@/domain/health/HealthService";
import { GetHealthUseCase } from "@/application/health/GetHealthUseCase";

export async function GET() {
  const clock = new SystemClockAdapter();
  const healthService = new HealthService(clock);
  const useCase = new GetHealthUseCase(healthService);
  const result = useCase.execute();

  const body: ApiResponse<HealthStatus> = {
    data: result.healthStatus,
    message: result.message,
  };
  return NextResponse.json(body);
}
