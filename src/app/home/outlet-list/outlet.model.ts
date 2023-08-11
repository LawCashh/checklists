export interface Outlet {
  id: string;
  corporateId: string;
  masterCompanyId: string | null;
  name: string;
  code: string;
  typeId: number;
  discontinued: boolean;
  franchiseId: string;
  countryId: string;
  brandId: string | null;
  edi: string | null,
  storeOpenDate: string | null,
  comparisonStartDate: string | null,
  internalOrdering: boolean
}
