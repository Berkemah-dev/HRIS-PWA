import { useEffect, useState } from 'react';
import api from '../lib/api';
import { asArray, formatDate } from '../lib/format';

type AssetItem = {
  id: number;
  assignmentId: number;
  name: string;
  code: string;
  status: string;
  condition: string;
  assignedAt: string;
  icon: string;
};

export default function AsetSaya() {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/my/assets')
      .then((response) => setAssets(asArray<Record<string, unknown>>(response.data).map((asset) => {
        const nestedAsset = asset.asset && typeof asset.asset === 'object' ? asset.asset as Record<string, unknown> : {};
        return {
          id: Number(asset.id ?? asset.assignment_id),
          assignmentId: Number(asset.assignment_id ?? asset.id),
          name: String(asset.name ?? asset.asset_name ?? nestedAsset.name ?? 'Aset'),
          code: String(asset.code ?? asset.asset_code ?? nestedAsset.code ?? '-'),
          status: String(asset.status ?? 'aktif'),
          condition: String(asset.condition ?? nestedAsset.condition ?? '-'),
          assignedAt: formatDate(asset.assigned_at ?? asset.created_at),
          icon: String(asset.icon ?? 'devices'),
        };
      })))
      .catch(() => setAssets([]))
      .finally(() => setIsLoading(false));
  }, []);

  const returnAsset = async (assignmentId: number) => {
    await api.put(`/my/assets/return/${assignmentId}`);
    setAssets((current) => current.map((asset) => asset.assignmentId === assignmentId ? { ...asset, status: 'returned' } : asset));
  };

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col w-full gap-stack-md px-margin-mobile pt-stack-md">
        <div className="flex items-center justify-between">
          <h1 className="text-headline-xl text-on-surface">Aset Saya</h1>
          <span className="material-symbols-outlined text-primary text-[28px]">devices</span>
        </div>
        <p className="text-body-md text-on-surface-variant">
          Daftar perangkat dan fasilitas perusahaan yang saat ini dialokasikan untuk Anda.
        </p>

        <div className="grid grid-cols-2 gap-stack-sm mb-stack-sm">
          <div className="bg-surface-container rounded-xl p-stack-sm flex flex-col items-center justify-center gap-1">
            <span className="material-symbols-outlined text-primary text-[24px]">inventory_2</span>
            <span className="text-label-sm text-on-surface-variant">Total Aset</span>
            <span className="text-headline-md text-on-surface">{assets.length}</span>
          </div>
          <div className="bg-surface-container rounded-xl p-stack-sm flex flex-col items-center justify-center gap-1">
            <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
            <span className="text-label-sm text-on-surface-variant">Aktif</span>
            <span className="text-headline-md text-on-surface">{assets.filter((asset) => asset.status.toLowerCase() !== 'returned').length}</span>
          </div>
        </div>

        <div className="flex flex-col gap-stack-sm">
          {isLoading && <div className="flex justify-center p-8"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>}
          {!isLoading && assets.length === 0 && (
            <div className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-center text-on-surface-variant">
              Belum ada aset yang dialokasikan.
            </div>
          )}
          {assets.map((asset) => (
            <div key={asset.id} className="bg-surface-container-lowest rounded-xl shadow-sm p-stack-md relative overflow-hidden border border-outline-variant/30">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl" />
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary-container">{asset.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-headline-md text-on-surface leading-tight">{asset.name}</h3>
                    <p className="text-label-sm text-on-surface-variant">{asset.code}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold rounded-full uppercase tracking-wider">{asset.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 mt-4">
                <div>
                  <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Tanggal Diberikan</p>
                  <p className="text-body-md text-on-surface">{asset.assignedAt}</p>
                </div>
                <div>
                  <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Kondisi</p>
                  <p className="text-body-md text-on-surface">{asset.condition}</p>
                </div>
              </div>
              {asset.status.toLowerCase() !== 'returned' && (
                <button onClick={() => returnAsset(asset.assignmentId)} className="w-full mt-4 h-10 rounded-xl bg-surface-container-high text-primary font-semibold">
                  Ajukan Return Aset
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
