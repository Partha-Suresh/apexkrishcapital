import { CalendarDays, ShieldCheck, UserRound, Users } from 'lucide-react'

type AdminUser = {
  id: string
  name: string
  email: string
  investorStatus: string
  citizenship: string
  createdAt: string | null
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function formatDate(date: string | null) {
  if (!date) return '—'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

const AdminPage = ({ users }: { users: AdminUser[] }) => {
  return (
    <main className="min-h-screen bg-background px-4 pb-20 pt-[120px] text-foreground md:px-6 md:pt-[160px]">
      <div className="mx-auto max-w-6xl">
        <section className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              Admin dashboard
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Investor directory
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Registered investor accounts. Administrator accounts are excluded from this list.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 self-start rounded-2xl border border-border bg-card px-4 py-3 shadow-sm sm:self-auto">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Users className="size-4" />
            </div>
            <div>
              <p className="text-xl font-semibold leading-none tabular-nums">{users.length}</p>
              <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Total users
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[24px] border border-border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-sm font-semibold">All users</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Newest registrations first</p>
            </div>
            <UserRound className="size-4 text-muted-foreground" />
          </div>

          {users.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Users className="size-5" />
              </div>
              <p className="text-sm font-medium">No investor accounts yet</p>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                New non-admin accounts will appear here after they are registered.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-muted/40 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3 font-medium">User</th>
                      <th className="px-6 py-3 font-medium">Investor status</th>
                      <th className="px-6 py-3 font-medium">Citizenship</th>
                      <th className="px-6 py-3 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((user) => (
                      <tr key={user.id} className="transition-colors hover:bg-muted/35">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-[11px] font-semibold text-muted-foreground">
                              {getInitials(user.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                            {user.investorStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{user.citizenship}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-border md:hidden">
                {users.map((user) => (
                  <article key={user.id} className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground">
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{user.name}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-muted-foreground">
                        {user.investorStatus}
                      </span>
                      <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
                        {user.citizenship}
                      </span>
                      <span className="ml-auto inline-flex items-center gap-1 text-muted-foreground">
                        <CalendarDays className="size-3" />
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default AdminPage
