load("//:tools/ts_library.bzl", "ts_library")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "willql",
    srcs = glob(["src/**/*.ts"]),
    deps = [
        "@npm//@types/mysql",
        "@npm//@types/node",
        "@npm//mysql",
    ],
)
