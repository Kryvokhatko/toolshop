Team Standard (short policy)

1. Every new API test must include schema validation.
2. Every changed endpoint must update schema in same PR.
3. Success and error responses both require schemas.
4. additionalProperties policy must be explicit in every object schema.
5. No commented JSON; use $comment in schema metadata.