
using AutoMapper;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<TodoTask, TaskViewDto>();
        CreateMap<TaskCreateDto, TodoTask>();
    }
}