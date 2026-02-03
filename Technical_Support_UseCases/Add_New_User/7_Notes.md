# <USE_CASE_NAME> - Notes

---

## ⚠️ Known Limitations

- Limitation 1
- Limitation 2
- Add more if discovered during testing or usage

---

## 💡 Improvements / Future Enhancements

- Add retry logic
- Improve logging
- Optimize performance
- Handle edge cases better

---

## 🔗 Related Tickets / References

- JIRA-123
- JIRA-456
- Any internal documentation links

---

## 🧹 Test / Setup Notes (Optional)

Use toolkit/builders/user.builder.js to generate test users

Use toolkit/fakes/fake-password-hasher.js for predictable password hashing

Use toolkit/fakes/in-memory.repository.js for isolated unit tests

Use toolkit/fakes/in-memory.store.js for caching/mocking storage

Seed fixtures if needed: toolkit/fixtures/users.fixture.js

Clean DB before integration/e2e tests:

- Truncate tables or seed data before running integration / E2E tests:

```js
await <Model>.destroy({ where: {}, truncate: true, cascade: true });

Environment setup notes
Any important manual steps
