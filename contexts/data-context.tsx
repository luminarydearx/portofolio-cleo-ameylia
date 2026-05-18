"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface PortfolioData {
  profileImage: string;
  socialLinks: {
    instagram: string;
    email: string;
    github: string;
    resume: string;
  };
  projects: Array<{
    id: number;
    title: string;
    description: string;
    image?: string;
    tags: string[];
    github: string;
    demo: string;
    stars: string;
    gradient: string;
    screenColor: string;
    metricValue: string;
    metricLabel: string;
  }>;
  aboutStats: {
    companiesValue: number;
    fundingValue: number;
    usersValue: number;
    countriesValue: number;
  };
  statsData: {
    usersValue: number;
    arrValue: number;
    uptimeValue: number;
    ratingValue: number;
    teamValue: number;
  };
}

const DataContext = createContext<{ data: PortfolioData | null; loading: boolean }>({
  data: null,
  loading: true,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((fetchedData) => {
        setData(fetchedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load portfolio data", err);
        setLoading(false);
      });
  }, []);

  return <DataContext.Provider value={{ data, loading }}>{children}</DataContext.Provider>;
}

export function usePortfolioData() {
  return useContext(DataContext);
}
