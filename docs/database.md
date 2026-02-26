# Kanban Database Modeling

## Approach
- Store Kanban board data as JSON files for each user.
- Each file contains columns, cards, and metadata.

## Example Schema
```json
{
  "user": "user",
  "columns": [
    {"id": "todo", "title": "To Do", "cards": ["Task 1", "Task 2"]},
    {"id": "inprogress", "title": "In Progress", "cards": ["Task 3"]},
    {"id": "done", "title": "Done", "cards": ["Task 4"]}
  ]
}
```

## File Structure
- `kanban_data/user.json` for each user

## Success Criteria
- Data is saved and loaded correctly.
- Schema supports adding/removing columns/cards.
- Easy to extend for more metadata.

## Next Steps
- Implement file read/write logic in backend.
- Document API endpoints for Kanban operations.
