import {JsonValue} from "@angular-devkit/core";
import {SchematicContext, Tree} from "@angular-devkit/schematics";
import {NodePackageInstallTask} from "@angular-devkit/schematics/tasks";

type PackageJson = {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

function assertPackageJson(packageJson: JsonValue): asserts packageJson is PackageJson {
  if (packageJson && typeof packageJson === 'object' && !Array.isArray(packageJson)) {
    if (!('devDependencies' in packageJson)) {
      packageJson.devDependencies = {}
    }

    if (!('dependencies' in packageJson)) {
      packageJson.dependencies = {}
    }

    return;
  } else {
    throw new Error('package.json is not an object');
  }
}

export function updatePlaywright(tree: Tree, context: SchematicContext, version: string) {
  const packageJson = tree.readJson('package.json');
  assertPackageJson(packageJson);


  const dependencies = packageJson.dependencies
  const devDependencies = packageJson.devDependencies
  const allDependencies = {...dependencies, ...devDependencies};

  if ('@playwright/test' in allDependencies) {
    return tree;
  }

  packageJson.devDependencies['@playwright/test'] = version;
  tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));


  context.addTask(new NodePackageInstallTask());
  return tree;
}
