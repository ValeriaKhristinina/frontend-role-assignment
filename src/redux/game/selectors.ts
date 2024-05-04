import { RootState } from '../store';

export const getGamePlayers = (state: RootState) => state.game.data;
export const getIsShowLocation = (state: RootState) => state.game.isShowLocation
export const getVisiblePlayers = (state: RootState) => getIsShowLocation(state) ? getGamePlayers(state) : []
