// import consola from 'consola'
// import chalk from 'chalk'
// import { getWorkspacePackages } from '@element-plus/build-utils'
// import type { Project } from '@pnpm/find-workspace-packages'

// async function main() {
//   const tagVersion = process.env.TAG_VERSION
//   const gitHead = process.env.GIT_HEAD
//   if (!tagVersion || !gitHead) {
//     new Error(
//       'No tag version or git head were found, make sure that you set the environment variable $TAG_VERSION \n'
//     )
//   }

//   consola.log(chalk.cyan('Start updating version'))
//   consola.log(chalk.cyan(`$TAG_VERSION: ${tagVersion}`))
//   consola.log(chalk.cyan(`$GIT_HEAD: ${gitHead}`))

//   consola.debug(chalk.yellow(`Updating package.json for docs-aid-editor`))

//   const pkgs = Object.fromEntries(
//     (await getWorkspacePackages()).map((pkg) => [pkg.manifest.name!, pkg])
//   )
//   const elementPlus = pkgs['element-plus'] || pkgs['@element-plus/nightly']
//   // const eslintConfig = pkgs['@element-plus/eslint-config']
//   // const metadata = pkgs['@element-plus/metadata']

//   const writeVersion = async (project: Project) => {
//     await project.writeProjectManifest({
//       ...project.manifest,
//       version: tagVersion,
//       gitHead,
//     } as any)
//   }

//   try {
//     await writeVersion(elementPlus)
//     // await writeVersion(eslintConfig)
//     // await writeVersion(metadata)
//   } catch (err: any) {
//     new Error(err)
//   }

//   // consola.debug(chalk.green(`$GIT_HEAD: ${gitHead}`))
//   // consola.success(chalk.green(`Git head updated to ${gitHead}`))
// }

// main()