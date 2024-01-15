export const PARTNER_INFO = {
  "type": "object",
  "required": [
    "id",
    "code",
    "name",
    "name_kana",
    "name_suffix",
    "memo",
    "created_at",
    "updated_at",
    "departments"
  ],
  "properties":{
    "id": {"type": "string"},
    "code": {"type": "string"},
    "name": {"type": "string"},
    "name_kana": {"type": "string"},
    "name_suffix": {"type": "string"},
    "memo": {"type": "string"},
    "created_at": {"type": "string"},
    "updated_at": {"type": "string"},
    "departments": {"type": "array"}
  }
}