import * as Leaflet from 'leaflet';
import { renderWithProviders } from '../../utils/test-utils';

jest.mock('fabric', () => ({
    fabric: {
        Canvas: jest.fn().mockImplementation(() => ({
            requestRenderAll: jest.fn(),
        })),
    },
}));

const mockDelegate = jest.fn();
const mockAddTo = jest.fn();
const leafletFabricLayerMock = jest.fn().mockImplementation(() => ({
    delegate: mockDelegate,
    addTo: mockAddTo,
}));

// Mock Leaflet and fabric modules
jest.doMock('./leaflet-extensions.config', () => ({
    LeafletFabricLayer: leafletFabricLayerMock,
}));

const Canvas = require('./Canvas').default;

describe('Canvas', () => {
    it('returns null', () => {
        const { container } = renderWithProviders(
            <Canvas map={jest.fn() as unknown as Leaflet.Map} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('initializes fabric layer', () => {
        const map = jest.fn() as unknown as Leaflet.Map;

        renderWithProviders(<Canvas map={map} />);

        expect(leafletFabricLayerMock).toHaveBeenCalledTimes(1);
        expect(leafletFabricLayerMock).toHaveBeenCalledWith();

        expect(mockDelegate).toHaveBeenCalledTimes(1);
        expect(mockAddTo).toHaveBeenCalledTimes(1);
        expect(mockAddTo).toHaveBeenCalledWith(map);
    });
    
});
