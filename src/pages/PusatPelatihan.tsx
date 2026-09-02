import { useEffect, useState } from 'react';
import api from '../lib/api';
import { asArray } from '../lib/format';

type Course = {
  id: number;
  title: string;
  type: string;
  progress: number;
  status: string;
};

export default function PusatPelatihan() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'mine' | 'available'>('mine');
  const [isLoading, setIsLoading] = useState(true);

  const normalizeCourses = (payload: unknown) => asArray<Record<string, unknown>>(payload).map((course) => ({
    id: Number(course.id),
    title: String(course.title ?? course.name ?? course.training_name ?? 'Training'),
    type: String(course.type ?? course.category ?? 'Training'),
    progress: Number(course.progress ?? course.completion_percentage ?? 0),
    status: String(course.status ?? 'Belum Mulai'),
  }));

  useEffect(() => {
    Promise.allSettled([api.get('/my/trainings'), api.get('/my/trainings/available')])
      .then(([mine, available]) => {
        if (mine.status === 'fulfilled') setCourses(normalizeCourses(mine.value.data));
        if (available.status === 'fulfilled') setAvailableCourses(normalizeCourses(available.value.data));
      })
      .catch(() => setCourses([]))
      .finally(() => setIsLoading(false));
  }, []);

  const enroll = async (id: number) => {
    await api.post(`/my/trainings/${id}/enroll`);
    const selected = availableCourses.find((course) => course.id === id);
    if (selected) setCourses((current) => [{ ...selected, status: 'enrolled' }, ...current]);
    setAvailableCourses((current) => current.filter((course) => course.id !== id));
    setActiveTab('mine');
  };

  const visibleCourses = activeTab === 'mine' ? courses : availableCourses;

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto bg-surface">
      <div className="flex flex-col w-full gap-stack-md px-margin-mobile py-stack-md">
        
        <h2 className="text-headline-md text-on-surface">Pusat Pelatihan</h2>
        <p className="text-body-md text-on-surface-variant mb-2">Tingkatkan keahlian dan kepatuhan Anda.</p>

        <div className="grid grid-cols-2 rounded-full bg-surface-container p-1">
          <button onClick={() => setActiveTab('mine')} className={`h-10 rounded-full font-semibold ${activeTab === 'mine' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>Training Saya</button>
          <button onClick={() => setActiveTab('available')} className={`h-10 rounded-full font-semibold ${activeTab === 'available' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>Tersedia</button>
        </div>

        <div className="flex flex-col gap-4">
          {isLoading && <div className="flex justify-center p-8"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>}
          {!isLoading && visibleCourses.length === 0 && (
            <div className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-center text-on-surface-variant">
              Belum ada training aktif.
            </div>
          )}
          {visibleCourses.map(course => (
            <div key={course.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <span className="text-label-md font-bold text-on-surface max-w-[70%]">{course.title}</span>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${course.type === 'Wajib' ? 'bg-error-container text-on-error-container' : 'bg-surface-variant text-on-surface-variant'}`}>
                  {course.type}
                </span>
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-label-sm text-on-surface-variant">
                  <span>Progres</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <span className={`text-label-sm font-semibold ${course.status === 'Selesai' ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {course.status}
                </span>
                {activeTab === 'available' ? (
                  <button onClick={() => enroll(course.id)} className="text-primary text-label-sm font-semibold">Enroll</button>
                ) : (
                  <button className="text-primary text-label-sm font-semibold">Lanjutkan</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
