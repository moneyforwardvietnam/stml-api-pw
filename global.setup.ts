import dotenv from "dotenv"

async function globalSetup() {
    try {
        if (process.env.test_env) {
            dotenv.config({
                path: `.env.${process.env.test_env}`,
                override: true
            });
            console.log(`Running test on ${process.env.test_env} environment`);
        }
    } catch (error) {
        console.error("Error loading environment variables:", error);
    }
}
export default globalSetup;