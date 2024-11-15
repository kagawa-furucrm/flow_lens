# Flow Lens

This project provides a command-line tool to convert Salesforce Flow definition
XML files into UML diagrams which help to visualize the flow's structure and changes
to assist with documentation or code review.
It supports both PlantUML and Graphviz as diagram generation engines, and can output
the diagrams directly or generate code review comments with diagram previews.

## Features

- **Supports multiple diagram tools:** Generates diagrams using PlantUML and
  Graphviz.
- **Handles Git diffs:** Can process changes between two Git commits,
  highlighting added, modified, and deleted elements in the resulting diagram.
- **Code review comment generation:** Creates code review comments including links to
  viewable diagram previews.
- **Flexible output:** Outputs diagrams in a chosen format (currently JSON,
  designed to allow future expansion).
