import {faker} from '@faker-js/faker';

export class Random {

    static $(type: RandomType) {
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
                return faker.number.int({ min: 1, max: 999999 });
            case RandomType.INT_STR:
                return faker.string.numeric(6);
            default:
                throw new TypeError("Invalid radom type!")
        }
    }

    static ZIP_CODE = ()=>{
        return faker.string.numeric(3) + "-" + faker.string.numeric(4);
    }
    static STRING = () =>{
        return faker.string.alpha(10);
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
    INT_STR
}