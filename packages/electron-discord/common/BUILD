load("//:tools/ts_library.bzl", "ts_library")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "edis-common",
    srcs = glob(["src/**/*.ts"]),
    deps = [
        "//:modules-fix",
        "@npm//@types/node",
        "@npm//cookiecord",
    ],
)
