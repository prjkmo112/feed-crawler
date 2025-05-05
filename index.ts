import { Command } from "commander";
import inquirer from "inquirer";
import dedent from "dedent";
import { updateData } from "works/updateData";
import { addDatasource } from "works/addDatasource";
import { $Enums } from "prisma/main-mysql/generated";
import { runLiquibase } from "config/liquibaseConfig";
import { log } from "modules/logger";

type Mode = "add_datasource" | "crawl_data";

const program = new Command();

program
    .option("--unreactive", "Run in unreactive mode")
    .option("--mode <mode>", "Set the mode");

program.parse(process.argv);

const options = program.opts();

interface ReactiveResultAddDatasource {
    mode: "add_datasource";
    type: $Enums.datasource_type;
    url: string;
}
interface ReactiveResultCrawlData {
    mode: "crawl_data";
}

type ReactiveResult = ReactiveResultAddDatasource | ReactiveResultCrawlData;

async function preProcess() {
    await runLiquibase();
}

async function runReactiveMode() {
    const { mode } = await inquirer.prompt<{ mode: Mode }>([
        {
            type: "list",
            name: "mode",
            message: "Select a mode:",
            choices: [
                { name: "Add Datasource", value: "add_datasource" },
                { name: "Crawl Data", value: "crawl_data" },
            ],
        },
    ]);
    
    let result = { mode } as ReactiveResult;
    let message = dedent`
    Selected Options
    -----------------------------
    | Mode: ${result.mode}`;

    if (result.mode === "add_datasource") {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'type',
                message: 'Choose Datasource Type:',
                choices: ['xml', 'html', 'json', 'csv'],
            },
            {
                type: 'input',
                name: 'url',
                message: 'Enter URL:',
                validate: (input) => input ? true : 'URL은 필수입니다.',
            },
        ]);

        result = { ...result, ...answers };
        message += dedent`\n
        | Type: ${answers.  type}
        | URL: ${answers.url}`;
    }

    const { confirm } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: dedent`${message}
            -----------------------------`,
            default: false
        }
    ]);

    if (!confirm) {
        console.log("Cancelled.");
        return;
    }

    return result;
}

(async () => {
    await preProcess();
    log.info("Pre-processing completed.");

    if (!options.unreactive) {
        const userOpts = await runReactiveMode();
        if (!userOpts) {
            log.info("Cancelled.");
            return;
        }

        if (userOpts.mode === "add_datasource")
            await addDatasource(userOpts.type, userOpts.url);
        else if (userOpts.mode === "crawl_data")
            await updateData();
    } else {
        if (options.mode === "crawl_data")
            await updateData();
    }
})();