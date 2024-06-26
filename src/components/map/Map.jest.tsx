import { render } from '@testing-library/react';
import * as Leaflet from 'leaflet';
import Map from './Map';

jest.mock('../canvas/leaflet-extensions.config.js', () => ({
    LeafletFabricLayer: jest.fn().mockImplementation(() => ({
        delegate: jest.fn(),
        addTo: jest.fn(),
    })),
}));

// Mock Leaflet library
jest.mock('leaflet', () => ({
    map: jest.fn(() => ({
        setView: jest.fn(),
    })),
    latLng: jest.fn(),
    tileLayer: jest.fn(()=>({
        addTo: jest.fn()
    }))
}));

describe('Map', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders a div element with the id "map" and class "map"', () => {
        const { container } = render(<Map />);
        const mapDiv = container.querySelector('#mapid');
        expect(mapDiv).toBeInTheDocument();
        expect(mapDiv).toHaveClass('map');
    });

    it('initializes a Leaflet map when mounted', () => {
        render(<Map />);

        expect(Leaflet.map).toHaveBeenCalledTimes(1);
        expect(Leaflet.map).toHaveBeenCalledWith('mapid', expect.any(Object));

        expect(Leaflet.tileLayer).toHaveBeenCalledTimes(1)
        expect(Leaflet.tileLayer).toHaveBeenCalledWith(
            "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", 
            expect.objectContaining({
                tileSize: 512,
                zoomOffset: -1,
                id: "mapbox/streets-v9",
            })
        )
    });
});
