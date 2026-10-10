'use client';

import { useCallback, useEffect, useState } from 'react';

const emptySite = {
  brand: { name: 'Suryoday Vruddhashram', subtitle: 'Care rooted in dignity, warmth, and belonging' },
  contact: {
    phone: '+91 9604516653',
    email: 'tejaswifoundation2013@gmail.com',
    address: 'Mahadeev Nagar, Dhayri, Pune 411041, India',
    whatsappMessage: "Hi! I’d like to know more about Suryoday Vruddhashram and your services.",
    mapUrl: 'https://maps.google.com/?q=Mahadeev+Nagar,+Dhayri,+Pune+411041,+India',
  },
  organization: {
    tagline: 'Compassionate elder care, rooted in community and dignity.',
    about: 'Suryoday Vruddhashram, supported by Tejaswi Foundation, is dedicated to residential elder care, companionship, and daily wellbeing for senior citizens.',
    mission: 'To support elders with respectful care, safety, nourishment, and a warm community where they can live with dignity.',
  },
  needs: [
    { id: 'nutrition', title: 'Nutritious meals and hydration', description: 'Fresh, balanced food and regular hydration support for residents with varied dietary requirements.', priority: 'high' },
    { id: 'medical', title: 'Regular health checkups', description: 'Routine monitoring, medication support, and timely medical attention for residents.', priority: 'high' },
    { id: 'companionship', title: 'Companionship and activities', description: 'Meaningful daily engagement, emotional support, and social activity for a happy routine.', priority: 'medium' },
  ],
  stats: [
    { id: 'care', value: 'Care', label: 'Personal care and support', description: "Respectful assistance shaped around each resident's needs." },
    { id: 'meals', value: 'Meals', label: 'Nourishment', description: 'Food and hydration support for everyday wellbeing.' },
    { id: 'community', value: 'Community', label: 'Companionship', description: 'A welcoming environment for connection and belonging.' },
  ],
  gallery: [
    { id: 'g1', title: 'Daily companionship', description: 'Residents share meaningful time together in a calm, welcoming setting.', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80' },
    { id: 'g2', title: 'Wellbeing support', description: 'Compassionate care and daily routines designed around comfort.', image: 'https://images.unsplash.com/photo-1544022592-4f1881e4ca34?auto=format&fit=crop&w=900&q=80' },
    { id: 'g3', title: 'Nutritious meals', description: 'Fresh meals and hydration support for regular wellness.', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80' },
  ],
  team: [
    { id: 't1', name: 'Organization leadership', role: 'Care coordination', description: 'Coordinates resident support and community partnerships.', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80' },
    { id: 't2', name: 'Care Team', role: 'Resident support', description: 'Daily personal care, empathy, and practical support for a safe, dignified routine.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80' },
    { id: 't3', name: 'Wellbeing Team', role: 'Health & nutrition', description: 'Monitoring health needs, nourishment, and comfort to support better daily wellbeing.', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80' },
  ],
};

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [site, setSite] = useState(emptySite);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchSite = useCallback(async () => {
    const response = await fetch('/api/site', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Could not load published site content.');
    }
    return response.json();
  }, []);

  const loadSession = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/session', { cache: 'no-store' });
      if (response.status === 503) {
        const result = await response.json();
        throw new Error(result.error || 'Admin authentication is not configured.');
      }
      if (response.ok) {
        const data = await fetchSite();
        setSite(data);
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch (requestError) {
      setError(requestError.message || 'Could not check the admin session.');
    } finally {
      setChecking(false);
    }
  }, [fetchSite]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  function updateCollection(collection, index, field, value) {
    setSite((current) => ({
      ...current,
      [collection]: current[collection].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addCollectionItem(collection) {
    const templates = {
      needs: { title: '', description: '', priority: 'medium' },
      stats: { value: '', label: '', description: '' },
      gallery: { title: '', description: '', image: '' },
      team: { name: '', role: '', description: '', image: '' },
    };
    setSite((current) => ({
      ...current,
      [collection]: [...current[collection], { id: `${collection}-${Date.now()}`, ...templates[collection] }],
    }));
  }

  function removeCollectionItem(collection, index) {
    setSite((current) => ({
      ...current,
      [collection]: current[collection].filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Incorrect username or password.');
      }

      const data = await fetchSite();
      setSite(data);
      setCredentials({ username: '', password: '' });
      setAuthenticated(true);
    } catch (requestError) {
      setError(requestError.message || 'Could not sign in.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    setError('');
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Could not log out.');
      setAuthenticated(false);
      setStatus('Logged out.');
    } catch (requestError) {
      setError(requestError.message || 'Could not log out.');
    }
  }

  async function handleSave() {
    setError('');
    setStatus('Saving...');
    setSaving(true);
    try {
      const response = await fetch('/api/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(site),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save the changes.');
      setSite(result);
      setStatus('Changes saved and published.');
    } catch (requestError) {
      setError(requestError.message || 'Could not save the changes.');
      setStatus('');
    } finally {
      setSaving(false);
    }
  }

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center bg-[#faf7f0] text-[#163d32]">Checking session…</div>;
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3efe7] px-4">
        <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-[0_30px_60px_rgba(22,61,50,0.12)] ring-1 ring-[#e3eae6]">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#163d32] text-xl font-bold text-white">SV</div>
            <h1 className="text-3xl font-semibold text-[#163d32]">Admin login</h1>
            <p className="mt-2 text-sm text-[#5b615d]">Secure content management for Suryoday Vruddhashram.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2d342f]">Username</label>
              <input autoComplete="username" required value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} className="w-full rounded-xl border border-[#dfe7e2] px-4 py-3 outline-none ring-0 transition focus:border-[#24745a]" placeholder="Admin username" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2d342f]">Password</label>
              <input type="password" autoComplete="current-password" required value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} className="w-full rounded-xl border border-[#dfe7e2] px-4 py-3 outline-none transition focus:border-[#24745a]" placeholder="Admin password" />
            </div>
            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
            <button type="submit" disabled={submitting} className="primary-button w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Signing in…' : 'Sign in'}</button>
          </form>

          <div className="mt-6 rounded-xl bg-[#f9f5ee] p-3 text-center text-xs text-[#5b615d]">
            Admin sign-in is available only after secure server credentials are configured.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f0] px-4 py-8 text-[#282b28]">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-white p-6 shadow-[0_30px_60px_rgba(22,61,50,0.08)] ring-1 ring-[#edf0ed]">
        <div className="flex flex-col gap-4 border-b border-[#edf0ed] pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#24745a]">Content management</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#163d32]">Suryoday Vruddhashram dashboard</h1>
          </div>
          <button type="button" onClick={handleLogout} className="secondary-button">Log out</button>
        </div>

        {status && <div className="mt-6 rounded-xl border border-[#d7ebdf] bg-[#edf7f3] px-4 py-3 text-sm text-[#163d32]">{status}</div>}
        {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[1.5rem] border border-[#edf0ed] bg-[#f9f5ee] p-5">
            <h2 className="text-xl font-semibold text-[#163d32]">Organization details</h2>
            <div className="mt-4 space-y-4">
              <label className="block text-sm text-[#2d342f]">
                Organization name
                <input value={site.brand?.name || ''} onChange={(event) => setSite({ ...site, brand: { ...site.brand, name: event.target.value } })} className="mt-2 w-full rounded-xl border border-[#dfe7e2] px-3 py-2" />
              </label>
              <label className="block text-sm text-[#2d342f]">
                Tagline
                <input value={site.brand?.subtitle || ''} onChange={(event) => setSite({ ...site, brand: { ...site.brand, subtitle: event.target.value } })} className="mt-2 w-full rounded-xl border border-[#dfe7e2] px-3 py-2" />
              </label>
              <label className="block text-sm text-[#2d342f]">
                Organization tagline
                <input value={site.organization?.tagline || ''} onChange={(event) => setSite({ ...site, organization: { ...site.organization, tagline: event.target.value } })} className="mt-2 w-full rounded-xl border border-[#dfe7e2] px-3 py-2" />
              </label>
              <label className="block text-sm text-[#2d342f]">
                About text
                <textarea value={site.organization?.about || ''} onChange={(event) => setSite({ ...site, organization: { ...site.organization, about: event.target.value } })} rows={4} className="mt-2 w-full rounded-xl border border-[#dfe7e2] px-3 py-2" />
              </label>
              <label className="block text-sm text-[#2d342f]">
                Mission / approach
                <textarea value={site.organization?.mission || ''} onChange={(event) => setSite({ ...site, organization: { ...site.organization, mission: event.target.value } })} rows={3} className="mt-2 w-full rounded-xl border border-[#dfe7e2] px-3 py-2" />
              </label>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-[#edf0ed] bg-[#f9f5ee] p-5">
            <h2 className="text-xl font-semibold text-[#163d32]">Contact information</h2>
            <div className="mt-4 space-y-4">
              <label className="block text-sm text-[#2d342f]">
                Phone
                <input value={site.contact?.phone || ''} onChange={(event) => setSite({ ...site, contact: { ...site.contact, phone: event.target.value } })} className="mt-2 w-full rounded-xl border border-[#dfe7e2] px-3 py-2" />
              </label>
              <label className="block text-sm text-[#2d342f]">
                Email
                <input value={site.contact?.email || ''} onChange={(event) => setSite({ ...site, contact: { ...site.contact, email: event.target.value } })} className="mt-2 w-full rounded-xl border border-[#dfe7e2] px-3 py-2" />
              </label>
              <label className="block text-sm text-[#2d342f]">
                Address
                <textarea value={site.contact?.address || ''} onChange={(event) => setSite({ ...site, contact: { ...site.contact, address: event.target.value } })} rows={3} className="mt-2 w-full rounded-xl border border-[#dfe7e2] px-3 py-2" />
              </label>
              <label className="block text-sm text-[#2d342f]">
                WhatsApp message
                <textarea value={site.contact?.whatsappMessage || ''} onChange={(event) => setSite({ ...site, contact: { ...site.contact, whatsappMessage: event.target.value } })} rows={2} className="mt-2 w-full rounded-xl border border-[#dfe7e2] px-3 py-2" />
              </label>
              <label className="block text-sm text-[#2d342f]">
                Map link (HTTPS)
                <input type="url" value={site.contact?.mapUrl || ''} onChange={(event) => setSite({ ...site, contact: { ...site.contact, mapUrl: event.target.value } })} className="mt-2 w-full rounded-xl border border-[#dfe7e2] px-3 py-2" />
              </label>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-[1.5rem] border border-[#edf0ed] p-5">
          <h2 className="text-xl font-semibold text-[#163d32]">Support priorities</h2>
          <div className="mt-4 space-y-4">
            {site.needs?.map((item, index) => (
              <div key={item.id || index} className="rounded-2xl border border-[#edf0ed] bg-white p-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <input value={item.title || ''} onChange={(event) => {
                    updateCollection('needs', index, 'title', event.target.value);
                  }} className="rounded-xl border border-[#dfe7e2] px-3 py-2" placeholder="Title" aria-label={`Priority ${index + 1} title`} />
                  <input value={item.priority || 'medium'} onChange={(event) => {
                    updateCollection('needs', index, 'priority', event.target.value);
                  }} className="rounded-xl border border-[#dfe7e2] px-3 py-2" placeholder="Priority" aria-label={`Priority ${index + 1} importance`} />
                  <input value={item.id || ''} onChange={(event) => {
                    updateCollection('needs', index, 'id', event.target.value);
                  }} className="rounded-xl border border-[#dfe7e2] px-3 py-2" placeholder="ID" aria-label={`Priority ${index + 1} identifier`} />
                </div>
                <textarea value={item.description || ''} onChange={(event) => {
                  updateCollection('needs', index, 'description', event.target.value);
                }} rows={3} className="mt-3 w-full rounded-xl border border-[#dfe7e2] px-3 py-2" aria-label={`Priority ${index + 1} description`} />
                <button type="button" onClick={() => removeCollectionItem('needs', index)} className="mt-3 text-sm font-medium text-red-700 hover:underline">Remove priority</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addCollectionItem('needs')} className="secondary-button mt-4">Add priority</button>
        </section>

        <section className="mt-8 rounded-[1.5rem] border border-[#edf0ed] p-5">
          <h2 className="text-xl font-semibold text-[#163d32]">Impact numbers</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {site.stats?.map((item, index) => (
              <div key={item.id || index} className="rounded-2xl border border-[#edf0ed] bg-white p-4">
                <input value={item.value || ''} onChange={(event) => {
                  updateCollection('stats', index, 'value', event.target.value);
                }} className="w-full rounded-xl border border-[#dfe7e2] px-3 py-2" placeholder="Value" aria-label={`Impact item ${index + 1} value`} />
                <input value={item.label || ''} onChange={(event) => {
                  updateCollection('stats', index, 'label', event.target.value);
                }} className="mt-3 w-full rounded-xl border border-[#dfe7e2] px-3 py-2" placeholder="Label" aria-label={`Impact item ${index + 1} label`} />
                <button type="button" onClick={() => removeCollectionItem('stats', index)} className="mt-3 text-sm font-medium text-red-700 hover:underline">Remove impact item</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addCollectionItem('stats')} className="secondary-button mt-4">Add impact item</button>
        </section>

        <section className="mt-8 rounded-[1.5rem] border border-[#edf0ed] p-5">
          <h2 className="text-xl font-semibold text-[#163d32]">Gallery</h2>
          <p className="mt-2 text-sm text-[#5b615d]">Add HTTPS image URLs from images.unsplash.com. Direct file uploads are not configured.</p>
          <div className="mt-4 space-y-4">
            {site.gallery?.map((item, index) => (
              <div key={item.id || index} className="rounded-2xl border border-[#edf0ed] bg-white p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <input value={item.title || ''} onChange={(event) => updateCollection('gallery', index, 'title', event.target.value)} className="rounded-xl border border-[#dfe7e2] px-3 py-2" placeholder="Image title" aria-label={`Gallery image ${index + 1} title`} />
                  <input value={item.id || ''} onChange={(event) => updateCollection('gallery', index, 'id', event.target.value)} className="rounded-xl border border-[#dfe7e2] px-3 py-2" placeholder="Unique ID" aria-label={`Gallery image ${index + 1} identifier`} />
                  <input type="url" value={item.image || ''} onChange={(event) => updateCollection('gallery', index, 'image', event.target.value)} className="rounded-xl border border-[#dfe7e2] px-3 py-2 md:col-span-2" placeholder="https://images.unsplash.com/..." aria-label={`Gallery image ${index + 1} URL`} />
                </div>
                <textarea value={item.description || ''} onChange={(event) => updateCollection('gallery', index, 'description', event.target.value)} rows={2} className="mt-3 w-full rounded-xl border border-[#dfe7e2] px-3 py-2" placeholder="Image description" aria-label={`Gallery image ${index + 1} description`} />
                <button type="button" onClick={() => removeCollectionItem('gallery', index)} className="mt-3 text-sm font-medium text-red-700 hover:underline">Remove image</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addCollectionItem('gallery')} className="secondary-button mt-4">Add gallery image</button>
        </section>

        <section className="mt-8 rounded-[1.5rem] border border-[#edf0ed] p-5">
          <h2 className="text-xl font-semibold text-[#163d32]">People and care team</h2>
          <p className="mt-2 text-sm text-[#5b615d]">Use names, descriptions, and images authorized for public display.</p>
          <div className="mt-4 space-y-4">
            {site.team?.map((person, index) => (
              <div key={person.id || index} className="rounded-2xl border border-[#edf0ed] bg-white p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <input value={person.name || ''} onChange={(event) => updateCollection('team', index, 'name', event.target.value)} className="rounded-xl border border-[#dfe7e2] px-3 py-2" placeholder="Name or team" aria-label={`Team member ${index + 1} name`} />
                  <input value={person.role || ''} onChange={(event) => updateCollection('team', index, 'role', event.target.value)} className="rounded-xl border border-[#dfe7e2] px-3 py-2" placeholder="Role" aria-label={`Team member ${index + 1} role`} />
                  <input type="url" value={person.image || ''} onChange={(event) => updateCollection('team', index, 'image', event.target.value)} className="rounded-xl border border-[#dfe7e2] px-3 py-2 md:col-span-2" placeholder="https://images.unsplash.com/..." aria-label={`Team member ${index + 1} image URL`} />
                </div>
                <textarea value={person.description || ''} onChange={(event) => updateCollection('team', index, 'description', event.target.value)} rows={2} className="mt-3 w-full rounded-xl border border-[#dfe7e2] px-3 py-2" placeholder="Description" aria-label={`Team member ${index + 1} description`} />
                <button type="button" onClick={() => removeCollectionItem('team', index)} className="mt-3 text-sm font-medium text-red-700 hover:underline">Remove team entry</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addCollectionItem('team')} className="secondary-button mt-4">Add team entry</button>
        </section>

        <div className="mt-8 flex justify-end">
          <button type="button" onClick={handleSave} disabled={saving} className="primary-button disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Publishing…' : 'Save and publish'}</button>
        </div>
      </div>
    </main>
  );
}
