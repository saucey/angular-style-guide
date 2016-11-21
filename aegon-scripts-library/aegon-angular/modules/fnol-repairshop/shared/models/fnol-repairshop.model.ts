
export interface FNOLRepairshopInput {
  location: string,
  radius: number,
  type: string
}

export interface FNOLRepairshopResponse {
  retrieveLocatiesResponse: {
    PARTIJ: Array<any>
  }
}

export interface FNOLRepairshopResult {
  name: string,
  mail: string,
  phone: string,
  id: string,
  address: {
    latitude: string,
    longitude: string,
    houseNumber: string,
    postCode: string,
    city: string,
    street: string,
    radius: string,
    type: string,
  },
  ranking: string,
  website: string
}

export type FNOLRepairshopResults = Array<FNOLRepairshopResult>;
