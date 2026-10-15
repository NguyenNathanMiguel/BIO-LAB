import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req), user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const { entry_id } = await req.json();
    if (typeof entry_id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(entry_id)) return Response.json({ error: 'Invalid entry' }, { status: 400 });
    const entry = await base44.entities.ObservationJournal.get(entry_id);
    if (!entry || (entry.created_by_id !== user.id && user.role !== 'admin' && !entry.is_shared)) return Response.json({ error: 'Forbidden' }, { status: 403 });
    if (entry.source !== 'microscope' || !entry.image_file_uri) return Response.json({ error: 'No capture' }, { status: 404 });
    const { signed_url } = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({ file_uri: entry.image_file_uri, expires_in: 300 });
    return Response.json({ signed_url });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}