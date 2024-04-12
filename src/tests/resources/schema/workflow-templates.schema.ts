export const GET_SUCCESS = {
    "type": "object",
    "properties": {
        "data": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": { "type": "string" },
                    "name": { "type": "string" },
                    "description": { "type": "string" }
                },
                "required": ["id", "name"]
            }
        }
    },
    "required": ["data"]
};