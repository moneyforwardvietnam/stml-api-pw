import {TestContext} from "./test-context";

export class ScenarioContext {
    private testContext;
    private static instance: { [id: string]: ScenarioContext } = {};

    private constructor() {
        this.testContext = new TestContext();
    }

    public static async getInstance(id: number | string | undefined) {
        let idStr = String(id);
        if (this.instance[idStr] == null || undefined) {
            this.instance[idStr] = new ScenarioContext();
        }
        return this.instance[idStr];
    }

    public setContext(key: string, value: any): void {
        this.testContext.setData(key, value);
    }

    public getContext(key: string): any | undefined {
        return this.testContext.getData(key);
    }

    public isContains(key: string): boolean {
        return this.testContext.isContains(key);
    }
}