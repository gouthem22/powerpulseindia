
export interface ElectricityRecord {
  State_UT: string;
  District: string;
  Year: number;
  Population_millions: number;
  Total_Consumption_GWh: number;
  Per_Capita_kWh: number;
  Household_Consumption_pct: number;
  Industrial_Consumption_pct: number;
  Renewable_Share_pct: number;
  Peak_Demand_MW: number;
  Is_Tamil_Nadu: number; // 0 or 1
}

export type StateAggregate = {
  State_UT: string;
  Year: number;
  Total_Consumption_GWh: number;
  Per_Capita_kWh: number;
  Peak_Demand_MW: number;
  Renewable_Share_pct: number;
  Household_Consumption_pct: number;
  Industrial_Consumption_pct: number;
  Is_Tamil_Nadu: boolean;
};

export enum PageRoutes {
  HOME = '/',
  STATES = '/states',
  STATE_DETAIL = '/states/:stateName',
  DISTRICTS = '/districts',
  PREDICTOR = '/predictor',
  DATASET = '/dataset',
  ABOUT = '/about',
}
