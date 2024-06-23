import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import * as path from 'path';

import {Schema as WorkspaceOptions} from '@schematics/angular/workspace/schema';
import {Schema as ApplicationOptions} from '@schematics/angular/application/schema';

const collectionPath = path.join(__dirname, '../collection.json');

const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '17.0.0',
};

const appOptions: ApplicationOptions = {
  name: 'demo',
  inlineStyle: false,
  inlineTemplate: false,
  routing: false,
  skipTests: false,
  skipPackageJson: false,
};

describe('rename-uppercase', () => {
  it('works', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    let appTree = await runner.runExternalSchematic(
      '@schematics/angular', 'workspace', workspaceOptions);
    appTree = await runner.runExternalSchematic(
      '@schematics/angular', 'application', appOptions, appTree);
    appTree.create('/projects/demo/src/app/foo.component.ts', 'class FOOComponent {}');
    appTree = await runner.runSchematic('rename-uppercase', {}, appTree);

    expect(appTree.readText('/projects/demo/src/app/foo.component.ts')).toEqual('class FooComponent {}');
  });
});
