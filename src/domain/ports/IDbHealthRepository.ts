export interface IDbHealthRepository {
  countProducts(): Promise<number>
}
