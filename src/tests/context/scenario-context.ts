import { TestContext } from "./test-context";

export class ScenarioContext {
    private testContext;
    private static instance: ScenarioContext;

    private constructor() {
        this.testContext = new TestContext();
    }

    public static async getInstance(): Promise<ScenarioContext> {
        if (this.instance == null) {
            this.instance = new ScenarioContext();
        }
        return this.instance;
    }

    public setContext(key: string, value: any): void {
        this.testContext.setData(key, value);
    }

    public getContext(key: string): any {
        return this.testContext.getData(key);
    }

    public isContains(key: string): boolean {
        return this.testContext.isContains(key);
    }
}