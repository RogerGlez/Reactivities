using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Reactivities.Data;
using Reactivities.Domain;

namespace Reactivities.Business.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity>
        {
            public Guid Id { get; }

            public Query(Guid Id)
            {
                this.Id = Id;
            }
        }

        public class Handler : IRequestHandler<Query, Activity>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Activities.FindAsync(request.Id);
            }
        }
    }
}