import EAssetType from 'renderer/enums/EAssetType'

export const getAssetFileName = (shortAppId: number | string, extension: string) => {
	return {
		[EAssetType.GRID]: `${shortAppId}.${extension}`,
		[EAssetType.HERO]: `${shortAppId}_hero.${extension}`,
		[EAssetType.LIBRARY]: `${shortAppId}p.${extension}`,
		[EAssetType.LOGO]: `${shortAppId}p.${extension}`,
		[EAssetType.ICON]: `${shortAppId}p.${extension}`
	}
}
