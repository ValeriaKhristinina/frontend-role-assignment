import { gameSlice, gameInitialState } from './reducer';
import { GameState } from './types';

const { getAddPlayerAction, deletePlayerAction, toggleLocationAction } = gameSlice.actions;

describe('game reducers', () => {
    let initialState: GameState;

    beforeEach(() => {
        initialState = { ...gameInitialState };
    });

    afterEach(() => {
        initialState = null;
    });

    it('should add a new player', () => {
        const playerToAdd = {
            id: 7,
            name: 'Max',
            position: { latitude: 55.674879, longitude: 12.568275 },
            teamName: 'blue',
        };

        const action = getAddPlayerAction(playerToAdd);
        const newState = gameSlice.reducer(initialState, action);

        expect(newState.data).toHaveLength(initialState.data.length + 1);
        expect(newState.data.find(player => player.id === playerToAdd.id)).toEqual(playerToAdd);
    });

    it('should delete a player', () => {
        const playerIdToDelete = 2;

        const action = deletePlayerAction(playerIdToDelete);
        const newState = gameSlice.reducer(initialState, action);

        expect(newState.data).toHaveLength(initialState.data.length - 1);
        expect(newState.data.find(player => player.id === playerIdToDelete)).toBeUndefined();
    });

    it('should toggle location display', () => {
        const action = toggleLocationAction();
        const newState = gameSlice.reducer(initialState, action);

        expect(newState.isShowLocation).toEqual(!initialState.isShowLocation);
    });
});
