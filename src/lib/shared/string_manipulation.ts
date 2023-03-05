export function processHierarchyName(name: string | null): string {
	if (!name) return 'NoName!';
	return name.replace(/\s/g, '_');
}
