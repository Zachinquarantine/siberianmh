load("//:tools/ts_library.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")
load("@io_bazel_rules_docker//nodejs:image.bzl", "nodejs_image")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "server",
    srcs = glob(["src/**/*.ts"]),
    deps = [
        "//packages/gitlab-api",
        "@npm//@octokit/rest",
        "@npm//@types/body-parser",
        "@npm//@types/cron",
        "@npm//@types/express",
        "@npm//@types/node",
        "@npm//@types/uuid",
        "@npm//axios",
        "@npm//body-parser",
        "@npm//cron",
        "@npm//dotenv",
        "@npm//express",
        "@npm//mysql",
        "@npm//reflect-metadata",
        "@npm//typeorm",
        "@npm//uuid",
    ],
)

nodejs_binary(
    name = "serve",
    data = [
        ":server",
    ],
    entry_point = ":src/index.ts",
)

nodejs_image(
    name = "docker-roads",
    data = [
        ":server",
    ],
    entry_point = ":src/index.ts",
)

container_push(
    name = "push-roads",
    format = "Docker",
    image = ":docker-roads",
    registry = "ghcr.io",
    repository = "siberianmh/roads",
    tag = "latest",
)
