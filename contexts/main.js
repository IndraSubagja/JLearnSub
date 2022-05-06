import { createContext } from 'react';
import Modal from '../components/Modal';

const MainContext = createContext();

export function MainProvider({ children }) {
  return (
    <MainContext.Provider>
      {children}
      <Modal />
    </MainContext.Provider>
  );
}

export default MainContext;
