import {Random, RandomType} from "./random";

interface ContractField {
    id: string;
    name: string;
    value: {
        data: string | number | boolean | null;
    };
    data_type: string;
    rule: string;
    mapping_value?: string;
}

export function fillContractFieldsData(data: ContractField[]): ContractField[] {
    data.forEach(field => {
        switch (field.data_type) {
            case 'string':
                let value;
                if (field.name === "自動更新の解約期限" || field.name === "更新期間") {
                    value = randomDuration(field.name);
                } else {
                    value = Random.$(RandomType.STRING);
                }
                field.value.data = value;
                break;
            case 'boolean':
                field.value.data = Random.$(RandomType.BOOL);
                break;
            case 'datetime':
                if (field.name === "契約終了日（契約の終期）") {
                    value = getCurrentDateTimeWithOffset(30)
                }
                field.value.data = getCurrentDateTimeWithOffset();
                break;
            case 'number':
                field.value.data = Random.$(RandomType.INT);
                break;
            case 'textarea':
                field.value.data = Random.$(RandomType.STRING);
                break;
            case 'radio':
                if (field.mapping_value) {
                    try {
                        const parsedMappingValue = JSON.parse(field.mapping_value) as { values: string[] };
                        field.value.data = parsedMappingValue.values[Random.NUMBER(0, parsedMappingValue.values.length - 1)] || null;
                    } catch (error) {
                        console.error(`Error parsing mapping value for field with id ${field.id}:`, error);
                        field.value.data = null;
                    }
                } else {
                    field.value.data = null;
                }
                break;
        }
    });

    return data;
}

// function getCurrentDate(): string {
//     const date = new Date();
//     const year = date.getFullYear().toString();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');
//     return `${year}/${month}/${day}`;
// }


function getCurrentDateTimeWithOffset(dayOffset: number = 0): string {
    const now = new Date();
    now.setDate(now.getDate() + dayOffset);

    const offset = -now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    const offsetSign = offset >= 0 ? '+' : '-';

    const isoString = now.toISOString().slice(0, -5); // Remove milliseconds and 'Z' (UTC indicator)
    const offsetString =
        offsetSign +
        (offsetHours < 10 ? '0' : '') +
        offsetHours +
        ':' +
        (offsetMinutes < 10 ? '0' : '') +
        offsetMinutes;

    return isoString + offsetString;
}

function randomDuration(name: string): string | null {
    let chars: string[];
    if (name === "自動更新の解約期限") {
        chars = ['M', 'D'];
    } else if (name === "更新期間") {
        chars = ['Y', 'M', 'D'];
    } else {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * chars.length);
    const char = chars[randomIndex];
    switch (char) {
        case 'D':
            return `${Math.floor(Math.random() * 30) + 1}|${char}`;
        case 'M':
            return `${Math.floor(Math.random() * 12) + 1}|${char}`;
        case 'Y':
            return `${Math.floor(Math.random() * 99) + 1}|${char}`;
        default:
            return null;
    }
}