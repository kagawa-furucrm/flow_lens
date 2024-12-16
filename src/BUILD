load("//javascript/angular/tools/node/jasmine/builddefs:jasmine_node.bzl", "jasmine_node_test")
load("//javascript/tools/nodejs:nodejs_rules.bzl", "nodejs_binary")
load("//javascript/typescript:build_defs.bzl", "ts_library")
load("//tools/build_defs/pkg:google.bzl", "pkg_binary_with_runfiles")

ts_library(
    name = "main_lib",
    srcs = [
        "argument_processor.ts",
        "flow_comparator.ts",
        "flow_file_change_detector.ts",
        "flow_parser.ts",
        "flow_to_uml_transformer.ts",
        "flow_types.ts",
        "graphviz_generator.ts",
        "main.ts",
        "plantuml_generator.ts",
        "uml_generator.ts",
        "uml_generator_context.ts",
        "uml_writer.ts",
        "xml_reader.ts",
    ],
    deps = [
        "//javascript/common/asserts",
        "//third_party/javascript/typings/node",
        "//third_party/javascript/typings/xml2js",
        "//third_party/javascript/typings/yargs",
    ],
)

nodejs_binary(
    name = "main_bin",
    srcs = [
        ":main_lib",
    ],
    entry_point = "google3/corp/peopleops/connect/salesforce/flow_to_uml/main.js",
    nodejs = "//third_party/nodejs:non_google_node",
    deps = [
        "//third_party/javascript/node_modules/xml2js",
        "//third_party/javascript/node_modules/yargs",
    ],
)

ts_library(
    name = "flow_to_uml_test_lib",
    testonly = True,
    srcs = [
        "argument_processor_test.ts",
        "flow_comparator_test.ts",
        "flow_file_change_detector_test.ts",
        "flow_parser_test.ts",
        "flow_to_uml_transformer_test.ts",
        "graphviz_generator_test.ts",
        "main_test.ts",
        "plantuml_generator_test.ts",
        "uml_generator_context_test.ts",
        "uml_generator_test.ts",
        "uml_writer_test.ts",
        "xml_reader_test.ts",
    ],
    data = [
        "goldens/circular_transition.flow-meta.xml",
        "goldens/missing_transition_node.flow-meta.xml",
        "goldens/multiple_elements.flow-meta.xml",
        "goldens/no_start_node.flow-meta.xml",
        "goldens/rollback.flow-meta.xml",
        "goldens/sample.flow-meta.xml",
        "goldens/single_elements.flow-meta.xml",
    ],
    deps = [
        ":main_lib",
        "//javascript/common/asserts",
        "//third_party/javascript/typings/jasmine",
        "//third_party/javascript/typings/node",
        "//third_party/javascript/typings/yargs",
    ],
)

jasmine_node_test(
    name = "flow_to_uml_test",
    size = "small",
    srcs = [":flow_to_uml_test_lib"],
    deps = [
        ":main_bin",
        "//third_party/javascript/node_modules/yargs",
    ],
)

pkg_binary_with_runfiles(
    name = "pkg_binary_with_runfiles",
    binary = ":main_bin",
)

genmpm(
    name = "flow_to_uml_mpm",
    package_name = "corp/peopleops/connect/salesforce/flow_to_uml",
    srcs = ["//third_party/graphviz:dot_binary"],
    deps = [
        ":pkg_binary_with_runfiles",
    ],
)
