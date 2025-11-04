import { useState } from 'react';
import MainContent from './src/Wrappers/MainContent';
import TopNavigation from './src/Components/TopNavigation';
import type { ComponentKey } from './src/Components/Interfaces/interfaces';

function App() {
  const [activeComponent, setActiveComponent] = useState<ComponentKey>('EditableFundTable');
  return (
    <>
      <TopNavigation onSelectComponent={setActiveComponent} />
      <MainContent activeComponent={activeComponent} />
    </>
  );
}
export default App;
