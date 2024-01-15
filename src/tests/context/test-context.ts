export class TestContext {

    private sharedData: Map<string, any> = new Map<string, any>();

    constructor() {
    }

    public setData(key: string, value: any): void {
        this.sharedData.set(key, value);
    }

    public isContains(key: string): boolean {
        return this.sharedData.has(key);
    }

    public getData<T>(key: string): T {
        return this.sharedData.get(key);
    }
}

