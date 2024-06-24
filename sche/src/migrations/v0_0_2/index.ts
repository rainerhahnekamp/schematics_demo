import {Rule} from "@angular-devkit/schematics";
import {updatePlaywright} from "../../util/update-playwright";

export default function update(): Rule {
  return (tree, context) => {
    const newTree= updatePlaywright(tree, ' 1.41')
    context.logger.info("Playwright has been updated. Run npm install.")
    return newTree;
  }
}
