load("//:tools/ts_library.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")
load("@io_bazel_rules_docker//nodejs:image.bzl", "nodejs_image")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "the-board",
    srcs = glob(["src/**/*.ts"]),
    deps = [
        "//packages/electron-discord/common",
        "@npm//@sentry/node",
        "@npm//@types/node",
        "@npm//axios",
        "@npm//cookiecord",
        "@npm//discord.js",
    ],
)

nodejs_binary(
    name = "serve",
    data = [
        ":the-board",
    ],
    entry_point = ":src/index.ts",
)

nodejs_image(
    name = "docker-the-board",
    data = [
        ":the-board",
    ],
    entry_point = ":src/index.ts",
)

container_push(
    name = "push-the-board",
    format = "Docker",
    image = ":docker-the-board",
    registry = "ghcr.io",
    repository = "siberianmh/the-board",
    tag = "latest",
)
