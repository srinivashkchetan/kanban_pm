# Kanban Database Modeling

## Approach
- Store each user's Kanban board as a single JSON file.
- Keep the schema human-readable and easy to edit.
- Include stable IDs to support drag-and-drop and future reordering.

## JSON Schema (Proposed)
```json
{
  "user": "user",
  "version": 1,
  "updated_at": "2026-02-26T00:00:00Z",
  "columns": [
    {
      "id": "todo",
      "title": "To Do",
      "cards": [
        {"id": "card-1", "text": "Task 1", "created_at": "2026-02-26T00:00:00Z"},
        {"id": "card-2", "text": "Task 2", "created_at": "2026-02-26T00:00:00Z"}
      ]
    },
    {
      "id": "inprogress",
      "title": "In Progress",
      "cards": [
        {"id": "card-3", "text": "Task 3", "created_at": "2026-02-26T00:00:00Z"}
      ]
    },
    {
      "id": "done",
      "title": "Done",
      "cards": [
        {"id": "card-4", "text": "Task 4", "created_at": "2026-02-26T00:00:00Z"}
      ]
    }
  ]
}
```

## File Structure
- `kanban_data/<username>.json` per user.

## Notes
- IDs allow reliable drag-and-drop and later reordering.
- `version` enables schema evolution.
- `updated_at` helps detect stale updates.

## Success Criteria
- Data is saved and loaded correctly.
- Columns and cards can be added, removed, and reordered.
- Schema can be extended without breaking existing data.

## Next Steps
- Implement read/write logic in the backend (already done).
- Update API tests to validate IDs and timestamps if needed.
