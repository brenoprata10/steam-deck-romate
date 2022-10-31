import EAssetType from 'renderer/enums/EAssetType'

export const getAssetFileName = (shortAppId: number | string, extension: string) => {
	return {
		[EAssetType.GRID]: `${shortAppId}.${extension}`,
		[EAssetType.HERO]: `${shortAppId}_hero.${extension}`,
		[EAssetType.LIBRARY]: `${shortAppId}p.${extension}`,
		[EAssetType.LOGO]: `${shortAppId}l.${extension}`,
		[EAssetType.ICON]: `${shortAppId}i.${extension}`
	}
}
