using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Todo.Api.Controllers;

[ApiController, Route("api/[controller]"), Authorize]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    public TasksController(AppDbContext db, IMapper mapper) { _db = db; _mapper = mapper; }

    private Guid CurrentUserId =>
      Guid.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskViewDto>>> Get(
      [FromQuery] string? category,
      [FromQuery] bool? completed,
      [FromQuery] int page = 1,
      [FromQuery] int pageSize = 20)
    {

        var q = _db.Tasks.AsNoTracking().Where(t => t.UserId == CurrentUserId);
        if (!string.IsNullOrWhiteSpace(category)) q = q.Where(t => t.Category == category);
        if (completed.HasValue) q = q.Where(t => t.IsCompleted == completed);

        var items = await q.OrderByDescending(t => t.CreatedAt)
                           .Skip((page - 1) * pageSize)
                           .Take(pageSize)
                           .ToListAsync();

        return Ok(_mapper.Map<List<TaskViewDto>>(items));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TaskViewDto>> GetById(Guid id)
    {
        var task = await _db.Tasks.AsNoTracking()
          .FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);
        return task is null ? NotFound() : Ok(_mapper.Map<TaskViewDto>(task));
    }

    [HttpPost]
    public async Task<ActionResult<TaskViewDto>> Create(TaskCreateDto dto)
    {
        var task = _mapper.Map<TodoTask>(dto);
        task.UserId = CurrentUserId;
        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();
        var view = _mapper.Map<TaskViewDto>(task);
        return CreatedAtAction(nameof(GetById), new { id = task.Id }, view);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, TaskUpdateDto dto)
    {
        var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);
        if (task is null) return NotFound();
        task.Title = dto.Title;
        task.Description = dto.Description;
        task.IsCompleted = dto.IsCompleted;
        task.Category = dto.Category;
        task.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);
        if (task is null) return NotFound();
        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}