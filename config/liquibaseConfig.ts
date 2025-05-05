import { fileURLToPath } from "url";
import { Liquibase, LiquibaseConfig, LiquibaseLogLevels } from "liquibase";


const liquibaseConfig: LiquibaseConfig = {
    changeLogFile: "config/liquibase/changeLog.xml",
    driver: process.env.MYSQL_DRIVER,
    classpath: process.env.MYSQL_CONNECTOR_PATH,
    liquibase: "liquibase",
    url: `jdbc:${process.env.MYSQL_URL}`,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    logLevel: LiquibaseLogLevels.Info,
    logFile: "logs/liquibase.log",
    logFormat: "text"
};

const liquibase = new Liquibase(liquibaseConfig);

async function runLiquibase() {
    const state = await liquibase.status();
    console.log(state);
    
    const liqRes = await liquibase.update({});
    console.log("Liquibase update completed successfully.");
    console.log(liqRes);
}


const __filename = fileURLToPath(import.meta.url);
const isCalledByCLI = process.argv[1] === __filename;

if (isCalledByCLI) {
    runLiquibase()
        .then(() => {
            console.log("Liquibase update completed successfully.");
        })
        .catch((error) => {
            console.error("Error during Liquibase update:", error);
        });
}

export { runLiquibase };