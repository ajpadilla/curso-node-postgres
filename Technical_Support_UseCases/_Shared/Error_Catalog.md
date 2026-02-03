
---

## 📄 `_Shared/Error_Catalog.md`

Template:

```md
# Error Catalog

## Application Errors

| Name | Status | Description |
|------|--------|-------------|
| ValidationError | 400 | Invalid business input |
| ConflictError | 409 | Resource conflict |
| NotFoundError | 404 | Resource not found |
| ApplicationError | 500 | Internal failure |

---

## Infrastructure Errors

| Source | Example |
|--------|----------|
| DB | Connection refused |
| Network | Timeout |
| Auth | Invalid token |
