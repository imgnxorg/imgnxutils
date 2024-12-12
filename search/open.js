#!/usr/bin/env node

import readline from "readline/promises";
import { exec, execSync } from "child_process";
const { platform } = process;

(() => {
  const main = async () => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    try {
      async function prompt(question) {
        return rl.question(question, (answer) => {
          resolve(answer);
        });
      }

      // Check if search terms were provided
      function help() {
        const str = [];

        str.push(`[ -l | --local | local ]`);
        str.push(`[ -o | --online | online ]`);
        str.push(`( ${chalk.white(str[0])} ||  ${chalk.blue(str[1])} )`);
        str.push(
          `${chalk.black("Usage:")} search ${chalk.green(
            str[2],
          )} [search terms]`,
        );
        console.log(str.length);
        console.log(str[str.length - 1]);
        console.log(
          "Expected — Argument 1: ([-l|--local|local] || [-o|--online|online])",
        );
        console.log(`Received — ${args[2]}`);
      }

      // Get the search terms from command line arguments
      let args = process.argv,
        location = "",
        searchTerms = args.slice(3);

      if (!!!args[2]) {
        help();
        args[2] = await prompt("Where would you like to search? ");
      }

      if (
        args[2] === "-l" ||
        args[2] === "--local" ||
        !!args[2].match("local")
      ) {
        location = "local";
      }
      if (
        args[2] === "-o" ||
        args[2] === "--online" ||
        !!args[2].match("online")
      ) {
        location = "online";
      }

      if (!!!location) {
        help();
        process.exit(1);
      }

      if (location === "local") {
      } else if ((location = "remote")) {
      } else {
        args.unshift("no-location");
      }

      if (!!searchTerms === false) {
        searchTerms = await prompt("What would you like to search for? ");
      }

      // Create the search URL
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
        searchTerms,
      )}`;

      const commands = {
        darwin: `open "${searchUrl}"`,
        linux: `xdg-open "${searchUrl}"`,
        win32: `start "${searchUrl}"`,
      };

      const command = commands[platform];

      if (command) {
        if (location === "local") {
          try {
            console.log("Searching... (max. depth: 3)");
            const cmd = `find . -name "*${searchTerms}*" -maxdepth 3 -exec echo {} tee xargs grep '${searchTerms}' {} \\\; 2>/dev/null`,
              localSearchResults = execSync(cmd, {
                encoding: "utf-8",
              });
            console.log(cmd);
            if (localSearchResults) {
              console.log("Local search results:");
              console.log(localSearchResults);
            } else {
              console.log("No local files found matching the search terms.");
            }
          } catch (error) {
            console.error("Error searching local files:", error);
          }
        } else if (location === "remote") {
          exec(command, (error) => {
            if (error) {
              console.error("Error opening browser:", error);
              process.exit(1);
            }
          });
        }
      } else {
        console.error("Unsupported platform");
        process.exit(1);
      }
    } catch (err) {
      console.error(chalk.bgRed(`${err.errno}: ${err.code}`));
      console.error(chalk.red(err.message));
    } finally {
      rl.close();
      process.exit(0);
    }
  };
  main();
})();
