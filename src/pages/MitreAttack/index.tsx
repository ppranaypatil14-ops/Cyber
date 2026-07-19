import MitreAttackMap from '../../components/dashboard/MitreAttackMap';

export default function MitreAttack() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-emerald-500/10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">MITRE ATT&CK Visualization</h1>
        <p className="text-slate-400 text-sm">Real-time threat mapping and AI simulation of the active cyber kill chain.</p>
      </div>

      <MitreAttackMap />
    </div>
  );
}
