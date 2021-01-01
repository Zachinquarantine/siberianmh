load("//:tools/ts_library.bzl", "ts_library")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "gitlab-api",
    srcs = glob(["src/**/*.ts"]),
    deps = [
        "//:modules-fix",
        "@npm//axios",
    ],
)
