using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();


using var scope = app.Services.CreateScope();
try
{
    var dataContext = scope.ServiceProvider.GetRequiredService<DataContext>();
    await dataContext.Database.MigrateAsync();
    await Seed.SeedData(dataContext);
}
catch (Exception ex)
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error ocurred while trying to Migrate");
    throw;
}

app.Run();