import {chain, Rule, SchematicContext, SchematicsException, Tree} from '@angular-devkit/schematics';
import {virtualFs, workspaces} from "@angular-devkit/core";
import {ast, query} from '@phenomnomnominal/tsquery';
import {isClassDeclaration} from 'typescript';
import ts = require('typescript');

export function forEachTsFile(
  tree: Tree,
  sourcePath: string,
  callback: (filePath: string) => void
) {
  const dir = tree.getDir(sourcePath);
  dir.visit((path, entry) => {
    if (path.endsWith('.ts') && entry) {
      try {
        callback(entry.path);
      } catch (err) {
        console.error(`error in processing ${entry.path}`);
        throw err;
      }
    }
  });
}

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

async function getSourcePath(tree: Tree) {
  const {workspace: {projects}} = await workspaces.readWorkspace('/', createHost(tree));

  return projects.values().next().value.sourceRoot || '';
}


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function renameUppercase(_options: any): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const sourcePath = await getSourcePath(tree);
    forEachTsFile(tree, sourcePath, (filePath) => {
      const source = tree.readText(filePath);
      const tsAst = ast(source)
      query(tsAst, 'ClassDeclaration').forEach((classDeclaration: ts.Node) => {
        if (isClassDeclaration(classDeclaration) && classDeclaration.name) {
          const className = classDeclaration.name.text;
          const matches = className.match(/([A-Z])([A-Z]+)Component/);
          if (matches) {
            const newClassName = `${matches[1]}${matches[2].toLowerCase()}Component`;
            const prefix = source.substring(0, classDeclaration.name.getStart());
            const suffix = source.substring(classDeclaration.name.getStart() + classDeclaration.name.text.length);

            const newContent = `${prefix}${newClassName}${suffix}`;
            tree.overwrite(filePath, newContent)
          }
        }
      });
    });

    return chain([]);
  };
}
