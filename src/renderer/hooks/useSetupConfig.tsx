import ESetup from 'renderer/enums/ESetup'
import {getSetupConfig} from 'renderer/utils/setup-config'

const useSetupConfig = ({setup}: {setup: ESetup}) => {
	return getSetupConfig(setup)
}

export default useSetupConfig
