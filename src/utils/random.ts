import {faker} from '@faker-js/faker';

export class Random {

    static $(type: RandomType): string | number | boolean {
        switch (type) {
            case RandomType.ZIP_CODE:
                return faker.string.numeric(3) + "-" + faker.string.numeric(4);
            case RandomType.STRING:
                return faker.string.alpha(10);
            case RandomType.ID:
                return 'atid' + faker.string.numeric(6);
            case RandomType.ADDRESS:
                return faker.location.streetAddress();
            case RandomType.EMAIL:
                return faker.internet.email();
            case RandomType.NAME:
                return faker.person.firstName();
            case RandomType.PHONE:
                return faker.string.numeric(7);
            case RandomType.INT:
                return faker.number.int({min: 1, max: 999999});
            case RandomType.INT_STR:
                return faker.string.numeric(6);
            case RandomType.BOOL:
                const value = faker.number.int({min: 0, max: 1});
                return value === 1;
            default:
                throw new TypeError("Invalid random type!")
        }
    }

    static ZIP_CODE = () => {
        return faker.string.numeric(3) + "-" + faker.string.numeric(4);
    }
    static STRING = (): string => {
        return faker.string.alpha(10);
    }

    static NUMBER = (min: number, max: number): number => {
        return faker.number.int({min, max})
    }
}

export enum RandomType {
    ZIP_CODE,
    ADDRESS,
    PHONE,
    NAME,
    EMAIL,
    STRING,
    ID,
    INT,
    INT_STR,
    BOOL
}