

export function getLastRoute(pathname: string) {

	return pathname.split("/")[pathname.split("/").length - 1]

}
