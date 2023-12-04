import { createContext, useContext, useState } from "react";

export interface ToolContextProps {
  animate: boolean;
  setAnimate: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AnimateContext = createContext<ToolContextProps>({
  animate: false,
  setAnimate: () => {},
});

export const AnimateProvider = ({ children }: { children: React.ReactNode }) => {
  const [animate, setAnimate] = useState<boolean>(false);

  return <AnimateContext.Provider value={{ animate, setAnimate }}>{children}</AnimateContext.Provider>;
};

export const useAnimate = () => useContext(AnimateContext);
