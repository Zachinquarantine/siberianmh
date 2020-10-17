import * as fs from 'fs'
import * as path from 'path'

export const initialPath = path.join(__dirname, '../../../')

export const source = (packagesDirectory: string = 'packages') =>
  path.resolve(__dirname, `${initialPath}${packagesDirectory}`)

export const getDirectories = (packagesDirectory: string = 'packages') =>
  fs
    .readdirSync(source(packagesDirectory), { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

export const getFiles = (
  packagesDirectory: string = 'packages',
  directory: string,
) =>
  fs.readdirSync(
    path.resolve(__dirname, `${initialPath}${packagesDirectory}/${directory}`),
  )
