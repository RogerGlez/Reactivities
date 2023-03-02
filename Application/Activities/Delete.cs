using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Activities;

public class Delete
{
    public class Command : IRequest
    {
        public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
        private readonly DataContext _context;
        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            var entity = await _context.Activities.FindAsync(request.Id);
            if (entity == null) return Unit.Value;
            _context.Remove(entity);
            await _context.SaveChangesAsync();
            return Unit.Value;
        }
    }
}
