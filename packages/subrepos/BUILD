load("//:tools/ts_library.bzl", "ts_library")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "subrepos",
    srcs = glob(["src/**/*.ts"]),
    deps = [
        "@npm//@types/byline",
        "@npm//@types/fs-extra",
        "@npm//@types/js-yaml",
        "@npm//@types/node",
        "@npm//@types/progress",
        "@npm//@types/yargs",
        "@npm//axios",
        "@npm//cli-table3",
        "@npm//find-up",
        "@npm//fs-extra",
        "@npm//js-yaml",
        "@npm//simple-git",
        "@npm//yargs",
    ],
)
