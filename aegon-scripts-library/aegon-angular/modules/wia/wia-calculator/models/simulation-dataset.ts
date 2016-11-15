
export interface SimulationDatasetRequest {
  correlationId: string,
  income: number,
  IVA_EXCED?: string,
  WGA_EXCED?: string,
  WGA_AANV_UPGRADE?: string,
  WGA_AANV_LIGHT?: string,
  WIA_BODEM?: string,
  WIA_35MIN?: string
}

export interface Simulation {
  period: number,
  componentId: string,
  amountYearly: string,
  amountMonthly: string,
  productId?: string,
  benefitId?: string,
}

export interface SimulationDataset {
  [name: string]: SimulationDatasetRequest | Array<Simulation>
}

// Simulation key composed from income and products with attributes
// SimulationKey is unique for every http request
export type SimulationKey = string;
