# BLL (Business Logic Layer)

This folder holds all business logic for the EMC.Server API, organised by concern.

## Structure

```
BLL/
├── DTOs/         Flat data-transfer objects exchanged with the Angular client.
├── Interfaces/   Service contracts (one I*Service.cs per service).
└── Services/     Service implementations (Dataverse-backed via IOrganizationService).
```

## Conventions (mirrored from the Kiddopay reference project)

### Controllers
- Inherit from `LocalBaseController` — gives you `[Authorize]` and `api/[controller]/[action]` routing for free.
- Use a **primary constructor** to inject the service interface.
- Wrap each action in `try / catch`, returning:
  - `Ok(dto)` on success
  - `BadRequest(new { message = "..." })` on invalid input
  - `NotFound(new { message = "..." })` when the entity does not exist
  - `StatusCode(500, new { message = ex.Message })` on unhandled exceptions
- Keep controllers thin — no Dataverse calls, no mapping. Delegate to the service.

### Services
- One interface (`IFooService`) + one implementation (`FooService`) per domain concept.
- Use a **primary constructor**: `public class FooService(IOrganizationService _org, IConfiguration config) : IFooService`.
- Query Dataverse via FetchXML and `_org.RetrieveMultiple(new FetchExpression(fetch))`.
- Map `Entity` → DTO with `private static` helper methods (`MapFooHeader`, `MapFooLines`, etc.).
- Map OptionSet ints → strings with `private static string MapXxx(int? value) => value switch { ... }`.
- Register in `Program.cs` as scoped: `builder.Services.AddScoped<IFooService, FooService>();`.

### DTOs
- Flat POCOs. Use `Guid`, `string`, `decimal`, `DateTime?`.
- Dates serialised as `"yyyy-MM-dd"` strings when they are date-only.
- Nested collections (e.g. `List<FooLineDTO> Lines`) initialised to `new()`.

### Dependency Injection (Program.cs)
The Dataverse `IOrganizationService` (`ServiceClient`) and any cross-cutting helpers must be
registered before service registrations. Add new services next to each other, grouped by domain.
