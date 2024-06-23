import {Rule} from "@angular-devkit/schematics";
import {updatePlaywright} from "../../util/update-playwright";

export default function update_to_0_0_3(): Rule {
  return (tree, _context) => {
    updatePlaywright(tree, _context, '1.42');
  }
}
