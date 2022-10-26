import EAssetType from 'renderer/enums/EAssetType'

export const getAssetFileName = (shortAppId: number, extension: string) => {
	return {
		[EAssetType.GRID]: `${shortAppId}.${extension}`,
		[EAssetType.HERO]: `${shortAppId}_hero.${extension}`,
		[EAssetType.LIBRARY]: `${shortAppId}p.${extension}`
	}
}
