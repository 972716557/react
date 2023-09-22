import { getPackageJSON, resolvePath, getBaseRollupPlugins } from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';
// 配置alias打包的时候才可以查找到对应包
import alias from '@rollup/plugin-alias';

const { name, module } = getPackageJSON('react-dom');

const pkgPath = resolvePath(name);
const pkgDistPath = resolvePath(name, true);
// react-dom产物路径
export default [
	//react
	{
		input: `${pkgPath}/${module}`,
		output: [
			{
				file: `${pkgDistPath}/index.js`,
				name: 'index.js',
				format: 'umd'
			},
			{
				file: `${pkgDistPath}/client.js`,
				name: 'client.js',
				format: 'umd'
			}
		],
		plugins: [
			...getBaseRollupPlugins(),
			alias({
				entries: {
					hostConfig: `${pkgPath}/src/hostConfig.ts`
				}
			}),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					peerDependencies: {
						react: version
					},
					main: 'index.js'
				})
			})
		]
	}
];
