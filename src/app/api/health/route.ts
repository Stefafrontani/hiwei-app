import { NextResponse } from "next/server";
import { SystemClockAdapter } from "@/infrastructure/adapters/SystemClockAdapter";
import { HealthService } from "@/domain/services/HealthService";
import { GetHealthUseCase } from "@/application/use-cases/health/GetHealth/GetHealth.usecase";
import { presentHealth } from "@/infrastructure/presenters/api";

export async function GET() {
  const clock = new SystemClockAdapter();
  const healthService = new HealthService(clock);
  const useCase = new GetHealthUseCase(healthService);
  const result = useCase.execute();

  return NextResponse.json(presentHealth(result));
}
