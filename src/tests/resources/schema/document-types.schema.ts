export const GET_SUCCESS = {
    "type": "object",
    "properties": {
        "data": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": { "type": "string" },
                    "value": { "type": "string" }
                },
                "required": ["id", "value"]
            }
        }
    },
    "required": ["data"]
};