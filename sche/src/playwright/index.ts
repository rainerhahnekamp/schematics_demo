import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {JsonValue} from "@angular-devkit/core";

type PackageJson = {
  devDependencies: Record<string, string>
}

function assertPackageJson(content: JsonValue): asserts content is PackageJson {
  if (!content) {
    throw new Error('does not work')
  }
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function playwright(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJson = tree.readJson('package.json');
    assertPackageJson(packageJson);

    if ('@playwright/test' in packageJson.devDependencies && packageJson.devDependencies["@playwright/test"] === '1.40') {
      return tree;
    }

    packageJson.devDependencies['@playwright/test'] = '1.40';
    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));
    return tree;
  };
}
