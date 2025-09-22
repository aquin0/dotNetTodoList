using Microsoft.EntityFrameworkCore;
using TodoSolution.Server;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<TodoTask> Tasks => Set<TodoTask>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>(e => {
            e.HasIndex(x => x.Username).IsUnique();
            e.Property(x => x.Username).IsRequired().HasMaxLength(50);
        });
        b.Entity<TodoTask>(e => {
            e.Property(x => x.Title).IsRequired().HasMaxLength(120);
            e.Property(x => x.Category).HasMaxLength(40);
            e.HasOne(t => t.User).WithMany(u => u.Tasks).HasForeignKey(t => t.UserId);
        });
    }
}