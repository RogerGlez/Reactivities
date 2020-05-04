using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Reactivities.Data;
using Reactivities.Domain;

namespace Reactivities.Business.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }

        public class Hander : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Hander(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);
                if (activity != null)
                    throw new Exception($"There is already an activity with ID {request.Id}");

                _context.Activities.Add(new Activity
                {
                    Id = request.Id,
                    Category = request.Category,
                    Date = request.Date,
                    City = request.City,
                    Description = request.Description,
                    Title = request.Title,
                    Venue = request.Venue
                });
                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes.");
            }
        }

    }
}