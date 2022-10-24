import ESetup from 'renderer/enums/ESetup'

export type TCommonState = {
	setupFlow?: ESetup
}

export const INITIAL_STATE: TCommonState = {}

export enum EAction {
	SET_SETUP_FLOW = 'SET_SETUP_FLOW'
}

export type TAction = {
	type: EAction.SET_SETUP_FLOW
	payload: ESetup
}

export const reducer = (state: TCommonState, action: TAction): TCommonState => {
	switch (action.type) {
		case EAction.SET_SETUP_FLOW:
			return {...state, setupFlow: action.payload}
		default:
			throw new Error()
	}
}
