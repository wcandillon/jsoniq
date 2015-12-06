/// <reference path="../../typings/tsd.d.ts" />
import * as fs from "fs";
import * as cli from "commander";
import JSONiq from "../JSONiq";
import * as cp from "child_process";

var pkg = require("../../../package.json");

cli
.command("run <file>")
.description("run JSONiq query")
.action(file => {
    var query = new JSONiq(fs.readFileSync(file, "utf-8"));
    query.setFileName(file);
    var it = query.compile();
    var source = query.serialize(it);
    var child = cp.execSync("node", { input: source });
    process.stdout.write(child.toString());
});

cli
    .command("compile <file>")
    .description("compile JSONiq query")
    .action(file => {
        var query = new JSONiq(fs.readFileSync(file, "utf-8"));
        query.setFileName(file);
        var it = query.compile();
        var code = query.serialize(it);
        fs.writeFileSync(file.substring(0, file.length - 3) + ".js", code, "utf-8");
    });

cli
.command("plan <file>")
.description("Print query plan")
.action(file => {
    var query = new JSONiq(fs.readFileSync(file, "utf-8"));
    query.setFileName(file);
    var it = query.compile();
    console.log(query.serialize(it));
});

cli
.command("ast <file>")
.description("Print query plan")
.action(file => {
    var query = new JSONiq(fs.readFileSync(file, "utf-8"));
    query.setFileName(file);
    console.log(query.parse().toXML());
});

cli.version(pkg.version);

cli.parse(process.argv);
if (!cli.args.length) {
    cli.help();
}
