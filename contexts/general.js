import { createContext, useState } from 'react';
import { FullLoading } from '../components/Loading';
import Popup from '../components/Popup';

const GeneralContext = createContext();

export function GeneralProvider({ children }) {
  const [popup, setPopup] = useState(null);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <GeneralContext.Provider value={{ popup, modal, loading, setPopup, setModal, setLoading }}>
      {children}
      <FullLoading />
      <Popup />
    </GeneralContext.Provider>
  );
}

export default GeneralContext;
