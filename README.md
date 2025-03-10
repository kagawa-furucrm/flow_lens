# Flow Lens

<img src="docs/img/Flow_Lens.png">

This project helps decode Salesforce Flows by translating their raw XML
definition files into human-understandable UML diagrams. These visualizations
clarify the flow's structure and logic, making documentation and code review
significantly easier. It supports generating diagrams using both PlantUML and
Graphviz, and can even highlight changes between different versions of a flow by
processing Git diffs.

This is not an officially supported Google product. This project is not eligible
for the
[Google Open Source Software Vulnerability Rewards Program](https://bughunters.google.com/open-source-security).

## Features

- **Supports multiple diagram tools:** Generates diagrams using PlantUML and
  Graphviz.
- **Handles Git diffs:** Can process changes between two Git commits,
  highlighting added, modified, and deleted elements in the resulting diagram.

## Usage

The tool is driven by command-line arguments. The following options are
available:

| Option              | Description                                                                                            | Type     | Default    | Required                            |
| ------------------- | ------------------------------------------------------------------------------------------------------ | -------- | ---------- | ----------------------------------- |
| `--diagramTool`     | The diagram tool to use ('plantuml' or 'graphviz').                                                    | string   | `graphviz` | No                                  |
| `--filePath`        | Path(s) to the Salesforce Flow XML file(s). Specify multiple files using space separated values.       | string[] |            | No (Git diff or file path required) |
| `--gitDiffFromHash` | The starting commit hash for the Git diff.                                                             | string   |            | No (Only with Git diff)             |
| `--gitDiffToHash`   | The ending commit hash for the Git diff.                                                               | string   |            | No (Only with Git diff)             |
| `--gitRepo`         | Path to the Git repository (required when using Git diff and the script isn't run from the repo root). | string   |            | No                                  |
| `--outputDirectory` | The directory to save the output file.                                                                 | string   |            | Yes                                 |
| `--outputFileName`  | The name of the output file (without extension).                                                       | string   |            | Yes                                 |

**Example using file path:**

```shell
deno run \
  --allow-read \
  --allow-write \
  src/main/main.ts \
  --diagramTool="graphviz" \
  --filePath="/some/path/force-app/main/default/flows/ArticleSubmissionStatus.flow-meta.xml" \
  --filePath="/some/path/force-app/main/default/flows/LeadConversionScreen.flow-meta.xml" \
  --filePath="/some/path/force-app/main/default/flows/OpportunityClosure.flow-meta.xml" \
  --outputDirectory="." \
  --outputFileName="test"
```

**Example using Git diff:**

```shell
deno run \
  --allow-read \
  --allow-write \
  src/main/main.ts \
  --diagramTool="graphviz" \
  --gitDiffFromHash="HEAD~1" \
  --gitDiffToHash="HEAD" \
  --gitRepo="/some/path/" \
  --outputDirectory="." \
  --outputFileName="test"
```

## Output

The output is a JSON file containing the generated UML diagram(s). The structure
will contain the file paths and their associated old (if applicable) and new UML
strings.

```json
[
  {
    "path": "force-app/main/default/flows/ArticleSubmissionStatus.flow-meta.xml",
    "difference": {
      "old": "UML_STRING_HERE",
      "new": "UML_STRING_HERE"
    }
  },
  {
    "path": "force-app/main/default/flows/LeadConversionScreen.flow-meta.xml",
    "difference": {
      "old": "UML_STRING_HERE",
      "new": "UML_STRING_HERE"
    }
  }
]
```

## Frequently Asked Questions

### Why is this built using Deno?

Porting the project from Google's internal Blaze build system to Deno was easier
than setting it up in Node.js, as there is no transpilation step from TypeScript
to JavaScript. Deno's built-in TypeScript support made the migration process
much smoother.

### How is this different than Todd Halfpenny's flow visualizer?

While
[Todd's project](https://github.com/toddhalfpenny/salesforce-flow-visualiser) is
excellent, Flow Lens was built and used internally at Google before Todd's
project was available for commercial use. The key differentiator is that Flow
Lens represents flow differences structurally, making it ideal for assistance
with code reviews. This structural diff visualization is not available in other
flow visualization tools.

### What is the future of this project?

We have two main goals for the future of Flow Lens:

1. Migrate from a standalone Deno executable to a `sf` CLI plugin to better
   integrate with the Salesforce development ecosystem
2. Create a GitHub Action that automatically generates and displays diagram
   diffs directly in pull requests, streamlining the code review process

## Example

<table>
  <tr>
    <td> Old </td> <td> New </td>
  </tr>
  <tr>
    <td>
      <img src="docs/img/Demo_Flow.png">
    </td>
    <td>
      <img src="docs/img/Updated_Flow.png">
    </td>
  </tr>
</table>

```diff
<?xml version="1.0" encoding="UTF-8"?>
<Flow xmlns="http://soap.sforce.com/2006/04/metadata">
+  <actionCalls>
+    <name>Log_Error</name>
+    <label>Log Error</label>
+    <locationX>704</locationX>
+    <locationY>242</locationY>
+    <actionName>Demo</actionName>
+    <actionType>apex</actionType>
+    <flowTransactionModel>CurrentTransaction</flowTransactionModel>
+    <nameSegment>Demo</nameSegment>
+    <offset>0</offset>
+    <versionSegment>1</versionSegment>
+  </actionCalls>
+  <actionCalls>
+    <name>Log_Error2</name>
+    <label>Log Error</label>
+    <locationX>440</X>
+    <locationY>458</locationY>
+    <actionName>Demo</actionName>
+    <actionType>apex</actionType>
+    <flowTransactionModel>CurrentTransaction</flowTransactionModel>
+    <nameSegment>Demo</nameSegment>
+    <offset>0</offset>
+    <versionSegment>1</versionSegment>
+  </actionCalls>
  <apiVersion>62.0</apiVersion>
  <assignments>
-    <name>Set_the_Description</name>
-    <label>Set the Description</label>
+    <name>Set_the_Type</name>
+    <label>Set the Type</label>
    <locationX>176</locationX>
    <locationY>242</locationY>
    <assignmentItems>
-      <assignToReference>Get_the_Acme_Account.Description</assignToReference>
+      <assignToReference>Get_the_Acme_Account.Type</assignToReference>
      <operator>Assign</operator>
      <value>
-        <stringValue>This is a Demonstration!</stringValue>
+        <stringValue>Other</stringValue>
      </value>
    </assignmentItems>
    <connector>
      <targetReference>Update_the_Acme_Account</targetReference>
    </connector>
  </assignments>
  <constants>
    <name>Acme</name>
    <dataType>String</dataType>
    <value>
      <stringValue>Acme</stringValue>
    </value>
  </constants>
  <environments>Default</environments>
  <interviewLabel>Demo {!$Flow.CurrentDateTime}</interviewLabel>
  <label>Demo</label>
  <processMetadataValues>
    <name>BuilderType</name>
    <value>
      <stringValue>LightningFlowBuilder</stringValue>
    </value>
  </processMetadataValues>
  <processMetadataValues>
    <name>CanvasMode</name>
    <value>
      <stringValue>AUTO_LAYOUT_CANVAS</stringValue>
    </value>
  </processMetadataValues>
  <processMetadataValues>
    <name>OriginBuilderType</name>
    <value>
      <stringValue>LightningFlowBuilder</stringValue>
    </value>
  </processMetadataValues>
  <processType>AutoLaunchedFlow</processType>
  <recordLookups>
    <name>Get_the_Acme_Account</name>
    <label>Get the &quot;Acme&quot; Account</label>
    <locationX>176</locationX>
    <locationY>134</locationY>
    <assignNullValuesIfNoRecordsFound>false</assignNullValuesIfNoRecordsFound>
    <connector>
-      <targetReference>Set_the_Description</targetReference>
+      <targetReference>Set_the_Type</targetReference>
    </connector>
+    <faultConnector>
+      <targetReference>Log_Error</targetReference>
+    </faultConnector>
    <filterLogic>and</filterLogic>
    <filters>
      <field>Name</field>
      <operator>EqualTo</operator>
      <value>
        <elementReference>Acme</elementReference>
      </value>
    </filters>
    <getFirstRecordOnly>true</getFirstRecordOnly>
    <object>Account</object>
    <storeOutputAutomatically>true</storeOutputAutomatically>
  </recordLookups>
  <recordUpdates>
    <name>Update_the_Acme_Account</name>
    <label>Update the &quot;Acme&quot; Account</label>
    <locationX>176</locationX>
    <locationY>350</locationY>
+    <faultConnector>
+      <targetReference>Log_Error2</targetReference>
+    </faultConnector>
    <inputReference>Get_the_Acme_Account</inputReference>
  </recordUpdates>
  <start>
    <locationX>50</locationX>
    <locationY>0</locationY>
    <connector>
      <targetReference>Get_the_Acme_Account</targetReference>
    </connector>
  </start>
  <status>Active</status>
</Flow>
```

```sh
deno run \
  --allow-read \
  --allow-write \
  src/main/main.ts \
  --diagramTool="graphviz" \
  --gitRepo="/path/to/salesforce_project/" \
  --gitDiffFromHash="HEAD~1" \
  --gitDiffToHash="HEAD" \
  --outputDirectory="." \
  --outputFileName="test"
```

`test.json`

```json
[
  {
    "path": "force-app/main/default/flows/Demo.flow-meta.xml",
    "difference": {
      "old": "digraph {\nlabel=<<B>Demo</B>>\ntitle = \"Demo\";\nlabelloc = \"t\";\nnode [shape=box, style=filled]\nSet_the_Description [\n  label=<\n<TABLE CELLSPACING=\"0\" CELLPADDING=\"0\">\n  <TR><TD BGCOLOR=\"WHITE\" WIDTH=\"20\"><FONT COLOR=\"red\"><B>-</B></FONT></TD>\n    <TD>\n      <B>Assignment ⬅️</B>\n    </TD>\n  </TR>\n  <TR>\n    <TD COLSPAN=\"2\"><U>Set the Description</U></TD>\n  </TR>\n</TABLE>\n>\n  color=\"#DD7A00\"\n  fontcolor=\"white\"\n];\nGet_the_Acme_Account [\n  label=<\n<TABLE CELLSPACING=\"0\" CELLPADDING=\"0\">\n  <TR><TD BGCOLOR=\"WHITE\" WIDTH=\"20\"><FONT COLOR=\"#DD7A00\"><B>Δ</B></FONT></TD>\n    <TD>\n      <B>Record Lookup 🔍</B>\n    </TD>\n  </TR>\n  <TR>\n    <TD COLSPAN=\"2\"><U>Get the 'Acme' Account</U></TD>\n  </TR>\n</TABLE>\n>\n  color=\"#F9548A\"\n  fontcolor=\"white\"\n];\nUpdate_the_Acme_Account [\n  label=<\n<TABLE CELLSPACING=\"0\" CELLPADDING=\"0\">\n  <TR><TD BGCOLOR=\"WHITE\" WIDTH=\"20\"><FONT COLOR=\"#DD7A00\"><B>Δ</B></FONT></TD>\n    <TD>\n      <B>Record Update ✏️</B>\n    </TD>\n  </TR>\n  <TR>\n    <TD COLSPAN=\"2\"><U>Update the 'Acme' Account</U></TD>\n  </TR>\n</TABLE>\n>\n  color=\"#F9548A\"\n  fontcolor=\"white\"\n];\nFLOW_START -> Get_the_Acme_Account [label=\"\" color=\"black\" style=\"\"]\nGet_the_Acme_Account -> Set_the_Description [label=\"\" color=\"black\" style=\"\"]\nSet_the_Description -> Update_the_Acme_Account [label=\"\" color=\"black\" style=\"\"]\n}",
      "new": "digraph {\nlabel=<<B>Demo</B>>\ntitle = \"Demo\";\nlabelloc = \"t\";\nnode [shape=box, style=filled]\nSet_the_Type [\n  label=<\n<TABLE CELLSPACING=\"0\" CELLPADDING=\"0\">\n  <TR><TD BGCOLOR=\"WHITE\" WIDTH=\"20\"><FONT COLOR=\"green\"><B>+</B></FONT></TD>\n    <TD>\n      <B>Assignment ⬅️</B>\n    </TD>\n  </TR>\n  <TR>\n    <TD COLSPAN=\"2\"><U>Set the Type</U></TD>\n  </TR>\n</TABLE>\n>\n  color=\"#DD7A00\"\n  fontcolor=\"white\"\n];\nGet_the_Acme_Account [\n  label=<\n<TABLE CELLSPACING=\"0\" CELLPADDING=\"0\">\n  <TR><TD BGCOLOR=\"WHITE\" WIDTH=\"20\"><FONT COLOR=\"#DD7A00\"><B>Δ</B></FONT></TD>\n    <TD>\n      <B>Record Lookup 🔍</B>\n    </TD>\n  </TR>\n  <TR>\n    <TD COLSPAN=\"2\"><U>Get the 'Acme' Account</U></TD>\n  </TR>\n</TABLE>\n>\n  color=\"#F9548A\"\n  fontcolor=\"white\"\n];\nUpdate_the_Acme_Account [\n  label=<\n<TABLE CELLSPACING=\"0\" CELLPADDING=\"0\">\n  <TR><TD BGCOLOR=\"WHITE\" WIDTH=\"20\"><FONT COLOR=\"#DD7A00\"><B>Δ</B></FONT></TD>\n    <TD>\n      <B>Record Update ✏️</B>\n    </TD>\n  </TR>\n  <TR>\n    <TD COLSPAN=\"2\"><U>Update the 'Acme' Account</U></TD>\n  </TR>\n</TABLE>\n>\n  color=\"#F9548A\"\n  fontcolor=\"white\"\n];\nLog_Error [\n  label=<\n<TABLE CELLSPACING=\"0\" CELLPADDING=\"0\">\n  <TR><TD BGCOLOR=\"WHITE\" WIDTH=\"20\"><FONT COLOR=\"green\"><B>+</B></FONT></TD>\n    <TD>\n      <B>Action Call ⚡</B>\n    </TD>\n  </TR>\n  <TR>\n    <TD COLSPAN=\"2\"><U>Log Error</U></TD>\n  </TR>\n</TABLE>\n>\n  color=\"#344568\"\n  fontcolor=\"white\"\n];\nLog_Error2 [\n  label=<\n<TABLE CELLSPACING=\"0\" CELLPADDING=\"0\">\n  <TR><TD BGCOLOR=\"WHITE\" WIDTH=\"20\"><FONT COLOR=\"green\"><B>+</B></FONT></TD>\n    <TD>\n      <B>Action Call ⚡</B>\n    </TD>\n  </TR>\n  <TR>\n    <TD COLSPAN=\"2\"><U>Log Error</U></TD>\n  </TR>\n</TABLE>\n>\n  color=\"#344568\"\n  fontcolor=\"white\"\n];\nFLOW_START -> Get_the_Acme_Account [label=\"\" color=\"black\" style=\"\"]\nGet_the_Acme_Account -> Set_the_Type [label=\"\" color=\"black\" style=\"\"]\nGet_the_Acme_Account -> Log_Error [label=\"Fault\" color=\"red\" style=\"dashed\"]\nSet_the_Type -> Update_the_Acme_Account [label=\"\" color=\"black\" style=\"\"]\nUpdate_the_Acme_Account -> Log_Error2 [label=\"Fault\" color=\"red\" style=\"dashed\"]\n}"
    }
  }
]
```

<table>
  <tr>
    <td> Old </td> <td> New </td>
  </tr>
  <tr>
    <td>
      <img src="docs/img/Diff_Old.png">
    </td>
    <td>
      <img src="docs/img/Diff_New.png">
    </td>
  </tr>
</table>

## Building and Deploying the Chrome Extension

To build and deploy the Chrome extension, follow these steps:

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Build the extension:**

   ```sh
   npm run build
   ```

3. **Load the extension in Chrome:**

   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" using the toggle switch in the top right corner
   - Click "Load unpacked" and select the `dist` directory where the extension was built

4. **Test the extension:**

   - The extension should now be loaded in Chrome and ready for testing

## GitHub Action

To automate the process of scanning pull requests, extracting Salesforce flow files, converting them to UML diagrams, and saving them to the same pull request for review, you can use the provided GitHub Action workflow.

### Workflow File

Create a file named `.github/workflows/flow_lens.yml` in your repository with the following content:

```yaml
name: Flow Lens

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up Deno
      uses: denoland/setup-deno@v1
      with:
        deno-version: v1.x

    - name: Install dependencies
      run: |
        deno cache src/main/main.ts

    - name: Run Flow to UML tool
      run: |
        deno run --allow-read --allow-write src/main/main.ts --diagramTool="graphviz" --gitDiffFromHash="${{ github.event.before }}" --gitDiffToHash="${{ github.sha }}" --gitRepo="." --outputDirectory="." --outputFileName="flow_diagram"

    - name: Commit and push UML diagrams
      run: |
        git config --global user.name "github-actions[bot]"
        git config --global user.email "github-actions[bot]@users.noreply.github.com"
        git add flow_diagram.json
        git commit -m "Add UML diagrams"
        git push

    - name: Create pull request comment
      uses: peter-evans/create-or-update-comment@v1
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        issue-number: ${{ github.event.pull_request.number }}
        body: |
          UML diagrams have been generated and added to the pull request.
```

### Usage

1. **Create the workflow file:**

   Create a file named `.github/workflows/flow_lens.yml` in your repository with the provided content.

2. **Trigger the workflow:**

   The workflow will automatically trigger on pull request events (opened, synchronize, reopened). It will check out the code, install dependencies, run the Flow to UML tool, and update the pull request with the generated UML diagrams.

3. **Review the UML diagrams:**

   The generated UML diagrams will be added to the pull request as a comment, allowing you to review the changes visually.

## Installing the CLI Plugin

To install the Salesforce CLI plugin for Flow Lens, follow these steps:

1. **Install the Salesforce CLI:**

   If you haven't already, install the Salesforce CLI by following the instructions [here](https://developer.salesforce.com/tools/sfdxcli).

2. **Install the Flow Lens plugin:**

   ```sh
   sfdx plugins:install flow-lens
   ```

3. **Verify the installation:**

   ```sh
   sfdx plugins --core
   ```

   You should see `flow-lens` listed as one of the installed plugins.

## Using the CLI Plugin

Once the Flow Lens plugin is installed, you can use it to generate UML diagrams for Salesforce Flows. The following commands are available:

### Generate UML Diagrams

To generate UML diagrams for Salesforce Flows, use the following command:

```sh
sfdx flow-lens:generate --diagramTool="graphviz" --filePath="/some/path/force-app/main/default/flows/ArticleSubmissionStatus.flow-meta.xml" --outputDirectory="." --outputFileName="test"
```

### Generate UML Diagrams from Git Diff

To generate UML diagrams for Salesforce Flows based on a Git diff, use the following command:

```sh
sfdx flow-lens:generate --diagramTool="graphviz" --gitDiffFromHash="HEAD~1" --gitDiffToHash="HEAD" --gitRepo="/some/path/" --outputDirectory="." --outputFileName="test"
```
