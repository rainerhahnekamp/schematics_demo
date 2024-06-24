import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import {Schema} from "./schema";
import {normalize, virtualFs, workspaces} from "@angular-devkit/core";
import {ProjectDefinition} from "@angular-devkit/core/src/workspace";

function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException('File not found.');
      }
      return virtualFs.fileBufferToString(data);
    },
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

export function component({name}: Schema): Rule {
  return async (tree, _context: SchematicContext) => {
    const {workspace: {projects}} = await workspaces.readWorkspace('/', createHost(tree))
    const project: ProjectDefinition = Array.from(projects.values())[0]
    const projectPath = normalize([project.sourceRoot || '', project.extensions['projectType'] === 'application' ? 'app' : 'lib'].join('/'));

    const uppercase = (value: string) => value.toUpperCase()
    const templateSource = apply(url('./files'), [template({name, uppercase}), move(projectPath)]);
    return chain([mergeWith(templateSource)]);
  };
}
