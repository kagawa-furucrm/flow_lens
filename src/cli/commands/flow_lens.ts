/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview An injection point for the flow to UML tool.
 */

import { flags, SfdxCommand } from '@salesforce/command';
import { Configuration } from "../../main/argument_processor";
import { FlowFileChangeDetector } from "../../main/flow_file_change_detector";
import {
  FlowDifference,
  FlowToUmlTransformer,
} from "../../main/flow_to_uml_transformer";
import { UmlGeneratorContext } from "../../main/uml_generator_context";
import { UmlWriter } from "../../main/uml_writer";

/**
 * The main class for the flow to UML tool.
 */
export default class FlowLens extends SfdxCommand {
  public static description = 'Convert Salesforce Flows to UML diagrams';

  public static examples = [
    `$ sfdx flowlens:convert -d graphviz -f path/to/flowfile`,
  ];

  protected static flagsConfig = {
    diagramtool: flags.string({
      char: 'd',
      description: 'Diagram tool to use (graphviz or plantuml)',
      required: true,
    }),
    filepath: flags.string({
      char: 'f',
      description: 'Path to the flow file',
      required: false,
      multiple: true,
    }),
    gitrepo: flags.string({
      char: 'r',
      description: 'Path to the git repository',
      required: false,
    }),
    gitdifffromhash: flags.string({
      char: 'from',
      description: 'Git diff from hash',
      required: false,
    }),
    gitdifftohash: flags.string({
      char: 'to',
      description: 'Git diff to hash',
      required: false,
    }),
    outputdirectory: flags.string({
      char: 'o',
      description: 'Output directory for UML diagrams',
      required: true,
    }),
    outputfilename: flags.string({
      char: 'n',
      description: 'Output file name for UML diagrams',
      required: true,
    }),
  };

  public async run() {
    const config = {
      diagramTool: this.flags.diagramtool,
      filePath: this.flags.filepath,
      gitRepo: this.flags.gitrepo,
      gitDiffFromHash: this.flags.gitdifffromhash,
      gitDiffToHash: this.flags.gitdifftohash,
      outputDirectory: this.flags.outputdirectory,
      outputFileName: this.flags.outputfilename,
    };

    Configuration.getInstance(config);

    const changeDetector = new FlowFileChangeDetector();
    const flowFilePaths: string[] = this.getFlowFilePaths(changeDetector);
    const filePathToFlowDifference = await this.generateUml(flowFilePaths, changeDetector);
    this.writeDiagrams(filePathToFlowDifference);
  }

  private async generateUml(flowFilePaths: string[], changeDetector: FlowFileChangeDetector) {
    const generatorContext = new UmlGeneratorContext(
      Configuration.getInstance().diagramTool
    );
    const transformer = new FlowToUmlTransformer(
      flowFilePaths,
      generatorContext,
      changeDetector
    );
    return await transformer.transformToUmlDiagrams();
  }

  private writeDiagrams(filePathToFlowDifference: Map<string, FlowDifference>) {
    new UmlWriter(filePathToFlowDifference).writeUmlDiagrams();
  }

  private getFlowFilePaths(changeDetector: FlowFileChangeDetector): string[] {
    const configuredFilePath = Configuration.getInstance().filePath;
    if (configuredFilePath) {
      return configuredFilePath;
    }
    return changeDetector.getFlowFiles();
  }
}
