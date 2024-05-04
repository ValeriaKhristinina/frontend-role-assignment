import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import './style.css';
import useConstructor from './useConstructor';
import ExtendLeafletPrototypes from './components/canvas/leaflet-extensions.config';
import Locations from './components/locations/Locations'

function App() {
    useConstructor(() => {
        ExtendLeafletPrototypes();
    });

    return (
      <Provider store={store}>
        <Locations/>
      </Provider>
    );
}

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);
