import Papa from 'papaparse';
import { ElectricityRecord, StateAggregate } from '../types';
import { CSV_DATA } from '../constants';

let parsedData: ElectricityRecord[] = [];

export const loadData = async (): Promise<ElectricityRecord[]> => {
  if (parsedData.length > 0) return parsedData;

  return new Promise((resolve, reject) => {
    Papa.parse(CSV_DATA, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as ElectricityRecord[];
        parsedData = data;
        resolve(data);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
};

export const getNationalAggregates = (data: ElectricityRecord[]) => {
  const stateData = data.filter((d) => d.District === 'ALL');
  const years = Array.from(new Set(stateData.map((d) => d.Year))).sort();

  return years.map((year) => {
    const yearlyData = stateData.filter((d) => d.Year === year);
    const totalConsumption = yearlyData.reduce((sum, d) => sum + d.Total_Consumption_GWh, 0);
    const totalPop = yearlyData.reduce((sum, d) => sum + d.Population_millions, 0);
    const avgPerCapita = totalPop > 0 ? (totalConsumption * 1000) / totalPop : 0; // Approximate weighted avg
    const totalPeakDemand = yearlyData.reduce((sum, d) => sum + d.Peak_Demand_MW, 0);
    
    // Simple average for percentages for national overview (weighted would be better but simple for now)
    const avgRenewable = yearlyData.reduce((sum, d) => sum + d.Renewable_Share_pct, 0) / yearlyData.length;
    const avgHousehold = yearlyData.reduce((sum, d) => sum + d.Household_Consumption_pct, 0) / yearlyData.length;
    const avgIndustrial = yearlyData.reduce((sum, d) => sum + d.Industrial_Consumption_pct, 0) / yearlyData.length;

    return {
      Year: year,
      Total_Consumption_GWh: totalConsumption,
      Per_Capita_kWh: avgPerCapita,
      Peak_Demand_MW: totalPeakDemand,
      Renewable_Share_pct: avgRenewable,
      Household_Consumption_pct: avgHousehold,
      Industrial_Consumption_pct: avgIndustrial,
    };
  });
};

export const getStateData = (data: ElectricityRecord[], stateName: string) => {
  return data.filter((d) => d.State_UT === stateName && d.District === 'ALL').sort((a, b) => a.Year - b.Year);
};

export const getDistrictsForState = (data: ElectricityRecord[], stateName: string, year?: number) => {
  let filtered = data.filter((d) => d.State_UT === stateName && d.District !== 'ALL');
  if (year) {
    filtered = filtered.filter((d) => d.Year === year);
  }
  return filtered;
};

export const getAllStates = (data: ElectricityRecord[]) => {
  const states = Array.from(new Set(data.map((d) => d.State_UT))).sort();
  return states;
};
