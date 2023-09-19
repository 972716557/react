import path from 'path';
import fs from 'fs';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
const pkgPath = path.resolve(__dirname, '../../packages');
const disPath = path.resolve(__dirname, '../../dist/node_modules');
export function resolvePath(packageName, isDist) {
	if (isDist) {
		return `${disPath}/${packageName}`;
	}
	return `${pkgPath}/${packageName}`;
}

export function getPackageJSON(pkgName) {
	//...包路径
	const path = `${resolvePath(pkgName)}/package.json`;
	const str = fs.readFileSync(path, { encoding: 'utf-8' });
	return JSON.parse(str);
}

export function getBaseRollupPlugins({ typescript = {} } = {}) {
	return [cjs(), ts(typescript)];
}
