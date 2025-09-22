public record TaskCreateDto(string Title, string? Description, string Category);
public record TaskUpdateDto(string Title, string? Description, bool IsCompleted, string Category);

public record TaskViewDto(Guid Id, string Title, string? Description, bool IsCompleted,
  string Category, DateTime CreatedAt, DateTime? UpdatedAt);