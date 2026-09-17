import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';

export default function CitizenDashboard() {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await api.getIssues();
    setIssues(data);
    setLoading(false);
  };

  const filteredIssues = issues.filter(issue => {
    if (filter === 'OPEN') return issue.status === 'REPORTED' || issue.status === 'VERIFIED';
    if (filter === 'IN_PROGRESS') return issue.status === 'ASSIGNED' || issue.status === 'IN_PROGRESS';
    if (filter === 'RESOLVED') return issue.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-cyan-400" />
            My Citizen Reports
          </h1>
          <p className="text-sm text-slate-400">
            Track real-time resolution progress of issues reported by you and your community.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          Report New Issue
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'ALL', label: 'All Reports' },
          { id: 'OPEN', label: 'Open' },
          { id: 'IN_PROGRESS', label: 'In Progress' },
          { id: 'RESOLVED', label: 'Resolved' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filter === tab.id
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Issues Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400 font-mono">Loading reports...</div>
      ) : filteredIssues.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
          <p className="text-sm text-slate-300">No issue reports found matching this filter.</p>
          <Link to="/report" className="text-xs text-cyan-400 font-medium hover:underline inline-block">
            Submit a new citizen report →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIssues.map(issue => {
            const linkedCount = issues.filter(i => i.incidentId === issue.incidentId).length;

            return (
              <div
                key={issue.issueId}
                className="glass-card p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-cyan-400 font-bold">{issue.issueId}</span>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={issue.status} />
                      <SeverityBadge severity={issue.severity} />
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-100 text-sm line-clamp-2">{issue.description}</h3>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {issue.locationLabel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(issue.reportedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* INCIDENT GROUPING BADGE */}
                  <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      Incident <span className="font-mono font-semibold text-slate-300">{issue.incidentId}</span>
                    </span>
                    <span className="font-mono text-cyan-300 font-semibold">
                      {linkedCount} {linkedCount === 1 ? 'report' : 'reports'} → 1 incident
                    </span>
                  </div>
                </div>

                <Link
                  to={`/issues/${issue.issueId}`}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-800"
                >
                  View Full Timeline & Details
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
