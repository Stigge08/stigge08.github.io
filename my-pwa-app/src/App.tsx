import { useState } from 'react';
import MainContent, { type ComponentKey } from './src/Wrappers/MainContent';
import TopNavigation from './src/Components/TopNavigation';

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
