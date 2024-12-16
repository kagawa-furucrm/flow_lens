# Flow Lens

This project provides a command-line tool to convert Salesforce Flow definition
XML files into UML diagrams which help to visualize the flow's structure and changes
to assist with documentation or code review.
It supports both PlantUML and Graphviz as diagram generation engines.

## Features

- **Supports multiple diagram tools:** Generates diagrams using PlantUML and
  Graphviz.
- **Handles Git diffs:** Can process changes between two Git commits,
  highlighting added, modified, and deleted elements in the resulting diagram.
