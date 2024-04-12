export function getDataFromJSONArray(
    jsonData: any[],
    fieldToFind: { key: string, value: any },
    fieldToGet: string) {
    for (const obj of jsonData) {
        if (obj[fieldToFind.key] === fieldToFind.value) {
            return obj[fieldToGet];
        }
    }
    return null;

}