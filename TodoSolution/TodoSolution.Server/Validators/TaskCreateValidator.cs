using FluentValidation;

public class TaskCreateValidator : AbstractValidator<TaskCreateDto>
{
    public TaskCreateValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Category).NotEmpty().MaximumLength(40);
    }
}