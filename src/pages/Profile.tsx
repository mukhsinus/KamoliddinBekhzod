import { useState } from 'react';

const mockUser = {
  id: 230,
  avatar: '/avatar.jpg', // Replace with actual avatar URL
  name: 'Mohinur Komolova',
  age: 22,
  location: 'Санкт-Петербург/Ташкент, Узбекистан, Россия',
  phone: '79817067167',
  email: 'mkomolova@internet.ru',
  surname: 'Komolova',
  firstname: 'Mohinur',
  patronymic: '',
};

export default function ProfilePage() {
  const [tab, setTab] = useState('profile');
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState(mockUser);

  // TODO: Replace mockUser with API fetch from MongoDB Atlas

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="flex items-center gap-4 mb-4">
        <img src={user.avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover border" />
        <div>
          <div className="text-xs text-muted-foreground mb-1">ID {user.id}</div>
          <div className="font-bold text-lg">{user.name}</div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <span>👤 {user.age} года</span>
            <span>📍 {user.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <span>📞 <a href={`tel:${user.phone}`}>{user.phone}</a></span>
            <span>✉️ <a href={`mailto:${user.email}`}>{user.email}</a></span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <button className={`px-4 py-2 rounded ${tab==='profile'?'bg-blue-500 text-white':'bg-white border'}`} onClick={()=>setTab('profile')}>Профиль</button>
        <button className={`px-4 py-2 rounded ${tab==='applications'?'bg-blue-500 text-white':'bg-white border'}`} onClick={()=>setTab('applications')}>Заявки</button>
        <button className={`px-4 py-2 rounded ${tab==='diplomas'?'bg-blue-500 text-white':'bg-white border'}`} onClick={()=>setTab('diplomas')}>Дипломы</button>
      </div>
      {tab==='profile' && (
        <div>
          <button className="border px-4 py-2 rounded mb-4" onClick={()=>setEdit(!edit)}>{edit?'Сохранить':'Редактировать'}</button>
          <div className="mb-2 font-semibold">Основная информация</div>
          <div className="mb-2">
            <label className="block text-sm mb-1">Фамилия</label>
            <input className="w-full border rounded px-2 py-1" value={user.surname} disabled={!edit} onChange={e=>setUser({...user, surname:e.target.value})} />
          </div>
          <div className="mb-2">
            <label className="block text-sm mb-1">Имя</label>
            <input className="w-full border rounded px-2 py-1" value={user.firstname} disabled={!edit} onChange={e=>setUser({...user, firstname:e.target.value})} />
          </div>
          <div className="mb-2">
            <label className="block text-sm mb-1">Отчество</label>
            <input className="w-full border rounded px-2 py-1" value={user.patronymic} disabled={!edit} onChange={e=>setUser({...user, patronymic:e.target.value})} />
          </div>
        </div>
      )}
      {tab==='applications' && (
        <div>Заявки пользователя (TODO: fetch from MongoDB Atlas)</div>
      )}
      {tab==='diplomas' && (
        <div>Дипломы пользователя (TODO: fetch from MongoDB Atlas)</div>
      )}
    </div>
  );
}
