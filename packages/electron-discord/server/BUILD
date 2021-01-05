load("//:tools/ts_library.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "server",
    srcs = glob(["src/**/*.ts"]),
    deps = [
        "//packages/electron-discord/common",
        "@npm//@types/express",
        "@npm//@types/node",
        "@npm//express",
        "@npm//reflect-metadata",
        "@npm//typeorm",
    ],
)

nodejs_binary(
    name = "serve",
    data = [
        ":server",
    ],
    entry_point = ":src/index.ts",
)
