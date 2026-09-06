import { FruitNinjaGame } from './FruitNinjaGame';

export function App() {
  return (
    <div className="w-screen h-screen bg-slate-950 text-white overflow-hidden select-none">
      <FruitNinjaGame isModal={false} />
    </div>
  );
}

export default App;
