/**
 * @File   : util.ts
 * @Author : DengSir (tdaddon@163.com), derkallevombau
 * @Link   : https://dengsir.github.io/, https://github.com/derkallevombau/template-generator-vscode-fork
 */

import * as path from 'path';
import { promises as fs } from 'fs'; // mz is obsolete, at least for fs.

import env from './environment';

export function convert(content: string, ignore_variables?: boolean): string
{
	return content.replace(
		/\{__(name|email|author|link|date|delete|camelCaseName|pascalCaseName|snakeCaseName|kebabCaseName|lowerDotCaseName)__\.?([^{}]*)\}/g,
		(_, key, description) => (!ignore_variables ? env.fields[key] || '' : description),
	);
}

export function absTemplatePath(...args: string[]): string
{
	return path.join(env.templatesFolderPath, ...args);
}

export function absTargetPath(...args: string[]): string
{
	return path.join(env.targetFolderPath, ...args);
}

function copyFolder(src: string, dst: string)
{
	return fs.stat(dst)
		.then(
			stats => { if (!stats.isDirectory) throw Error(`Failed to copy contents of '${src}' to '${dst}': Is not a folder!`); },
			()    => fs.mkdir(dst, { recursive: true }) // If stat fails, dst doesn't exist, so we create it.
		).then(
			()         => fs.readdir(src),
			(e: Error) => { throw Error(`Failed to create dir '${dst}': ${e.message}`); }
		).then(
			// We need async here for this lambda to return a Promise<void> instead of void.
			// We don't need 'files.map(...)' and 'Promise.all()' since the files are copied one by one.
			async files => files.forEach(
				async file =>
				{
					const source = path.join(src, file);
					const target = path.join(dst, file);

					if (env.debug) console.log(`Copying '${source}' to '${target}'.`);

					await fs.stat(source) // We need await here for the next iteration to start when the current one has finished.
						.then(
							stats =>
							{
								if (stats.isDirectory())
								{
									return copyFolder(source, target)
										.catch((e: Error) => { throw Error(`Failed to copy folder '${source}' to '${target}': ${e.message}`); });
								}

								if (stats.isFile())
								{
									return fs.copyFile(source, target)
										.catch((e: Error) => { throw Error(`Failed to copy file '${source}' to '${target}': ${e.message}`); });
								}
							},
							(e: Error) => { throw Error(`Failed to stat '${source}': ${e.message}`); }
						).then(() => new Promise(resolve => setTimeout(resolve, 2000)));
				}
			),
			(e: Error) => { throw Error(`Failed to read '${src}': ${e.message}`); }
		).then(() => { if (env.debug) console.log(`Successfully copied contents of '${src}' to '${dst}'.`); });
}

export function checkTemplatesFolder()
{
	const templatesFolderPath = env.templatesFolderPath;

	return fs.stat(templatesFolderPath)
		.then(
			stats => { if (!stats.isDirectory) logAndThrow(`Templates folder '${templatesFolderPath}' is not a folder!`); },
			// templatesFolderPath doesn't exist => Create it and copy default templates to it.
			()    => copyFolder(path.join(env.context.extensionPath, 'templates'), templatesFolderPath)
						.catch((e: Error) => logAndThrow(e.message))
		);
}

function logAndThrow(message: string)
{
	const msg = `Template Generator: ${message}`;

	console.error(msg);
	throw Error(msg);
}
