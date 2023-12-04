import { createContext, useContext, useState } from "react";

import { Pen } from "@/components/tools/pen";

export interface DataContextProps {
  data: Pen[];
  setData: React.Dispatch<React.SetStateAction<Pen[]>>;
  undo: () => void;
}

export const DataContext = createContext<DataContextProps>({
  data: [],
  setData: () => {},
  undo: () => {},
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<Pen[]>([]);

  const undo = () => {
    setData((prev) => {
      if (!prev) return prev;
      return prev.slice(0, prev.length - 1);
    });
  };

  return <DataContext.Provider value={{ data, setData, undo }}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
